import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { companies, people, currentUser, roleBadgeColors, personTypeColors } from '../data/mockData'
import Avatar from './Avatar'
import { useUser } from '../context/UserContext'
export default function TopBar({ onSearch }) {
  const { userPhoto } = useUser()
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
    <header className="fixed top-0 left-0 right-0 z-50 h-14 glass border-b border-blue-500/10 flex items-center px-4 gap-4">
      {/* Logo */}
      <button onClick={() => navigate('/')} className="flex items-center gap-2 shrink-0 group">
        {!logoFailed ? (
          <div style={{ background: '#060f1e', borderRadius: '10px', overflow: 'hidden', width: '148px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src="/logo.png"
              alt="Robo Alliance"
              className="group-hover:opacity-90 transition-opacity"
              style={{ height: '40px', width: 'auto', transform: 'scale(2.5)', mixBlendMode: 'screen', filter: 'brightness(1.1)' }}
              onError={() => setLogoFailed(true)}
            />
          </div>
        ) : (
          <>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-cyan-500/30">
              RA
            </div>
            <span className="font-bold text-white text-sm tracking-wider hidden sm:block group-hover:text-cyan-400 transition-colors">
              ROBO ALLIANCE
            </span>
          </>
        )}
      </button>

      {/* Search */}
      <div className="flex-1 max-w-xl mx-auto relative">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200 ${
          focused
            ? 'border-cyan-500/60 bg-[rgba(7,20,40,0.8)] shadow-lg shadow-cyan-500/10'
            : 'border-blue-500/20 bg-[rgba(4,13,26,0.5)]'
        }`}>
          <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => search(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder="Search companies, people, topics… (press /)"
            className="flex-1 bg-transparent text-sm text-white placeholder-blue-300/30 outline-none"
          />
          {query && (
            <button onClick={() => { setQuery(''); setResults([]) }} className="text-blue-400/50 hover:text-blue-400 text-xs">✕</button>
          )}
        </div>

        {/* Dropdown */}
        {results.length > 0 && focused && (
          <div className="absolute top-full left-0 right-0 mt-1 rounded-lg overflow-hidden shadow-2xl border border-cyan-500/20 slide-in"
            style={{ background: 'rgba(4,13,26,0.97)', backdropFilter: 'blur(16px)' }}>

            {companyResults.length > 0 && (
              <>
                <div className="px-3 pt-2 pb-1">
                  <span className="text-xs text-blue-300/30 font-semibold uppercase tracking-wider">Companies</span>
                </div>
                {companyResults.map(c => (
                  <button
                    key={c.id}
                    onMouseDown={() => selectResult(c)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-cyan-500/10 transition-colors text-left"
                  >
                    <Avatar photo={c.photo} avatar={c.avatar} color={c.color} size={32} rounded="8px" useDicebear={false} />
                    <div>
                      <div className="text-sm font-medium text-white">{c.name}</div>
                      <div className="text-xs text-blue-300/50">{c.category}</div>
                    </div>
                    <div className="ml-auto text-xs text-blue-400/40">{c.members.toLocaleString()} members</div>
                  </button>
                ))}
              </>
            )}

            {peopleResults.length > 0 && (
              <>
                <div className={`px-3 pb-1 ${companyResults.length > 0 ? 'pt-2 border-t border-blue-500/10 mt-1' : 'pt-2'}`}>
                  <span className="text-xs text-blue-300/30 font-semibold uppercase tracking-wider">People</span>
                </div>
                {peopleResults.map(p => (
                  <button
                    key={p.id}
                    onMouseDown={() => selectResult(p)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-cyan-500/10 transition-colors text-left"
                  >
                    <Avatar photo={p.photo} avatar={p.avatar} color={p.color} size={32} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{p.name}</span>
                        {p.online && <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />}
                      </div>
                      <div className="text-xs text-blue-300/50 truncate">{p.school}</div>
                    </div>
                    <span className={`text-xs px-1.5 py-0.5 rounded border shrink-0 ${personTypeColors[p.type] || ''}`}>
                      {p.type}
                    </span>
                  </button>
                ))}
              </>
            )}
            <div className="px-3 py-1.5 border-t border-blue-500/10">
              <span className="text-xs text-blue-300/20">{results.length} result{results.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        )}
      </div>

      {/* Nav links */}
      <div className="shrink-0 hidden md:flex items-center gap-1">
        <button
          onClick={() => navigate('/leadership')}
          className="text-xs font-semibold tracking-widest uppercase text-blue-300/40 hover:text-cyan-300 transition-colors px-2 py-1 rounded border border-transparent hover:border-blue-500/20"
        >
          Leadership
        </button>
        <button
          onClick={() => navigate('/welcome')}
          className="text-xs font-semibold tracking-widest uppercase text-blue-300/40 hover:text-cyan-300 transition-colors px-2 py-1 rounded border border-transparent hover:border-blue-500/20"
        >
          About
        </button>
      </div>

      {/* Right: Avatar */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right hidden sm:block">
          <div className="text-xs text-white font-medium">{currentUser.name}</div>
          <div className={`text-xs px-1.5 py-0.5 rounded text-center ${roleBadgeColors[currentUser.role]}`}>
            {currentUser.role}
          </div>
        </div>
        <button
          onClick={() => navigate('/settings')}
          className="hover:ring-2 hover:ring-cyan-500/50 transition-all rounded-full overflow-hidden"
        >
          <Avatar photo={userPhoto || currentUser.photo} avatar={currentUser.avatar} color="linear-gradient(135deg, #00d4ff, #0284c7)" size={32} />
        </button>
      </div>
    </header>
  )
}
