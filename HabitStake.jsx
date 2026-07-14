import { useState } from 'react';
import {
  Shield, Flame, Wallet, ChevronDown, ChevronRight, ChevronLeft, Home, Rocket, Trophy,
  Landmark, Upload, CheckCircle2, Loader2, BookOpen, Dumbbell, Brain, Github, MapPin,
  Sparkles, Copy, Users, Lock, Star, Camera, Sun, Check, ExternalLink
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

/* --------------------------------------------------------------------- */
/* DATA                                                                   */
/* --------------------------------------------------------------------- */

const HABITS = [
  { id: 'read', label: 'Read', icon: BookOpen, tagline: 'Pages > excuses' },
  { id: 'exercise', label: 'Exercise', icon: Dumbbell, tagline: 'Move daily' },
  { id: 'meditate', label: 'Meditate', icon: Brain, tagline: 'Sit with it' },
  { id: 'code', label: 'Code / GitHub', icon: Github, tagline: 'Ship commits' },
  { id: 'custom', label: 'Custom', icon: Sparkles, tagline: 'Your own rules' },
];

const LENGTHS = [
  { days: 7, vibe: 'Warm-up' },
  { days: 14, vibe: 'Momentum' },
  { days: 21, vibe: 'Habit forming' },
  { days: 30, vibe: 'Classic' },
  { days: 60, vibe: 'Serious' },
  { days: 90, vibe: 'Transformation' },
];

const VERIFICATIONS = [
  { level: 1, label: 'Self Check-in', desc: 'Honor system — you mark each day done yourself.', icon: CheckCircle2, trust: 'Low trust' },
  { level: 2, label: 'Photo Evidence', desc: 'Upload a proof photo, verified by an AI oracle each day.', icon: Camera, trust: 'AI verified' },
  { level: 4, label: 'GitHub API', desc: 'Auto-verifies commits pushed to your linked repo.', icon: Github, trust: 'Auto-verified' },
  { level: 6, label: 'GPS Check-in', desc: 'Confirms your location matches the habit spot.', icon: MapPin, trust: 'Location-locked' },
];

const BADGE_COLORS = {
  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-950', border: 'border-emerald-800' },
  rose: { text: 'text-rose-400', bg: 'bg-rose-950', border: 'border-rose-800' },
  violet: { text: 'text-violet-400', bg: 'bg-violet-950', border: 'border-violet-800' },
  amber: { text: 'text-amber-400', bg: 'bg-amber-950', border: 'border-amber-800' },
  blue: { text: 'text-blue-400', bg: 'bg-blue-950', border: 'border-blue-800' },
};

const DOT_COLORS = {
  emerald: 'bg-emerald-500',
  violet: 'bg-violet-500',
  rose: 'bg-rose-500',
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
};

const BADGES = [
  { id: 1, name: 'Book Worm', icon: BookOpen, color: 'emerald', earned: true },
  { id: 2, name: '30 Day Warrior', icon: Flame, color: 'rose', earned: true },
  { id: 3, name: 'Never Missed', icon: Star, color: 'violet', earned: true },
  { id: 4, name: 'Early Riser', icon: Sun, color: 'amber', earned: false },
  { id: 5, name: 'Code Streaker', icon: Github, color: 'blue', earned: true },
  { id: 6, name: 'Century Club', icon: Trophy, color: 'violet', earned: false },
];

const LEADERBOARDS = {
  global: [
    { rank: 1, name: 'ada_builds', xp: 12840, streak: 61, color: 'emerald' },
    { rank: 2, name: 'kwame.eth', xp: 11920, streak: 44, color: 'violet' },
    { rank: 3, name: 'zoe_runs', xp: 10775, streak: 58, color: 'rose' },
    { rank: 4, name: 'devon_codes', xp: 9410, streak: 33, color: 'blue' },
    { rank: 5, name: 'you', xp: 8260, streak: 12, color: 'amber', isYou: true },
  ],
  friends: [
    { rank: 1, name: 'you', xp: 8260, streak: 12, color: 'amber', isYou: true },
    { rank: 2, name: 'tobi_reads', xp: 6120, streak: 9, color: 'emerald' },
    { rank: 3, name: 'chidi_lifts', xp: 4890, streak: 5, color: 'blue' },
  ],
  university: [
    { rank: 1, name: 'blessing_o', xp: 15200, streak: 74, color: 'violet' },
    { rank: 2, name: 'ada_builds', xp: 12840, streak: 61, color: 'emerald' },
    { rank: 3, name: 'you', xp: 8260, streak: 12, color: 'amber', isYou: true },
    { rank: 4, name: 'femi_k', xp: 7100, streak: 20, color: 'rose' },
  ],
};

const TREASURY = {
  tvl: 142520,
  activeUsers: 1420,
  pool: 12450,
  split: [
    { name: 'Reward Pool', value: 50, color: '#10b981' },
    { name: 'Ecosystem Treasury', value: 30, color: '#8b5cf6' },
    { name: 'Developer Fund', value: 20, color: '#f43f5e' },
  ],
};

const INITIAL_CHALLENGES = [
  { id: 1, habitId: 'exercise', title: '30-Day Fitness Beast', day: 12, length: 30, streak: 12, stake: 50, checkedInToday: false },
];

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'create', label: 'Create Challenge', icon: Rocket },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'treasury', label: 'Treasury & Economy', icon: Landmark },
];

