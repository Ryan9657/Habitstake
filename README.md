# HabitStake

A stablecoin-powered commitment protocol prototype, built for Arc Chain (Circle's USDC-native L1).

**Wallet connection is real** — MetaMask, Rabby, and other injected wallets connect via wagmi/viem to Arc Testnet (chain ID 5042002), with real balance reads (native gas + ERC-20 USDC).

**Treasury Pool figure is real** — `/api/treasury-balance` reads the treasury wallet's live USDC balance once `TREASURY_ADDRESS` is set; falls back to the mock number until then.

**Escrow resolution backend exists but isn't wired to the UI yet** — `/api/resolve-challenge` calls `submit()` then `complete()`/`reject()` on the real ERC-8183 contract via **Circle Developer-Controlled Wallets** (no raw private keys held by this app) once Circle env vars are set. The "Lock Stake & Initiate Contract" button in the UI is still a `setTimeout` fake — deliberately, until the fund-destination hypothesis below is confirmed against the live contract. Don't remove that guard without running the verification script first.

**Fee model**: a flat 3% (`FEE_BPS` in `app/lib/contracts.js`) is meant to be taken off the top at commitment time, straight to treasury, non-refundable either way — separate from the escrowed principal. Not wired into the create-challenge flow yet (same reason as above).

Still simulated: the actual escrow call from the UI, AI check-in verification, leaderboard numbers.

## Run it locally

```bash
npm install
cp .env.local.example .env.local   # fill in what you have; everything is optional until you need it
npm run dev
```

Open http://localhost:3000. Connect with MetaMask or Rabby — you'll be prompted to add/switch to Arc Testnet if it's not already in your wallet. Get testnet USDC from https://faucet.circle.com.

## Set up Circle Developer-Controlled Wallets (treasury + oracle)

```bash
CIRCLE_API_KEY=your_key_here node scripts/setup-circle-wallets.mjs
```

Generates + registers an entity secret, creates a wallet set, and creates the treasury + oracle wallets on Arc Testnet — prints everything needed for `.env.local` (and Vercel's env vars later). **Save the entity secret and recovery file it prints somewhere secure** — they're the only recovery path if something goes wrong, and Circle never sees the entity secret in plaintext except during that one-time registration. Fund both printed addresses via the faucet afterward (Arc's gas is USDC, even for Circle-managed wallets).

## Verify the escrow mapping before wiring it up

```bash
node scripts/verify-erc8183-flow.mjs
```

Needs `PK_CLIENT` (one throwaway key, standing in for a real user's own wallet) plus the Circle env vars from the setup script above. Runs the real production signing path — client signs locally, treasury/oracle sign via Circle — and confirms `reject()` refunds the client while `complete()` pays the treasury, against the real deployed contract. Two PASS lines means it's safe to connect `/api/resolve-challenge` and the real create-challenge flow to the frontend.

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: HabitStake prototype"
```

Then either use the GitHub CLI (if installed):

```bash
gh repo create habitstake --public --source=. --push
```

Or create the repo manually on github.com, then:

```bash
git remote add origin https://github.com/<your-username>/habitstake.git
git branch -M main
git push -u origin main
```

## Deploy for public access

**Vercel (recommended — built by the Next.js team, zero config):**

```bash
npx vercel
```

Or connect your GitHub repo at https://vercel.com/new — every push to `main` auto-deploys. Set every var from `.env.local.example` you're using in the Vercel project's Environment Variables too — `CIRCLE_API_KEY`/`CIRCLE_ENTITY_SECRET`/`API_ADMIN_SECRET` especially should only ever live there, never in git.

## Remaining work before this is fully live

Roughly in priority order:

1. **Set up Circle wallets + run the verification script** (both above) — confirms the escrow fund-destination mapping before anything real depends on it.
2. **Wire the real create-challenge flow**: fee transfer + `createJob`/`setBudget`/`fund` from the UI, replacing the `setTimeout` fake — ready to build the moment #1 passes.
3. **Wire `/api/resolve-challenge` into an actual trigger** — right now it's a callable endpoint with no scheduler behind it. Needs a check-in record (a database) and something that calls it when a challenge's window ends (Vercel Cron is the simplest option).
4. **Treasury redistribution logic** — the 50/30/20 split from the original spec doesn't happen automatically; forfeited stakes land in the treasury wallet as a lump sum, and something needs to actually split and pay the reward-pool share out to successful stakers each period.
5. **Contract audit.** Non-negotiable before real USDC touches this.
6. **Real verification pipeline**, per level: vision-model call for photo evidence, GitHub API for commits, geolocation API for GPS. Self check-in (Level 1) is trivially gameable — fine for launch, worth flagging to users.
7. **On-chain + DB reads for Leaderboard.** Currently mock arrays — needs the same check-in database as #3, plus either a subgraph/indexer or a lightweight cache over contract events.
8. **Reputation badges as real NFTs**, if you want them portable/verifiable — an ERC-721/1155 minted on milestone completion, possibly tied into ERC-8004 identity.
9. **Mainnet migration.** Everything above targets Arc Testnet. Redeploy contracts on Arc Mainnet, repoint the frontend's chain config, use real USDC, and re-run the Circle wallet setup script for a mainnet entity/wallet set.
10. **Compliance check.** Taking custody of user funds via escrow can trigger money-transmission rules depending on jurisdiction — worth a conversation with someone who knows crypto regulation before this is public with real money.
11. **Abuse/rate-limit protection** on check-in endpoints once verification is real.
