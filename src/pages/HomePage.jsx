import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { companies, news, events, people as mockPeople, roleBadgeColors, currentUser, leadership } from '../data/mockData'
import { usePosts } from '../context/PostsContext'
import { useUser } from '../context/UserContext'
import PostCard from '../components/PostCard'
import Avatar from '../components/Avatar'

const categoryColors = {
  AI: 'bg-purple-500/20 text-purple-300',
  Industry: 'bg-blue-500/20 text-blue-300',
  Funding: 'bg-green-500/20 text-green-300',
  Standards: 'bg-yellow-500/20 text-yellow-300',
  Software: 'bg-cyan-500/20 text-cyan-300',
}
const eventTypeColors = {
  Conference: 'bg-blue-500/20 text-blue-300',
  'Partner Event': 'bg-purple-500/20 text-purple-300',
  'Investor Call': 'bg-yellow-500/20 text-yellow-300',
  Community: 'bg-cyan-500/20 text-cyan-300',
  Academic: 'bg-green-500/20 text-green-300',
}
const newsUrls = {
  1: 'https://developer.nvidia.com/isaac/ros',
  2: 'https://bostondynamics.com/atlas',
  3: 'https://figure.ai',
  4: 'https://www.tesla.com/optimus',
  5: 'https://standards.ieee.org/',
  6: 'https://docs.ros.org/en/rolling/',
}
const blkStyle = { background: 'var(--surface)', backdropFilter: 'blur(14px)' }