/* --------------------------------------------------------------------- */
/* HELPERS                                                                */
/* --------------------------------------------------------------------- */

function fmtUSDC(n) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function ProgressRing({ id, day, total, size = 132, stroke = 10 }) {
  const fraction = Math.min(day / total, 1);
  const radius = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - fraction);
  const angle = -90 + fraction * 360;
  const rad = (angle * Math.PI) / 180;
  const flameX = cx + radius * Math.cos(rad);
  const flameY = cy + radius * Math.sin(rad);
  const gradId = `ring-grad-${id}`;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <circle cx={cx} cy={cy} r={radius} stroke="#27272a" strokeWidth={stroke} fill="none" />
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={`url(#${gradId})`}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      {fraction > 0 && (
        <div
          className="absolute flex items-center justify-center w-6 h-6 rounded-full bg-slate-950 border border-rose-500"
          style={{ left: flameX - 12, top: flameY - 12, boxShadow: '0 0 16px rgba(244,63,94,0.55)' }}
        >
          <Flame size={13} className="text-rose-400" />
        </div>
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-50" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{day}</span>
        <span className="text-xs text-slate-500">of {total} days</span>
      </div>
    </div>
  );
}

function NetworkBadge() {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-slate-800">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <span className="text-xs font-medium text-slate-300" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
        Arc Mainnet <span className="text-slate-600">·</span> Native USDC Gas
      </span>
    </div>
  );
}

