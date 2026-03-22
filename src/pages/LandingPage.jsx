import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { leadership, people } from '../data/mockData'
import Avatar from '../components/Avatar'
import { useUser } from '../context/UserContext'

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
  const { setShowAuthModal } = useUser()
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

  const cardStyle = {
    background: 'rgba(4, 13, 26, 0.22)',
    border: '1px solid rgba(14,165,233,0.12)',
  }

  return (
    <div className="landing-page min-h-screen text-white relative overflow-x-hidden">

      {/* ── Portal transition overlay ─────────────────────────────────── */}
      {transitioning && (
        <div
          className="fixed inset-0 z-[200] portal-overlay flex items-center justify-center"
          style={{ background: '#020814' }}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #0284c7)', boxShadow: '0 0 40px rgba(6,182,212,0.5)' }}>
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm text-blue-300/60 tracking-wider">Entering platform…</span>
          </div>
        </div>
      )}

      {/* ── Background glow orbs ──────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="glow-drift absolute rounded-full"
          style={{ width: 600, height: 600, top: '-10%', left: '30%', background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)' }} />
        <div className="glow-drift absolute rounded-full"
          style={{ width: 500, height: 500, top: '40%', right: '-10%', background: 'radial-gradient(circle, rgba(129,140,248,0.05) 0%, transparent 70%)', animationDelay: '-5s' }} />
      </div>

      {/* ── Nav ───────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-20"
        style={{ background: '#060f1e', borderBottom: '1px solid rgba(14,165,233,0.08)' }}>

        <div className="flex items-center gap-2">
          {!logoFailed ? (
            <div style={{ overflow: 'hidden', width: '180px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src="/logo.png"
                alt="Robo Alliance"
                style={{ height: '52px', width: 'auto', transform: 'scale(2.5)', mixBlendMode: 'screen', filter: 'brightness(1.1)' }}
                onError={() => setLogoFailed(true)}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: 'linear-gradient(135deg, #06b6d4, #0284c7)' }}>RA</div>
              <span className="font-semibold tracking-tight text-white text-sm hidden sm:block">Robo Alliance</span>
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center gap-6">
          <button onClick={() => navigate('/leadership')}
            className="text-sm text-white/65 hover:text-white transition-colors">Leadership</button>
          <button onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-sm text-white/65 hover:text-white transition-colors">Request Premium Access</button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { enterPlatform(); setTimeout(() => setShowAuthModal(true), 540) }}
            className="text-sm text-blue-300/60 hover:text-white transition-colors px-3 py-1.5 hidden sm:block"
          >
            Sign In
          </button>
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
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center pt-16 pb-16 px-4">

        <div className="relative fade-up-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium text-cyan-400 mb-8"
            style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.18)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Now accepting 2026 Premium Applications
          </div>
        </div>

        <div className="relative fade-up-2">
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.05] mb-6 max-w-4xl">
            <span style={{ textShadow: '0 2px 24px rgba(2,8,20,0.7)' }}>The global alliance</span><br />
            <span style={{
              background: 'linear-gradient(90deg, #67e8f9 0%, #38bdf8 40%, #818cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              for intelligent robotics
            </span>
          </h1>
        </div>

        <div className="relative fade-up-3">
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed mb-10"
            style={{ textShadow: '0 1px 12px rgba(2,8,20,0.5)' }}>
            Robo Alliance connects the world's leading robotics companies, researchers, and
            investors in a trusted network built for coordination, capital, and collective progress.
          </p>
        </div>

        <div className="relative fade-up-4 flex flex-col sm:flex-row items-center gap-3 mb-12">
          <button
            onClick={() => { enterPlatform(); setTimeout(() => setShowAuthModal(true), 540) }}
            className="group px-8 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', boxShadow: '0 0 28px rgba(14,165,233,0.28)' }}
          >
            Sign up — it's free
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <button
            onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3.5 rounded-xl text-sm font-semibold text-blue-300 transition-all hover:text-white hover:border-cyan-500/40"
            style={{ border: '1px solid rgba(14,165,233,0.2)', background: 'rgba(14,165,233,0.04)' }}
          >
            Request Premium Access
          </button>
        </div>

        {/* Social proof strip */}
        <div className="relative fade-up-4 flex items-center gap-3">
          <div className="flex -space-x-2.5">
            {previewAvatars.map((p, i) => (
              <div key={p.id} className="rounded-full ring-2 shrink-0" style={{ ringColor: '#020814', zIndex: previewAvatars.length - i }}>
                <Avatar photo={p.photo} avatar={p.avatar} color={p.color} size={30} />
              </div>
            ))}
          </div>
          <div className="text-sm text-white/65">
            <span className="text-white font-semibold">340+</span> organizations worldwide
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-30">
          <span className="text-xs text-blue-300/60 tracking-widest uppercase">Scroll</span>
          <svg className="w-4 h-4 text-blue-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <section className="relative z-10 px-4 pb-20 max-w-5xl mx-auto">
        <div className="rounded-2xl grid grid-cols-2 sm:grid-cols-4 divide-x divide-blue-500/10" style={cardStyle}>
          {stats.map((s, i) => (
            <div key={s.label} className={`py-8 px-6 text-center ${i === 0 ? 'rounded-l-2xl' : ''} ${i === stats.length - 1 ? 'rounded-r-2xl' : ''}`}>
              <div className="text-3xl sm:text-4xl font-black text-cyan-400 mb-1.5 tabular-nums">{s.value}</div>
              <div className="text-xs text-white/60 font-medium tracking-wide">{s.label}</div>
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
              <blockquote className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-6">
                "Coordination infrastructure for the age of intelligent machines."
              </blockquote>
            </div>
            <div className="pt-6 border-t border-blue-500/10">
              <p className="text-sm text-white/70 leading-relaxed">
                Robotics is moving from research labs into every layer of the physical economy.
                Yet the industry remains fragmented — competing standards, siloed data, misaligned
                incentives. Robo Alliance is the neutral convening body for this moment.
              </p>
            </div>
          </div>

          {/* Right — platform preview card */}
          <div className="rounded-2xl overflow-hidden relative" style={{ ...cardStyle, minHeight: 280 }}>
            <div className="absolute inset-0 p-6 flex flex-col gap-3">
              <div className="text-xs font-bold tracking-widest uppercase text-white/50 mb-1">Inside the Platform</div>

              {/* Mini channel list preview */}
              {[
                { name: 'Standards & Policy', msg: 'New ISO 10218 draft published', time: '2m', color: '#818cf8' },
                { name: 'Investment Rounds', msg: 'Series B closed — $47M', time: '15m', color: '#34d399' },
                { name: 'R&D Collaboration', msg: 'Shared simulation dataset v3.2', time: '1h', color: '#fbbf24' },
                { name: 'Global Events', msg: 'ICRA 2026 registration open', time: '3h', color: '#f472b6' },
              ].map(ch => (
                <div key={ch.name} className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                  style={{ background: 'rgba(14,165,233,0.04)', border: '1px solid rgba(14,165,233,0.07)' }}>
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ch.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-white/80 truncate">{ch.name}</div>
                    <div className="text-xs text-white/55 truncate">{ch.msg}</div>
                  </div>
                  <div className="text-xs text-white/45 shrink-0">{ch.time}</div>
                </div>
              ))}

              <button
                onClick={enterPlatform}
                className="mt-auto w-full py-2.5 rounded-lg text-xs font-semibold text-cyan-400 transition-all hover:bg-cyan-500/10"
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
          <p className="text-xs font-bold tracking-widest uppercase text-white/50 mb-3">What We Offer</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Built for the robotics ecosystem</h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
          {/* Large card — spans 2 cols on lg */}
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
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">{pillars[0].title}</h3>
            <p className="text-sm text-white/65 leading-relaxed">{pillars[0].desc}</p>
          </div>

          {/* Right tall card */}
          {pillars.slice(1, 2).map(p => (
            <div key={p.title} className="rounded-2xl p-6 group cursor-default relative overflow-hidden transition-all duration-300 hover:border-opacity-30"
              style={{ ...cardStyle }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `rgba(129,140,248,0.1)`, border: `1px solid rgba(129,140,248,0.2)`, color: p.accent }}>
                {p.icon}
              </div>
              <h3 className="text-sm font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">{p.title}</h3>
              <p className="text-xs text-white/65 leading-relaxed">{p.desc}</p>
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
              <h3 className="text-sm font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">{p.title}</h3>
              <p className="text-xs text-white/65 leading-relaxed">{p.desc}</p>
            </div>
          ))}

          {/* Wide card — spans full width on lg */}
          <div className="lg:col-span-3 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 group cursor-default"
            style={{ ...cardStyle, borderColor: 'rgba(6,182,212,0.12)' }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', color: '#06b6d4' }}>
              {pillars[5].icon}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">{pillars[5].title}</h3>
              <p className="text-xs text-white/65 leading-relaxed">{pillars[5].desc}</p>
            </div>
            <div className="flex gap-3 text-xs text-white/55 shrink-0 flex-wrap">
              {['🇺🇸 USA', '🇩🇪 Germany', '🇯🇵 Japan', '🇸🇬 Singapore', '🇬🇧 UK', '+42 more'].map(r => (
                <span key={r} className="px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.1)' }}>{r}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Leadership Preview ────────────────────────────────────────── */}
      <section className="relative z-10 px-4 pb-24 max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-white/50 mb-2">Leadership</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Who's building the alliance</h2>
          </div>
          <button
            onClick={() => navigate('/leadership')}
            className="text-sm text-cyan-400/70 hover:text-cyan-300 transition-colors hidden sm:block"
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
                <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">{person.name}</div>
                <div className="text-xs text-white/65 mt-0.5 leading-snug">{person.title}</div>
                <div className="text-xs text-cyan-400/60 mt-2 font-medium">{person.org}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-6 sm:hidden">
          <button onClick={() => navigate('/leadership')} className="text-sm text-cyan-400/70 hover:text-cyan-300 transition-colors">
            View all leadership →
          </button>
        </div>
      </section>

      {/* ── Apply ─────────────────────────────────────────────────────── */}
      <section id="apply" className="relative z-10 px-4 pb-28 max-w-xl mx-auto">
        <div className="rounded-2xl overflow-hidden" style={cardStyle}>
          {/* Top accent bar */}
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #06b6d4, #818cf8, #06b6d4)' }} />

          <div className="p-8 sm:p-10">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
                  <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Application received</h3>
                <p className="text-sm text-white/65 mb-8 leading-relaxed">
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
                <p className="text-xs font-bold tracking-widest uppercase text-white/50 mb-2">Premium Membership</p>
                <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Request Premium Access</h2>
                <p className="text-sm text-white/65 mb-5 leading-relaxed">
                  Premium membership unlocks exclusive investor relations, private channels, and standards committees. Free accounts are open to everyone — no application needed.
                </p>
                <button
                  type="button"
                  onClick={() => { enterPlatform(); setTimeout(() => setShowAuthModal(true), 540) }}
                  className="w-full mb-6 py-2.5 rounded-xl text-sm font-semibold text-white/70 hover:text-white transition-all"
                  style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.18)' }}
                >
                  Just want a free account? Sign up here →
                </button>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px" style={{ background: 'rgba(14,165,233,0.12)' }} />
                  <span className="text-xs text-white/30">or apply for premium below</span>
                  <div className="flex-1 h-px" style={{ background: 'rgba(14,165,233,0.12)' }} />
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-white/60 mb-2">Full Name *</label>
                      <input
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Jane Smith"
                        required
                        className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-blue-300/25 outline-none transition-all"
                        style={{ background: 'rgba(14,165,233,0.05)', border: '1px solid rgba(14,165,233,0.15)' }}
                        onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.45)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(14,165,233,0.15)'}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/60 mb-2">Organization</label>
                      <input
                        value={form.org}
                        onChange={e => setForm(f => ({ ...f, org: e.target.value }))}
                        placeholder="Acme Robotics"
                        className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-blue-300/25 outline-none transition-all"
                        style={{ background: 'rgba(14,165,233,0.05)', border: '1px solid rgba(14,165,233,0.15)' }}
                        onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.45)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(14,165,233,0.15)'}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-2">Work Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="jane@company.com"
                      required
                      className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-blue-300/25 outline-none transition-all"
                      style={{ background: 'rgba(14,165,233,0.05)', border: '1px solid rgba(14,165,233,0.15)' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.45)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(14,165,233,0.15)'}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-2">Role</label>
                    <select
                      value={form.role}
                      onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                      className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                      style={{ background: 'rgba(14,165,233,0.05)', border: '1px solid rgba(14,165,233,0.15)' }}
                    >
                      <option value="" style={{ background: '#040d1a' }}>Select your role</option>
                      <option value="founder" style={{ background: '#040d1a' }}>Founder / CEO</option>
                      <option value="engineer" style={{ background: '#040d1a' }}>Robotics Engineer</option>
                      <option value="researcher" style={{ background: '#040d1a' }}>Researcher / Academic</option>
                      <option value="investor" style={{ background: '#040d1a' }}>Investor / VC</option>
                      <option value="policy" style={{ background: '#040d1a' }}>Policy / Government</option>
                      <option value="other" style={{ background: '#040d1a' }}>Other</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] hover:shadow-lg mt-2"
                    style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', boxShadow: '0 0 24px rgba(14,165,233,0.22)' }}
                  >
                    Submit Application
                  </button>
                  <p className="text-xs text-white/45 text-center">
                    Already a member?{' '}
                    <button type="button" onClick={enterPlatform} className="text-cyan-400/70 hover:text-cyan-300 transition-colors">
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
      <footer className="relative z-10 border-t px-6 py-10" style={{ borderColor: 'rgba(14,165,233,0.08)', background: 'rgba(2,8,20,0.6)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {!logoFailed ? (
              <img src="/logo.png" alt="Robo Alliance" className="h-5 w-auto object-contain opacity-50"
                style={{ filter: 'brightness(1.15)', mixBlendMode: 'screen' }} onError={() => setLogoFailed(true)} />
            ) : (
              <span className="text-sm font-semibold text-white/40">Robo Alliance</span>
            )}
          </div>
          <p className="text-xs text-white/40">© 2026 Robo Alliance. The global network for intelligent robotics.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/leadership')} className="text-xs text-white/50 hover:text-white transition-colors">Leadership</button>
            <button onClick={enterPlatform} className="text-xs text-white/50 hover:text-white transition-colors">Platform</button>
          </div>
        </div>
      </footer>
    </div>
  )
}
