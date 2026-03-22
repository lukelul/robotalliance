import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { leadership, people } from '../data/mockData'
import Avatar from '../components/Avatar'
import { useUser } from '../context/UserContext'
import { useTheme } from '../context/ThemeContext'

const partners = [
  { name: 'Boston Dynamics', category: 'Robotics Hardware', initials: 'BD', color: '#0ea5e9' },
  { name: 'ABB Robotics', category: 'Industrial Automation', initials: 'ABB', color: '#ef4444' },
  { name: 'NVIDIA', category: 'AI & Compute', initials: 'NV', color: '#76b900' },
  { name: 'Softbank Robotics', category: 'Service Robotics', initials: 'SB', color: '#6366f1' },
  { name: 'Teradyne', category: 'Collaborative Robots', initials: 'TR', color: '#f59e0b' },
  { name: 'Fanuc', category: 'Industrial Robotics', initials: 'FA', color: '#f97316' },
  { name: 'iRobot', category: 'Consumer Robotics', initials: 'IR', color: '#10b981' },
  { name: 'Agility Robotics', category: 'Humanoid Robots', initials: 'AR', color: '#8b5cf6' },
]

const stats = [
  { value: '340+', label: 'Member Organizations' },
  { value: '$8.2B', label: 'Collective Funding' },
  { value: '47',   label: 'Countries Represented' },
  { value: '12',   label: 'Active Standards Committees' },
]