function WalletWidget({ connected, connecting, address, onConnect, onDisconnect }) {
  const [open, setOpen] = useState(false);
  const [providerMenuOpen, setProviderMenuOpen] = useState(false);

  if (!connected) {
    return (
      <div className="relative">
        <button
          onClick={() => setProviderMenuOpen((v) => !v)}
          disabled={connecting}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold hover:from-violet-500 hover:to-blue-500 transition-all disabled:opacity-60"
        >
          {connecting ? <Loader2 size={16} className="animate-spin" /> : <Wallet size={16} />}
          {connecting ? 'Connecting…' : 'Connect Wallet'}
        </button>
        {providerMenuOpen && !connecting && (
          <div className="absolute right-0 mt-2 w-56 rounded-xl bg-zinc-900 border border-slate-800 shadow-2xl p-2 z-50">
            {['MetaMask', 'Rabby', 'WalletConnect'].map((p) => (
              <button
                key={p}
                onClick={() => { setProviderMenuOpen(false); onConnect(); }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:bg-slate-800 transition-colors flex items-center justify-between"
              >
                {p}
                <ChevronRight size={14} className="text-slate-600" />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-xl bg-zinc-900 border border-slate-800 hover:border-slate-700 transition-colors"
      >
        <div className="text-right leading-tight">
          <div className="text-xs font-semibold text-emerald-400" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{fmtUSDC(250)} USDC</div>
          <div className="text-[10px] text-slate-500" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>0.005 ARC gas reserve</div>
        </div>
        <div className="w-px h-8 bg-slate-800" />
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-emerald-500" />
          <span className="text-xs font-medium text-slate-300" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{address}</span>
          <ChevronDown size={14} className="text-slate-500" />
        </div>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-zinc-900 border border-slate-800 shadow-2xl p-2 z-50">
          <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 flex items-center gap-2">
            <Copy size={13} /> Copy address
          </button>
          <button onClick={() => { setOpen(false); onDisconnect(); }} className="w-full text-left px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-slate-800">
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}

function Sidebar({ view, setView }) {
  return (
    <aside className="hidden md:flex md:w-60 shrink-0 flex-col border-r border-slate-900 bg-zinc-950 px-3 py-6 gap-1">
      {NAV_ITEMS.map((item) => {
        const active = view === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative overflow-hidden ${
              active ? 'text-slate-50 bg-zinc-900' : 'text-slate-500 hover:text-slate-300 hover:bg-zinc-900'
            }`}
          >
            {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-gradient-to-b from-violet-500 to-emerald-500" />}
            <Icon size={17} className={active ? 'text-violet-400' : ''} />
            {item.label}
          </button>
        );
      })}
      <div className="mt-auto pt-4 border-t border-slate-900">
        <p className="text-[11px] leading-relaxed text-slate-600 px-3">
          Arc Chain: fast settlements, sub-second finality, no volatile tokens.
        </p>
      </div>
    </aside>
  );
}

/* --------------------------------------------------------------------- */
/* DASHBOARD                                                              */
/* --------------------------------------------------------------------- */

function CheckInPanel({ challenge, onComplete }) {
  const [phase, setPhase] = useState('idle'); // idle | processing | done
  const [confidence, setConfidence] = useState(0);

  const handleUpload = () => {
    if (challenge.checkedInToday || phase !== 'idle') return;
    setPhase('processing');
    setConfidence(0);
    let c = 0;
    const interval = setInterval(() => {
      c += Math.random() * 18 + 8;
      if (c >= 97) {
        c = 97;
        setConfidence(c);
        clearInterval(interval);
        setTimeout(() => {
          setPhase('done');
          onComplete(challenge.id);
        }, 500);
      } else {
        setConfidence(c);
      }
    }, 220);
  };

  if (challenge.checkedInToday || phase === 'done') {
    return (
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 text-sm font-medium">
        <CheckCircle2 size={16} />
        Day {challenge.day} completed — nice work.
      </div>
    );
  }

  if (phase === 'processing') {
    return (
      <div className="px-4 py-3 rounded-xl bg-violet-950 border border-violet-800">
        <div className="flex items-center gap-2 text-violet-300 text-sm font-medium mb-2">
          <Loader2 size={15} className="animate-spin" />
          Analyzing proof via Oracle LLM…
        </div>
        <div className="h-1.5 rounded-full bg-slate-900 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 transition-all duration-300" style={{ width: `${confidence}%` }} />
        </div>
        <p className="text-[11px] text-violet-400 mt-1.5" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{confidence.toFixed(0)}% confidence</p>
      </div>
    );
  }

  return (
    <button
      onClick={handleUpload}
      className="w-full flex flex-col items-center justify-center gap-2 py-5 rounded-xl border-2 border-dashed border-slate-800 hover:border-violet-700 hover:bg-violet-950 transition-all group"
    >
      <Upload size={18} className="text-slate-600 group-hover:text-violet-400 transition-colors" />
      <span className="text-sm text-slate-500 group-hover:text-slate-300">Upload proof to check in</span>
    </button>
  );
}

function ActiveChallengeCard({ challenge, onComplete }) {
  const habit = HABITS.find((h) => h.id === challenge.habitId) || HABITS[0];
  const Icon = habit.icon;
  return (
    <div className="rounded-2xl bg-zinc-900 border border-slate-800 p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-violet-950 border border-violet-800 flex items-center justify-center">
            <Icon size={16} className="text-violet-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">{challenge.title}</h3>
            <p className="text-xs text-slate-500">{fmtUSDC(challenge.stake)} USDC staked</p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-rose-950 border border-rose-800">
          <Flame size={12} className="text-rose-400" />
          <span className="text-xs font-semibold text-rose-400">{challenge.streak}</span>
        </div>
      </div>
      <div className="flex justify-center py-1">
        <ProgressRing id={challenge.id} day={challenge.day} total={challenge.length} />
      </div>
      <CheckInPanel challenge={challenge} onComplete={onComplete} />
    </div>
  );
}

function DashboardView({ challenges, onComplete, goCreate }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-50" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Active Challenges</h1>
        <p className="text-sm text-slate-500 mt-1">Stake USDC. Show up daily. Keep what you commit.</p>
      </div>
      {challenges.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 py-16 flex flex-col items-center gap-3">
          <Rocket size={28} className="text-slate-700" />
          <p className="text-slate-400 text-sm">No active commitments yet.</p>
          <button onClick={goCreate} className="mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold">
            Start a Challenge
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {challenges.map((c) => (
            <ActiveChallengeCard key={c.id} challenge={c} onComplete={onComplete} />
          ))}
        </div>
      )}
    </div>
  );
}

/* --------------------------------------------------------------------- */
/* CREATE CHALLENGE WIZARD                                                */
/* --------------------------------------------------------------------- */

function StepIndicator({ step }) {
  const steps = ['Habit', 'Length', 'Verification', 'Stake'];
  return (
    <div className="flex items-center mb-8">
      {steps.map((label, i) => {
        const n = i + 1;
        const active = n === step;
        const done = n < step;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                  done
                    ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                    : active
                    ? 'bg-violet-600 border-violet-500 text-white'
                    : 'bg-zinc-900 border-slate-800 text-slate-600'
                }`}
              >
                {done ? <Check size={15} /> : n}
              </div>
              <span className={`text-[11px] ${active ? 'text-slate-200' : 'text-slate-600'}`}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px mx-2 mb-4 ${done ? 'bg-emerald-600' : 'bg-slate-800'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function CreateChallengeView({ onDeploy }) {
  const [step, setStep] = useState(1);
  const [habitId, setHabitId] = useState(null);
  const [length, setLength] = useState(null);
  const [verification, setVerification] = useState(null);
  const [stake, setStake] = useState('');
  const [txPhase, setTxPhase] = useState('idle'); // idle | signing | deploying | success

  const canContinue =
    (step === 1 && habitId) ||
    (step === 2 && length) ||
    (step === 3 && verification) ||
    (step === 4 && Number(stake) > 0);

  const handleDeploy = () => {
    setTxPhase('signing');
    setTimeout(() => {
      setTxPhase('deploying');
      setTimeout(() => {
        setTxPhase('success');
      }, 1600);
    }, 1300);
  };

  const finish = () => {
    const habit = HABITS.find((h) => h.id === habitId);
    onDeploy({
      id: Date.now(),
      habitId,
      title: `${length}-Day ${habit.label} Challenge`,
      day: 0,
      length,
      streak: 0,
      stake: Number(stake),
      checkedInToday: false,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-50 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>New Commitment</h1>
      <p className="text-sm text-slate-500 mb-8">Four steps. One contract. Zero excuses.</p>

      <StepIndicator step={step} />

      {step === 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {HABITS.map((h) => {
            const Icon = h.icon;
            const sel = habitId === h.id;
            return (
              <button
                key={h.id}
                onClick={() => setHabitId(h.id)}
                style={sel ? { boxShadow: '0 0 0 1px rgba(139,92,246,0.4), 0 0 24px rgba(139,92,246,0.25)' } : undefined}
                className={`flex flex-col items-center gap-2 p-5 rounded-2xl border transition-all ${
                  sel ? 'border-violet-500 bg-violet-950' : 'border-slate-800 bg-zinc-900 hover:border-slate-700'
                }`}
              >
                <Icon size={22} className={sel ? 'text-violet-400' : 'text-slate-500'} />
                <span className={`text-sm font-medium ${sel ? 'text-slate-100' : 'text-slate-400'}`}>{h.label}</span>
                <span className="text-[11px] text-slate-600">{h.tagline}</span>
              </button>
            );
          })}
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-3 gap-3">
          {LENGTHS.map((l) => {
            const sel = length === l.days;
            return (
              <button
                key={l.days}
                onClick={() => setLength(l.days)}
                style={sel ? { boxShadow: '0 0 0 1px rgba(16,185,129,0.4), 0 0 24px rgba(16,185,129,0.25)' } : undefined}
                className={`flex flex-col items-center gap-1 p-5 rounded-2xl border transition-all ${
                  sel ? 'border-emerald-500 bg-emerald-950' : 'border-slate-800 bg-zinc-900 hover:border-slate-700'
                }`}
              >
                <span className={`text-2xl font-bold ${sel ? 'text-emerald-400' : 'text-slate-200'}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{l.days}</span>
                <span className="text-xs text-slate-500">days</span>
                <span className="text-[11px] text-slate-600 mt-1">{l.vibe}</span>
              </button>
            );
          })}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          {VERIFICATIONS.map((v) => {
            const Icon = v.icon;
            const sel = verification === v.level;
            return (
              <button
                key={v.level}
                onClick={() => setVerification(v.level)}
                style={sel ? { boxShadow: '0 0 0 1px rgba(59,130,246,0.4), 0 0 24px rgba(59,130,246,0.25)' } : undefined}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                  sel ? 'border-blue-500 bg-blue-950' : 'border-slate-800 bg-zinc-900 hover:border-slate-700'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${sel ? 'bg-blue-900' : 'bg-slate-900'}`}>
                  <Icon size={18} className={sel ? 'text-blue-300' : 'text-slate-500'} />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-semibold text-slate-100">Level {v.level} · {v.label}</span>
                  <p className="text-xs text-slate-500 mt-0.5">{v.desc}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-1 rounded-full whitespace-nowrap ${sel ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {v.trust}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-zinc-900 border border-slate-800 p-5">
            <label className="text-xs text-slate-500 mb-2 block">Stake amount</label>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-slate-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>$</span>
              <input
                type="number"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                placeholder="50"
                className="flex-1 bg-transparent text-3xl font-bold text-slate-50 outline-none placeholder-slate-700 min-w-0"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              />
              <span className="text-sm font-semibold text-emerald-400">USDC</span>
            </div>
            <p className="text-xs text-slate-600 mt-3">
              Succeed and you keep your stake plus XP. Miss too many days and it's forfeited to the reward pool.
            </p>
          </div>
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-500">Gas cost estimate</span>
            <span className="text-xs font-semibold text-emerald-400" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>$0.002 USDC</span>
          </div>
          <p className="text-[11px] text-slate-600 text-center">
            Arc Chain: fast settlements, sub-second finality, no volatile tokens — gas is paid natively in USDC.
          </p>
        </div>
      )}

      <div className="flex items-center gap-3 mt-8">
        {step > 1 && (
          <button onClick={() => setStep((s) => s - 1)} className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 text-sm font-medium hover:bg-zinc-900 flex items-center gap-1.5">
            <ChevronLeft size={15} /> Back
          </button>
        )}
        {step < 4 && (
          <button
            disabled={!canContinue}
            onClick={() => setStep((s) => s + 1)}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            Continue <ChevronRight size={15} />
          </button>
        )}
        {step === 4 && (
          <button
            disabled={!canContinue}
            onClick={handleDeploy}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-violet-600 text-white text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            <Lock size={15} /> Lock Stake & Initiate Contract
          </button>
        )}
      </div>

      {txPhase !== 'idle' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(2,6,23,0.8)' }}
        >
          <div className="w-full max-w-sm mx-4 rounded-2xl bg-zinc-900 border border-slate-800 p-7 text-center">
            {txPhase === 'signing' && (
              <>
                <Loader2 size={32} className="animate-spin text-violet-400 mx-auto mb-4" />
                <h3 className="text-slate-100 font-semibold mb-1">Confirm in wallet</h3>
                <p className="text-xs text-slate-500">Sign the transaction to lock your stake.</p>
              </>
            )}
            {txPhase === 'deploying' && (
              <>
                <Loader2 size={32} className="animate-spin text-blue-400 mx-auto mb-4" />
                <h3 className="text-slate-100 font-semibold mb-1">Deploying contract to Arc</h3>
                <p className="text-xs text-slate-500">Sub-second finality — almost there.</p>
              </>
            )}
            {txPhase === 'success' && (
              <>
                <div
                  className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-700 flex items-center justify-center mx-auto mb-4"
                  style={{ boxShadow: '0 0 30px rgba(16,185,129,0.35)' }}
                >
                  <CheckCircle2 size={26} className="text-emerald-400" />
                </div>
                <h3 className="text-slate-100 font-semibold mb-1">Success! Contract Deployed</h3>
                <p className="text-[11px] text-slate-500 mb-2" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  0x9f2a…c81e · Arc Testnet Block #48213
                </p>
                <div className="mb-5">
                  <a
                    href="https://testnet.arcscan.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-violet-400 hover:text-violet-300 inline-flex items-center gap-1"
                  >
                    View on Arcscan <ExternalLink size={11} />
                  </a>
                </div>
                <button
                  onClick={finish}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-emerald-600 text-white text-sm font-semibold"
                >
                  Go to Dashboard
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* --------------------------------------------------------------------- */
/* LEADERBOARD                                                            */
/* --------------------------------------------------------------------- */

function XPCard() {
  const currentXP = 8260;
  const levelFloor = 8000;
  const levelCeil = 10000;
  const pct = ((currentXP - levelFloor) / (levelCeil - levelFloor)) * 100;
  return (
    <div className="rounded-2xl bg-zinc-900 border border-slate-800 p-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-slate-500">Current Level</p>
          <h3 className="text-lg font-bold text-slate-50" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Level 5 · Builder</h3>
        </div>
        <div className="flex items-center gap-2 text-right">
          <div>
            <p className="text-xs text-slate-500">Next</p>
            <p className="text-sm font-semibold text-violet-400">Level 6 · Master</p>
          </div>
          <Trophy size={22} className="text-violet-400" />
        </div>
      </div>
      <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-violet-500 to-blue-500" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[11px] text-slate-600 mt-2" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
        {currentXP.toLocaleString()} / {levelCeil.toLocaleString()} XP
      </p>
    </div>
  );
}

function BadgeGallery() {
  return (
    <div className="rounded-2xl bg-zinc-900 border border-slate-800 p-6">
      <h3 className="text-sm font-semibold text-slate-200 mb-4">Reputation Badges</h3>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {BADGES.map((b) => {
          const Icon = b.icon;
          const c = BADGE_COLORS[b.color];
          return (
            <div
              key={b.id}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                b.earned ? `${c.bg} ${c.border} hover:scale-105` : 'bg-slate-900 border-slate-800 opacity-40'
              }`}
            >
              <Icon size={20} className={b.earned ? c.text : 'text-slate-600'} />
              <span className={`text-[10px] text-center leading-tight ${b.earned ? 'text-slate-300' : 'text-slate-600'}`}>{b.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LeaderboardTable({ rows }) {
  return (
    <div className="rounded-2xl bg-zinc-900 border border-slate-800 overflow-hidden overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800 text-slate-600 text-xs">
            <th className="text-left font-medium py-3 px-4">Rank</th>
            <th className="text-left font-medium py-3 px-4">Builder</th>
            <th className="text-right font-medium py-3 px-4">Streak</th>
            <th className="text-right font-medium py-3 px-4">XP</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.rank} className={`border-b border-slate-900 last:border-0 ${r.isYou ? 'bg-violet-950' : ''}`}>
              <td className="py-3 px-4 text-slate-500">#{r.rank}</td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full ${DOT_COLORS[r.color]}`} />
                  <span className={`font-medium ${r.isYou ? 'text-violet-300' : 'text-slate-200'}`}>{r.name}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-right text-rose-400 font-medium">{r.streak}🔥</td>
              <td className="py-3 px-4 text-right text-slate-300" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{r.xp.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LeaderboardView() {
  const [tab, setTab] = useState('global');
  const tabs = [
    { id: 'global', label: 'Global' },
    { id: 'friends', label: 'Friends' },
    { id: 'university', label: 'Lagos State University League' },
  ];
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-50" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Leaderboard & Reputation</h1>
        <p className="text-sm text-slate-500 mt-1">On-chain proof of showing up.</p>
      </div>
      <XPCard />
      <BadgeGallery />
      <div>
        <div className="flex gap-1 mb-3 border-b border-slate-800 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                tab === t.id ? 'text-violet-400 border-violet-500' : 'text-slate-500 border-transparent hover:text-slate-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <LeaderboardTable rows={LEADERBOARDS[tab]} />
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------- */
/* TREASURY                                                               */
/* --------------------------------------------------------------------- */

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-2xl bg-zinc-900 border border-slate-800 p-5">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${accent.bg}`}>
        <Icon size={16} className={accent.text} />
      </div>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-slate-50" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{value}</p>
    </div>
  );
}

function TreasuryView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-50" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Treasury & Economy</h1>
        <p className="text-sm text-slate-500 mt-1">The token-free engine behind every stake.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard icon={Lock} label="Total Value Locked" value={`$${TREASURY.tvl.toLocaleString()}`} accent={{ bg: 'bg-emerald-950', text: 'text-emerald-400' }} />
        <StatCard icon={Users} label="Active Commitments" value={`${TREASURY.activeUsers.toLocaleString()} Users`} accent={{ bg: 'bg-blue-950', text: 'text-blue-400' }} />
        <StatCard icon={Landmark} label="Treasury Pool" value={`$${TREASURY.pool.toLocaleString()}`} accent={{ bg: 'bg-violet-950', text: 'text-violet-400' }} />
      </div>
      <div className="rounded-2xl bg-zinc-900 border border-slate-800 p-6">
        <h3 className="text-sm font-semibold text-slate-200 mb-1">Forfeited Stake Distribution</h3>
        <p className="text-xs text-slate-500 mb-4">Where a missed commitment's stake goes.</p>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div style={{ width: 200, height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={TREASURY.split} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3}>
                  {TREASURY.split.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 w-full space-y-3">
            {TREASURY.split.map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-sm text-slate-300">{s.name}</span>
                </div>
                <span className="text-sm font-semibold text-slate-100" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------- */
/* APP SHELL                                                              */
/* --------------------------------------------------------------------- */

export default function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [view, setView] = useState('dashboard');
  const [challenges, setChallenges] = useState(INITIAL_CHALLENGES);

  const handleConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setWalletConnected(true);
    }, 1100);
  };

  const handleCompleteCheckIn = (id) => {
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, day: Math.min(c.day + 1, c.length), streak: c.streak + 1, checkedInToday: true }
          : c
      )
    );
  };

  const handleDeployChallenge = (newChallenge) => {
    setChallenges((prev) => [newChallenge, ...prev]);
    setView('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeInUp 0.45s ease-out; }
      `}</style>

      <Sidebar view={view} setView={setView} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4 border-b border-slate-900 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-emerald-500 flex items-center justify-center relative">
              <Shield size={18} className="text-white" />
              <Flame size={11} className="text-rose-300 absolute -bottom-1 -right-1" />
            </div>
            <span className="text-base font-bold text-slate-50 hidden sm:block" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>HabitStake</span>
          </div>
          <div className="hidden lg:block">
            <NetworkBadge />
          </div>
          <WalletWidget
            connected={walletConnected}
            connecting={connecting}
            address="0x7a...49f"
            onConnect={handleConnect}
            onDisconnect={() => setWalletConnected(false)}
          />
        </header>

        <nav className="md:hidden flex items-center gap-1 px-3 py-2 border-b border-slate-900 overflow-x-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  active ? 'bg-zinc-900 text-violet-400' : 'text-slate-500'
                }`}
              >
                <Icon size={13} /> {item.label}
              </button>
            );
          })}
        </nav>

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-8">
          <div key={view} className="max-w-6xl mx-auto w-full animate-fade-in">
            {view === 'dashboard' && (
              <DashboardView challenges={challenges} onComplete={handleCompleteCheckIn} goCreate={() => setView('create')} />
            )}
            {view === 'create' && <CreateChallengeView onDeploy={handleDeployChallenge} />}
            {view === 'leaderboard' && <LeaderboardView />}
            {view === 'treasury' && <TreasuryView />}
          </div>
        </main>
      </div>
    </div>
  );
}
