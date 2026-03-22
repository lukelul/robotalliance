import { useState, useRef, useEffect, Fragment } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { companies, people as mockPeople, roleBadgeColors, personTypeColors } from '../data/mockData'
import Avatar from './Avatar'
import { useUser } from '../context/UserContext'
const dropdownTagColors = {
  'HS Student':       { bg: 'rgba(34,197,94,0.2)',  text: '#86efac', border: 'rgba(34,197,94,0.3)' },
  'College Student':  { bg: 'rgba(59,130,246,0.2)', text: '#93c5fd', border: 'rgba(59,130,246,0.3)' },
  'Mentor':           { bg: 'rgba(234,179,8,0.2)',   text: '#fde047', border: 'rgba(234,179,8,0.3)' },
  'Enthusiast':       { bg: 'rgba(168,85,247,0.2)',  text: '#d8b4fe', border: 'rgba(168,85,247,0.3)' },
  'Researcher':       { bg: 'rgba(6,182,212,0.2)',   text: '#67e8f9', border: 'rgba(6,182,212,0.3)' },
  'Robotics Engineer':{ bg: 'rgba(239,68,68,0.2)',   text: '#fca5a5', border: 'rgba(239,68,68,0.3)' },
}

export default function TopBar({ onSearch }) {
  const { profile, isGuest, setShowAuthModal, userPhoto, allUsers } = useUser()
  const people = [...allUsers, ...mockPeople.filter(mp => !allUsers.some(u => u.name === mp.name))]
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [focused, setFocused] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const search = (q) => {
    setQuery(q)
    if (!q.trim()) { setResults([]); return }
    const ql = q.toLowerCase()

    const matchedCompanies = companies
      .filter(c => c.name.toLowerCase().includes(ql) || c.category.toLowerCase().includes(ql))
      .map(c => ({ ...c, _kind: 'company' }))

    const matchedPeople = people
      .filter(p =>
        p.name.toLowerCase().includes(ql) ||
        p.type.toLowerCase().includes(ql) ||
        p.school.toLowerCase().includes(ql) ||
        p.bio.toLowerCase().includes(ql)
      )
      .map(p => ({ ...p, _kind: 'person' }))

    setResults([...matchedCompanies, ...matchedPeople].slice(0, 8))
  }

  const selectResult = (item) => {
    setQuery(item.name)
    setResults([])
    setFocused(false)
    if (onSearch) onSearch(item)
    const path = item._kind === 'company' ? `/server/${item.id}` : `/profile/${item.id}`
    setTimeout(() => navigate(path), 700)
  }

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const companyResults = results.filter(r => r._kind === 'company')
  const peopleResults = results.filter(r => r._kind === 'person')

  return (
    <Fragment>
    <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-4 gap-4"
      style={{ background: 'rgba(10,15,30,0.92)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Search */}
      <div className="flex-1 relative">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200 ${
          focused
            ? 'border-white/20 bg-white/10 shadow-lg shadow-black/20'
            : 'border-white/10 bg-white/5'
        }`}>
          <svg className="w-4 h-4 text-white/50 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => search(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder="Search companies, people, topics… (press /)"
            className="flex-1 bg-transparent text-sm text-white placeholder-white/40 outline-none"
          />
          {query && (
            <button onClick={() => { setQuery(''); setResults([]) }} className="text-white/40 hover:text-white/70 text-xs">✕</button>
          )}
        </div>

        {/* Dropdown */}
        {results.length > 0 && focused && (
          <div className="absolute top-full left-0 right-0 mt-1 rounded-lg overflow-hidden shadow-2xl border border-white/10 slide-in"
            style={{ background: 'rgba(10,15,30,0.97)', backdropFilter: 'blur(16px)' }}>

            {companyResults.length > 0 && (
              <>
                <div className="px-3 pt-2 pb-1">
                  <span className="text-xs text-white/40 font-semibold uppercase tracking-wider">Companies</span>
                </div>
                {companyResults.map(c => (
                  <button
                    key={c.id}
                    onMouseDown={() => selectResult(c)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 transition-colors text-left"
                  >
                    <Avatar photo={c.photo} avatar={c.avatar} color={c.color} size={32} rounded="8px" useDicebear={false} />
                    <div>
                      <div className="text-sm font-semibold" style={{ color: '#ffffff' }}>{c.name}</div>
                      <div className="text-xs text-white/50">{c.category}</div>
                    </div>
                    <div className="ml-auto text-xs text-white/40">{c.members.toLocaleString()} members</div>
                  </button>
                ))}
              </>
            )}

            {peopleResults.length > 0 && (
              <>
                <div className={`px-3 pb-1 ${companyResults.length > 0 ? 'pt-2 border-t border-white/10 mt-1' : 'pt-2'}`}>
                  <span className="text-xs text-white/40 font-semibold uppercase tracking-wider">People</span>
                </div>
                {peopleResults.map(p => (
                  <button
                    key={p.id}
                    onMouseDown={() => selectResult(p)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 transition-colors text-left"
                  >
                    <Avatar photo={p.photo} avatar={p.avatar} color={p.color} size={32} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold" style={{ color: '#ffffff' }}>{p.name}</span>
                        {p.online && <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />}
                      </div>
                      <div className="text-xs text-white/50 truncate">{p.school}</div>
                    </div>
                    <span className="text-xs px-1.5 py-0.5 rounded shrink-0" style={{
                      background: dropdownTagColors[p.type]?.bg || 'rgba(255,255,255,0.1)',
                      color: dropdownTagColors[p.type]?.text || '#ffffff',
                      border: `1px solid ${dropdownTagColors[p.type]?.border || 'rgba(255,255,255,0.2)'}`,
                    }}>
                      {p.type}
                    </span>
                  </button>
                ))}
              </>
            )}
            <div className="px-3 py-1.5 border-t border-white/10">
              <span className="text-xs text-white/30">{results.length} result{results.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        )}
      </div>

      {/* Nav links */}
      <div className="shrink-0 hidden md:flex items-center gap-1">
        <button
          onClick={() => navigate('/leadership')}
          className="text-sm font-medium transition-colors duration-200 px-3 py-2 topbar-nav-btn"
          style={{ color: 'rgba(255,255,255,0.5)' }}
          onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
        >
          Leadership
        </button>
        <button
          onClick={() => navigate('/welcome')}
          className="text-sm font-medium transition-colors duration-200 px-3 py-2 topbar-nav-btn"
          style={{ color: 'rgba(255,255,255,0.5)' }}
          onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
        >
          About
        </button>
      </div>

      {/* Right: Auth */}
      <div className="flex items-center gap-3 shrink-0">
        {isGuest ? (
          <button
            onClick={() => setShowAuthModal(true)}
            className="rounded-full px-5 py-2 bg-[#0069b4] text-white text-sm font-semibold hover:bg-[#005a9e] transition-all"
          >
            Sign In
          </button>
        ) : (
          <>
            <div className="text-right hidden sm:block">
              <div className="text-xs text-white font-medium">{profile?.name || '…'}</div>
              <div className="text-xs text-white/50">{profile?.type || ''}</div>
            </div>
            <button
              onClick={() => navigate('/settings')}
              className="hover:ring-2 hover:ring-[#0069b4]/40 transition-all rounded-full overflow-hidden"
            >
              <Avatar photo={userPhoto} avatar={profile?.avatar} color={profile?.color || 'linear-gradient(135deg, #00d4ff, #0069b4)'} size={32} />
            </button>
          </>
        )}
      </div>
    </header>
    <Link
      to="/admin"
      style={{
        position: 'fixed', bottom: 14, right: 14, zIndex: 999,
        fontSize: 10, color: 'rgba(255,255,255,0.15)',
        textDecoration: 'none', letterSpacing: '0.05em',
      }}
    >
      admin
    </Link>
    </Fragment>
  )
}