const pillars = [
  {
    size: 'large',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Trusted Network',
    desc: 'Connect with verified robotics professionals — founders, engineers, investors, and policymakers building the future of intelligent machines. Every member is vetted.',
    accent: '#06b6d4',
  },
  {
    size: 'normal',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Industry Coordination',
    desc: 'Align companies, researchers, and investors around shared standards and interoperability.',
    accent: '#818cf8',
  },
  {
    size: 'normal',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Governance & Standards',
    desc: 'Shape ethical AI-robotics policy and safety frameworks with global reach.',
    accent: '#34d399',
  },
  {
    size: 'normal',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Capital & Investment',
    desc: 'Exclusive investor relations and deal flow across the full funding spectrum.',
    accent: '#fbbf24',
  },
  {
    size: 'normal',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    title: 'R&D Collaboration',
    desc: 'Cross-company research initiatives, shared datasets, and academic partnerships.',
    accent: '#f472b6',
  },
  {
    size: 'wide',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
    ),
    title: 'Global Reach',
    desc: 'Members and partner organizations spanning North America, Europe, and Asia — unified around a shared vision for safe, beneficial robotics.',
    accent: '#06b6d4',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const { setShowAuthModal, isGuest } = useUser()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [form, setForm] = useState({ name: '', org: '', email: '', role: '' })
  const [submitted, setSubmitted] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)
  const [transitioning, setTransitioning] = useState(false)

  const enterPlatform = () => {
    setTransitioning(true)
    setTimeout(() => navigate('/'), 520)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email) return
    setSubmitted(true)
  }

  // preview people: mix of leadership + community members
  const previewAvatars = [...leadership.slice(0, 3), ...people.slice(0, 3)]

  const bg = isDark ? '#020814' : '#ffffff'
  const navBg = isDark ? '#060f1e' : '#ffffff'
  const navBorder = isDark ? 'rgba(14,165,233,0.08)' : 'rgba(0,0,0,0.08)'
  const cardBg = isDark ? 'rgba(4, 13, 26, 0.22)' : 'rgba(0,105,180,0.03)'
  const cardBorder = isDark ? '1px solid rgba(14,165,233,0.12)' : '1px solid rgba(0,0,0,0.08)'
  const cardStyle = { background: cardBg, border: cardBorder }
  const textPrimary = isDark ? '#ffffff' : '#0f172a'
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : 'rgba(15,23,42,0.6)'
  const textFaint = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(15,23,42,0.4)'
  const inputBg = isDark ? 'rgba(14,165,233,0.05)' : 'rgba(0,0,0,0.03)'
  const inputBorder = isDark ? 'rgba(14,165,233,0.15)' : 'rgba(0,0,0,0.12)'
  const inputText = isDark ? '#ffffff' : '#0f172a'
  const optionBg = isDark ? '#040d1a' : '#ffffff'
  const footerBg = isDark ? 'rgba(2,8,20,0.6)' : 'rgba(248,250,252,0.9)'
  const footerBorder = isDark ? 'rgba(14,165,233,0.08)' : 'rgba(0,0,0,0.08)'

  return (
    <div className="landing-page min-h-screen relative overflow-x-hidden" style={{ background: bg, color: textPrimary }}>

      {/* ── Portal transition overlay ─────────────────────────────────── */}
      {transitioning && (
        <div
          className="fixed inset-0 z-[200] portal-overlay flex items-center justify-center"
          style={{ background: bg }}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #0284c7)', boxShadow: '0 0 40px rgba(6,182,212,0.5)' }}>
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm tracking-wider" style={{ color: textMuted }}>Entering platform…</span>
          </div>
        </div>
      )}

      {/* ── Background glow orbs ──────────────────────────────────────── */}
      {isDark && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          <div className="glow-drift absolute rounded-full"
            style={{ width: 600, height: 600, top: '-10%', left: '30%', background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)' }} />
          <div className="glow-drift absolute rounded-full"
            style={{ width: 500, height: 500, top: '40%', right: '-10%', background: 'radial-gradient(circle, rgba(129,140,248,0.05) 0%, transparent 70%)', animationDelay: '-5s' }} />
        </div>
      )}

      {/* ── Nav ───────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-20"
        style={{ background: navBg, borderBottom: `1px solid ${navBorder}` }}>

        <div className="flex items-center gap-2" />

        <div className="hidden md:flex items-center gap-6">
          <button onClick={() => navigate('/leadership')}
            className="text-sm transition-colors hover:text-cyan-500" style={{ color: textMuted }}>Leadership</button>
          <button onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-sm transition-colors hover:text-cyan-500" style={{ color: textMuted }}>Request Premium Access</button>
        </div>

        <div className="flex items-center gap-2">
          {isGuest ? (
            <button
              onClick={() => { enterPlatform(); setTimeout(() => setShowAuthModal(true), 540) }}
              className="text-sm transition-colors px-3 py-1.5 hidden sm:block hover:text-cyan-500" style={{ color: textMuted }}
            >
              Sign In
            </button>
          ) : (
            <button
              onClick={enterPlatform}
              className="text-sm transition-colors px-3 py-1.5 hidden sm:block hover:text-cyan-500" style={{ color: textMuted }}
            >
              Enter Platform
            </button>
          )}
          <button
            onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', boxShadow: '0 0 16px rgba(14,165,233,0.2)' }}
          >
            Request Premium Access
          </button>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative z-10 min-h-screen flex flex-col items-start justify-end text-left pt-16 pb-[22vh] px-8 sm:px-16">

        {/* ── Node network graphic ─────────────────────────────────── */}
        <div className="absolute top-20 right-0 w-[55%] h-[60%] pointer-events-none opacity-60 fade-up-1" style={{ zIndex: 0 }}>
          <svg width="100%" height="100%" viewBox="0 0 600 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>

            {/* Edges */}
            {[
              [95,55, 330,150], [330,150, 540,60],
              [540,60, 670,135], [330,150, 470,240],
              [95,55, 230,290], [230,290, 470,240],
              [470,240, 670,135], [470,240, 620,370],
              [230,290, 380,430], [620,370, 380,430],
              [670,135, 620,370],
            ].map(([x1,y1,x2,y2], i) => (
              <line key={`e${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="url(#edgeGrad)" strokeWidth="1.5" opacity="0.45">
                <animate attributeName="opacity" values="0.25;0.55;0.25" dur={`${4 + (i % 3)}s`} repeatCount="indefinite" />
              </line>
            ))}

            {/* Nodes */}
            {[
              [95,55],[330,150],[540,60],
              [670,135],[230,290],[470,240],
              [620,370],[380,430],
            ].map(([x,y], i) => (
              <circle key={`n${i}`} cx={x} cy={y} r={8} fill="#06b6d4" />
            ))}
          </svg>
        </div>

        <div className="relative fade-up-1" style={{ zIndex: 1 }}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium text-cyan-500 mb-8"
            style={{ background: isDark ? 'rgba(6,182,212,0.08)' : 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Now accepting 2026 Premium Applications
          </div>
        </div>

        <div className="relative fade-up-2">
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.05] mb-6 max-w-4xl relative">
            <span style={{ color: 'rgba(100,100,100,0.9)' }}>
              <span style={{ background: 'rgba(60,60,60,0.15)', padding: '2px 6px', borderRadius: '0' }}>The global alliance</span>
            </span><br />
            <span style={{
              background: 'linear-gradient(90deg, #0ea5e9 0%, #0284c7 40%, #6366f1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              for intelligent robotics
            </span>
          </h1>
        </div>

        <div className="relative fade-up-3">
          <p className="text-lg sm:text-xl max-w-2xl leading-relaxed mb-10" style={{ color: textMuted }}>
            Robo Alliance connects the world's leading robotics companies, researchers, and
            investors in a trusted network built for coordination, capital, and collective progress.
          </p>
        </div>

        <div className="relative fade-up-4 flex flex-col sm:flex-row items-start gap-3 mb-12">
          <button
            onClick={() => isGuest ? (enterPlatform(), setTimeout(() => setShowAuthModal(true), 540)) : enterPlatform()}
            className="group px-8 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', boxShadow: '0 0 28px rgba(14,165,233,0.28)' }}
          >
            {isGuest ? "Sign up — it's free" : 'Enter Platform'}
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <button
            onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3.5 rounded-xl text-sm font-semibold transition-all hover:border-cyan-500/40"
            style={{ border: `1px solid ${isDark ? 'rgba(14,165,233,0.2)' : 'rgba(0,105,180,0.2)'}`, background: isDark ? 'rgba(14,165,233,0.04)' : 'rgba(0,105,180,0.04)', color: isDark ? '#7dd3fc' : '#0069b4' }}
          >
            Request Premium Access
          </button>
        </div>

        {/* Social proof strip */}
        <div className="relative fade-up-4 flex items-center gap-3">
          <div className="flex -space-x-2.5">
            {previewAvatars.map((p, i) => (
              <div key={p.id} className="rounded-full ring-2 shrink-0" style={{ zIndex: previewAvatars.length - i }}>
                <Avatar photo={p.photo} avatar={p.avatar} color={p.color} size={30} />
              </div>
            ))}
          </div>
          <div className="text-sm" style={{ color: textMuted }}>
            <span className="font-semibold" style={{ color: textPrimary }}>340+</span> organizations worldwide
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-30">
          <span className="text-xs tracking-widest uppercase" style={{ color: textMuted }}>Scroll</span>
          <svg className="w-4 h-4 text-cyan-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <section className="relative z-10 px-4 pb-20 max-w-5xl mx-auto">
        <div className="rounded-2xl grid grid-cols-2 sm:grid-cols-4" style={{ ...cardStyle, borderCollapse: 'collapse' }}>
          {stats.map((s, i) => (
            <div key={s.label} className={`py-8 px-6 text-center ${i < stats.length - 1 ? 'border-r' : ''}`}
              style={{ borderColor: isDark ? 'rgba(14,165,233,0.1)' : 'rgba(0,0,0,0.07)' }}>
              <div className="text-3xl sm:text-4xl font-black text-cyan-500 mb-1.5 tabular-nums">{s.value}</div>
              <div className="text-xs font-medium tracking-wide" style={{ color: textMuted }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Leadership Preview ────────────────────────────────────────── */}
      <section className="relative z-10 px-4 pb-24 max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: textFaint }}>Leadership</p>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: textPrimary }}>Who's building the alliance</h2>
          </div>
          <button
            onClick={() => navigate('/leadership')}
            className="text-sm text-cyan-500/70 hover:text-cyan-500 transition-colors hidden sm:block"
          >
            View all →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {leadership.slice(0, 4).map(person => (
            <div key={person.id} className="rounded-2xl p-5 group cursor-default transition-all duration-300 hover:border-cyan-500/20"
              style={cardStyle}>
              <Avatar photo={person.photo} avatar={person.avatar} color={person.color} size={48} rounded="12px" />
              <div className="mt-4">
                <div className="text-sm font-bold group-hover:text-cyan-500 transition-colors" style={{ color: textPrimary }}>{person.name}</div>
                <div className="text-xs mt-0.5 leading-snug" style={{ color: textMuted }}>{person.title}</div>
                <div className="text-xs mt-2 font-medium text-cyan-500/70">{person.org}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-6 sm:hidden">
          <button onClick={() => navigate('/leadership')} className="text-sm text-cyan-500/70 hover:text-cyan-500 transition-colors">
            View all leadership →
          </button>
        </div>
      </section>

      {/* ── Key Supporters & Ecosystem Partners ───────────────────────── */}
      <section className="relative z-10 px-4 pb-24 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: textFaint }}>Ecosystem</p>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: textPrimary }}>Key Supporters & Partners</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {partners.map(p => (
            <div key={p.name} className="rounded-2xl p-5 flex flex-col items-center text-center gap-3 group cursor-default transition-all duration-300"
              style={cardStyle}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ background: p.color }}>
                {p.initials}
              </div>
              <div>
                <div className="text-sm font-semibold group-hover:text-cyan-500 transition-colors" style={{ color: textPrimary }}>{p.name}</div>
                <div className="text-xs mt-0.5" style={{ color: textMuted }}>{p.category}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission ───────────────────────────────────────────────────── */}
      <section className="relative z-10 px-4 pb-24 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left — big quote */}
          <div className="rounded-2xl p-8 sm:p-10 flex flex-col justify-between" style={cardStyle}>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-cyan-500/70 mb-5">Our Mission</p>
              <blockquote className="text-2xl sm:text-3xl font-bold leading-tight mb-6" style={{ color: textPrimary }}>
                "Coordination infrastructure for the age of intelligent machines."
              </blockquote>
            </div>
            <div className="pt-6" style={{ borderTop: `1px solid ${isDark ? 'rgba(14,165,233,0.1)' : 'rgba(0,0,0,0.08)'}` }}>
              <p className="text-sm leading-relaxed" style={{ color: textMuted }}>
                Robotics is moving from research labs into every layer of the physical economy.
                Yet the industry remains fragmented — competing standards, siloed data, misaligned
                incentives. Robo Alliance is the neutral convening body for this moment.
              </p>
            </div>
          </div>

          {/* Right — platform preview card */}
          <div className="rounded-2xl overflow-hidden relative" style={{ ...cardStyle, minHeight: 280 }}>
            <div className="absolute inset-0 p-6 flex flex-col gap-3">
              <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: textFaint }}>Inside the Platform</div>

              {[
                { name: 'Standards & Policy', msg: 'New ISO 10218 draft published', time: '2m', color: '#818cf8' },
                { name: 'Investment Rounds', msg: 'Series B closed — $47M', time: '15m', color: '#34d399' },
                { name: 'R&D Collaboration', msg: 'Shared simulation dataset v3.2', time: '1h', color: '#fbbf24' },
                { name: 'Global Events', msg: 'ICRA 2026 registration open', time: '3h', color: '#f472b6' },
              ].map(ch => (
                <div key={ch.name} className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                  style={{ background: isDark ? 'rgba(14,165,233,0.04)' : 'rgba(0,105,180,0.04)', border: `1px solid ${isDark ? 'rgba(14,165,233,0.07)' : 'rgba(0,105,180,0.08)'}` }}>
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ch.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate" style={{ color: textPrimary }}>{ch.name}</div>
                    <div className="text-xs truncate" style={{ color: textMuted }}>{ch.msg}</div>
                  </div>
                  <div className="text-xs shrink-0" style={{ color: textFaint }}>{ch.time}</div>
                </div>
              ))}

              <button
                onClick={enterPlatform}
                className="mt-auto w-full py-2.5 rounded-lg text-xs font-semibold text-cyan-500 transition-all hover:bg-cyan-500/10"
                style={{ border: '1px solid rgba(6,182,212,0.2)' }}
              >
                Enter Platform →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Bento ─────────────────────────────────────────────── */}
      <section className="relative z-10 px-4 pb-24 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: textFaint }}>What We Offer</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: textPrimary }}>Built for the robotics ecosystem</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
          {/* Large card */}
          <div
            className="lg:col-span-2 rounded-2xl p-7 group cursor-default relative overflow-hidden transition-all duration-300 hover:border-cyan-500/25"
            style={{ ...cardStyle, borderColor: `rgba(6,182,212,0.15)` }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
              style={{ background: `radial-gradient(circle, ${pillars[0].accent}, transparent 70%)`, transform: 'translate(30%, -30%)' }} />
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
              style={{ background: `rgba(6,182,212,0.12)`, border: `1px solid rgba(6,182,212,0.2)`, color: pillars[0].accent }}>
              {pillars[0].icon}
            </div>
            <h3 className="text-lg font-bold mb-2 group-hover:text-cyan-500 transition-colors" style={{ color: textPrimary }}>{pillars[0].title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{pillars[0].desc}</p>
          </div>

          {/* Right tall card */}
          {pillars.slice(1, 2).map(p => (
            <div key={p.title} className="rounded-2xl p-6 group cursor-default relative overflow-hidden transition-all duration-300"
              style={{ ...cardStyle }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `rgba(129,140,248,0.1)`, border: `1px solid rgba(129,140,248,0.2)`, color: p.accent }}>
                {p.icon}
              </div>
              <h3 className="text-sm font-bold mb-2 group-hover:text-cyan-500 transition-colors" style={{ color: textPrimary }}>{p.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: textMuted }}>{p.desc}</p>
            </div>
          ))}

          {/* Row of 3 normal cards */}
          {pillars.slice(2, 5).map(p => (
            <div key={p.title} className="rounded-2xl p-6 group cursor-default relative overflow-hidden transition-all duration-300"
              style={{ ...cardStyle }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `rgba(52,211,153,0.08)`, border: `1px solid rgba(52,211,153,0.15)`, color: p.accent }}>
                {p.icon}
              </div>
              <h3 className="text-sm font-bold mb-2 group-hover:text-cyan-500 transition-colors" style={{ color: textPrimary }}>{p.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: textMuted }}>{p.desc}</p>
            </div>
          ))}

          {/* Wide card */}
          <div className="lg:col-span-3 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 group cursor-default"
            style={{ ...cardStyle, borderColor: 'rgba(6,182,212,0.12)' }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', color: '#06b6d4' }}>
              {pillars[5].icon}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold mb-1 group-hover:text-cyan-500 transition-colors" style={{ color: textPrimary }}>{pillars[5].title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: textMuted }}>{pillars[5].desc}</p>
            </div>
            <div className="flex gap-3 text-xs shrink-0 flex-wrap" style={{ color: textFaint }}>
              {['🇺🇸 USA', '🇩🇪 Germany', '🇯🇵 Japan', '🇸🇬 Singapore', '🇬🇧 UK', '+42 more'].map(r => (
                <span key={r} className="px-2.5 py-1 rounded-full"
                  style={{ background: isDark ? 'rgba(14,165,233,0.06)' : 'rgba(0,105,180,0.05)', border: `1px solid ${isDark ? 'rgba(14,165,233,0.1)' : 'rgba(0,105,180,0.1)'}` }}>{r}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Apply ─────────────────────────────────────────────────────── */}
      <section id="apply" className="relative z-10 px-4 pb-28 max-w-xl mx-auto">
        <div className="rounded-2xl overflow-hidden" style={cardStyle}>
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #06b6d4, #818cf8, #06b6d4)' }} />

          <div className="p-8 sm:p-10">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
                  <svg className="w-8 h-8 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: textPrimary }}>Application received</h3>
                <p className="text-sm mb-8 leading-relaxed" style={{ color: textMuted }}>
                  We'll review your application and reach out within 3–5 business days.
                </p>
                <button
                  onClick={enterPlatform}
                  className="px-7 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', boxShadow: '0 0 20px rgba(14,165,233,0.2)' }}
                >
                  Enter Platform →
                </button>
              </div>
            ) : (
              <>
                <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: textFaint }}>Premium Membership</p>
                <h2 className="text-2xl font-black mb-2 tracking-tight" style={{ color: textPrimary }}>Request Premium Access</h2>
                <p className="text-sm mb-5 leading-relaxed" style={{ color: textMuted }}>
                  Premium membership unlocks exclusive investor relations, private channels, and standards committees. Free accounts are open to everyone — no application needed.
                </p>
                {isGuest && (
                  <button
                    type="button"
                    onClick={() => { enterPlatform(); setTimeout(() => setShowAuthModal(true), 540) }}
                    className="w-full mb-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                    style={{ background: isDark ? 'rgba(14,165,233,0.06)' : 'rgba(0,105,180,0.06)', border: `1px solid ${isDark ? 'rgba(14,165,233,0.18)' : 'rgba(0,105,180,0.18)'}`, color: isDark ? 'rgba(255,255,255,0.7)' : '#0069b4' }}
                  >
                    Just want a free account? Sign up here →
                  </button>
                )}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px" style={{ background: isDark ? 'rgba(14,165,233,0.12)' : 'rgba(0,0,0,0.08)' }} />
                  <span className="text-xs" style={{ color: textFaint }}>or apply for premium below</span>
                  <div className="flex-1 h-px" style={{ background: isDark ? 'rgba(14,165,233,0.12)' : 'rgba(0,0,0,0.08)' }} />
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-2" style={{ color: textMuted }}>Full Name *</label>
                      <input
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Jane Smith"
                        required
                        className="w-full rounded-xl px-4 py-3 text-sm placeholder-blue-300/25 outline-none transition-all"
                        style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: inputText }}
                        onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.45)'}
                        onBlur={e => e.target.style.borderColor = inputBorder}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-2" style={{ color: textMuted }}>Organization</label>
                      <input
                        value={form.org}
                        onChange={e => setForm(f => ({ ...f, org: e.target.value }))}
                        placeholder="Acme Robotics"
                        className="w-full rounded-xl px-4 py-3 text-sm placeholder-blue-300/25 outline-none transition-all"
                        style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: inputText }}
                        onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.45)'}
                        onBlur={e => e.target.style.borderColor = inputBorder}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: textMuted }}>Work Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="jane@company.com"
                      required
                      className="w-full rounded-xl px-4 py-3 text-sm placeholder-blue-300/25 outline-none transition-all"
                      style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: inputText }}
                      onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.45)'}
                      onBlur={e => e.target.style.borderColor = inputBorder}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: textMuted }}>Role</label>
                    <select
                      value={form.role}
                      onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                      className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                      style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: inputText }}
                    >
                      <option value="" style={{ background: optionBg }}>Select your role</option>
                      <option value="founder" style={{ background: optionBg }}>Founder / CEO</option>
                      <option value="engineer" style={{ background: optionBg }}>Robotics Engineer</option>
                      <option value="researcher" style={{ background: optionBg }}>Researcher / Academic</option>
                      <option value="investor" style={{ background: optionBg }}>Investor / VC</option>
                      <option value="policy" style={{ background: optionBg }}>Policy / Government</option>
                      <option value="other" style={{ background: optionBg }}>Other</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] hover:shadow-lg mt-2"
                    style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', boxShadow: '0 0 24px rgba(14,165,233,0.22)' }}
                  >
                    Submit Application
                  </button>
                  <p className="text-xs text-center" style={{ color: textFaint }}>
                    Already a member?{' '}
                    <button type="button" onClick={enterPlatform} className="text-cyan-500/70 hover:text-cyan-500 transition-colors">
                      Sign in to the platform →
                    </button>
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t px-6 py-10" style={{ borderColor: footerBorder, background: footerBg, backdropFilter: 'blur(12px)' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {!logoFailed ? (
              <img src="/logo.png" alt="Robo Alliance" className="h-5 w-auto object-contain opacity-50"
                style={{ filter: isDark ? 'brightness(1.15)' : 'none', mixBlendMode: isDark ? 'screen' : 'multiply' }} onError={() => setLogoFailed(true)} />
            ) : (
              <span className="text-sm font-semibold" style={{ color: textFaint }}>Robo Alliance</span>
            )}
          </div>
          <p className="text-xs" style={{ color: textFaint }}>© 2026 Robo Alliance. The global network for intelligent robotics.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/leadership')} className="text-xs hover:text-cyan-500 transition-colors" style={{ color: textFaint }}>Leadership</button>
            <button onClick={enterPlatform} className="text-xs hover:text-cyan-500 transition-colors" style={{ color: textFaint }}>Platform</button>
          </div>
        </div>
      </footer>
    </div>
  )
}