export default function HomePage({ onNavigate }) {
  const navigate = useNavigate()
  const { posts } = usePosts()
  const { allUsers, profile, isGuest } = useUser()

  // Merge mockData people with real Firestore users (real users appear first)
  const people = [
    ...allUsers,
    ...mockPeople.filter(mp => !allUsers.some(u => u.name === mp.name)),
  ]
  const [favs, setFavs] = useState(['boston-dynamics', 'figure-ai'])
  const [postTab, setPostTab] = useState('all')
  const [sortTab, setSortTab] = useState('newest')

  const toggleFav = (id) => setFavs(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id])
  const favCompanies = companies.filter(c => favs.includes(c.id))

  const filteredPosts = postTab === 'all'
    ? posts
    : posts.filter(p => p.serverId === postTab || p.destination === companies.find(c => c.id === postTab)?.name)

  const now = Date.now()
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortTab === 'newest') {
      const ta = a.createdAt?.toMillis?.() ?? 0
      const tb = b.createdAt?.toMillis?.() ?? 0
      return tb - ta
    }
    if (sortTab === 'top') return b.likes - a.likes
    if (sortTab === 'hot') {
      // score = likes / (hours since post + 2)^1.5
      const score = p => {
        const ms = p.createdAt?.toMillis?.() ?? (now - 1000 * 60 * 60 * 24)
        const hours = (now - ms) / 3600000
        return p.likes / Math.pow(hours + 2, 1.5)
      }
      return score(b) - score(a)
    }
    return 0
  }).slice(0, 10)

  return (
    <div className="page-enter pt-20 pb-12 px-4 max-w-7xl mx-auto relative z-10">
      {/* Hero greeting */}
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-blue-300/30 mb-1">Robo Alliance</p>
        <h1 className="text-3xl font-bold text-gray-900" style={{ color: 'var(--text)' }}>
          {isGuest ? 'Welcome to ' : 'Welcome back, '}<span className="text-cyan-400">{isGuest ? 'Robo Alliance' : (profile?.name || currentUser.name)}</span>
        </h1>
        <p className="text-blue-300/40 text-sm mt-1 tracking-wide">The robotics industry, connected.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Top News */}
          <div className="rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm" style={blkStyle}>
            <div className="px-4 py-3 border-b border-blue-500/10 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-widest">Top News</h2>
              <span className="text-xs text-blue-300/30 tracking-wide">Robotics Industry</span>
            </div>
            <div className="divide-y divide-blue-500/10">
              {news.map((item) => (
                <a key={item.id} href={newsUrls[item.id]} target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-3 px-4 py-3 hover:bg-blue-500/5 transition-colors group"
                  style={{ textDecoration: 'none' }}>
                  {item.hot && <span className="mt-1 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white group-hover:text-cyan-300 transition-colors font-medium leading-snug">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-blue-300/40">{item.source}</span>
                      <span className="text-blue-500/30">·</span>
                      <span className="text-xs text-blue-300/40">{item.time}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${categoryColors[item.category] || 'bg-gray-500/20 text-gray-300'}`}>
                        {item.category}
                      </span>
                      <span className="text-xs text-cyan-400/50 ml-auto">↗</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Top Posts */}
          <div className="rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm" style={blkStyle}>
            <div className="px-4 py-3 border-b border-blue-500/10 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-widest">Posts</h2>
              <div className="flex gap-1">
                {['newest', 'top', 'hot'].map(s => (
                  <button key={s} onClick={() => setSortTab(s)}
                    className={`px-3 py-1 text-xs rounded-full font-semibold transition-colors ${sortTab === s ? 'bg-[#0069b4] text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1 px-3 py-2 border-b border-blue-500/10 flex-wrap">
              {[{ id: 'all', name: 'All' }, ...companies.map(c => ({ id: c.id, name: c.name }))].map(tab => (
                <button key={tab.id} onClick={() => setPostTab(tab.id)}
                  className={`px-2.5 py-1 text-xs rounded-full font-semibold transition-colors ${postTab === tab.id ? 'bg-[#0069b4] text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                  {tab.name}
                </button>
              ))}
            </div>
            <div>
              {sortedPosts.length === 0 && <p className="text-xs text-blue-300/30 text-center py-6">No posts yet.</p>}
              {sortedPosts.map((post, i) => (
                <div key={post.id} className="p-3" style={i < sortedPosts.length - 1 ? { borderBottom: '1px solid rgba(14,165,233,0.08)' } : {}}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Favs + Events */}
        <div className="flex flex-col gap-6">
          {/* Leadership */}
          <div className="rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm" style={blkStyle}>
            <div className="px-4 py-3 border-b border-blue-500/10 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-widest">Leadership</h2>
              <button
                onClick={() => navigate('/leadership')}
                className="text-xs text-cyan-400/60 hover:text-cyan-300 transition-colors tracking-wide"
              >
                View All ↗
              </button>
            </div>
            <div className="divide-y divide-blue-500/10">
              {leadership.map(person => (
                <button
                  key={person.id}
                  onClick={() => navigate('/leadership')}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-500/5 transition-colors text-left group"
                >
                  <Avatar photo={person.photo} avatar={person.avatar} color={person.color} size={36} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-white leading-tight group-hover:text-cyan-300 transition-colors">{person.name}</div>
                    <div className="text-xs text-blue-300/40 mt-0.5 leading-snug truncate">{person.title}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="px-4 py-2.5 border-t border-blue-500/08">
              <button
                onClick={() => navigate('/leadership')}
                className="w-full text-xs text-blue-300/30 hover:text-cyan-300 transition-colors tracking-wide text-center py-0.5"
              >
                Board of Advisors &amp; Governance →
              </button>
            </div>
          </div>

          {/* Favorited Servers */}
          <div className="rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm" style={blkStyle}>
            <div className="px-4 py-3 border-b border-blue-500/10 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-widest">Favorited Servers</h2>
            </div>
            <div className="p-2">
              {favCompanies.length === 0 && (
                <p className="text-xs text-blue-300/30 text-center py-4">No favorites yet</p>
              )}
              {favCompanies.map(c => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-blue-500/10 transition-colors cursor-pointer group"
                  onClick={() => onNavigate({ _kind: 'company', ...c })}
                >
                  <Avatar photo={c.logo} avatar={c.avatar} color={c.color} size={36} rounded="8px" useDicebear={false} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors truncate">
                      {c.name}
                    </div>
                    <div className="text-xs text-blue-300/40">
                      <span className="text-green-400">●</span> {c.online} online
                    </div>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); toggleFav(c.id) }}
                    className="text-yellow-400 hover:text-yellow-300 opacity-0 group-hover:opacity-100 transition-all text-sm"
                  >
                    ★
                  </button>
                </div>
              ))}
              {/* All companies */}
              <div className="mt-2 pt-2 border-t border-blue-500/10">
                <p className="text-xs text-blue-300/30 px-2 mb-1">All Servers</p>
                {companies.filter(c => !favs.includes(c.id)).map(c => (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-blue-500/10 transition-colors cursor-pointer group"
                    onClick={() => onNavigate({ _kind: 'company', ...c })}
                  >
                    <Avatar photo={c.logo} avatar={c.avatar} color={c.color} size={36} rounded="8px" useDicebear={false} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors truncate">
                        {c.name}
                      </div>
                      <div className="text-xs text-blue-300/40 truncate">{c.category}</div>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); toggleFav(c.id) }}
                      className="text-blue-300/30 hover:text-yellow-400 opacity-0 group-hover:opacity-100 transition-all text-sm"
                    >
                      ☆
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm" style={blkStyle}>
            <div className="px-4 py-3 border-b border-blue-500/10">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-widest">Upcoming Events</h2>
            </div>
            <div className="divide-y divide-blue-500/10">
              {events.map(ev => (
                <div key={ev.id}
                  onClick={() => onNavigate({ _kind: 'event', ...ev })}
                  className={`block px-4 py-3 hover:bg-blue-500/5 transition-colors group ${ev.externalUrl ? 'cursor-pointer' : 'cursor-default'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors leading-snug">
                        {ev.title}
                      </p>
                      <p className="text-xs text-blue-300/40 mt-0.5">{ev.host} · {ev.location}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-xs font-medium text-cyan-400">{ev.date}</div>
                      {ev.externalUrl && <div className="text-xs text-cyan-400/40">↗</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${eventTypeColors[ev.type] || ''}`}>{ev.type}</span>
                    {ev.role !== 'public' && (
                      <span className={`text-xs px-1.5 py-0.5 rounded ${roleBadgeColors[ev.role === 'partner' ? 'Partner' : 'Investor']}`}>{ev.role}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
