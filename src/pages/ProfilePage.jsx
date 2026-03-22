import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { people, personTypeColors, personActivity, avatarGradients, currentUser, serverPosts } from '../data/mockData'
import { usePosts } from '../context/PostsContext'
import PostCard from '../components/PostCard'
import Avatar from '../components/Avatar'
import { useUser } from '../context/UserContext'

export default function ProfilePage() {
  const { userPhoto, allUsers, firebaseUser } = useUser()
  const { id } = useParams()
  const navigate = useNavigate()
  const { posts } = usePosts()
  const [tab, setTab] = useState('posts')

  const isMe = id === 'luke-lu' || id === currentUser.id || id === firebaseUser?.uid
  const firebasePerson = allUsers.find(u => u.id === id)
  const person = isMe
    ? (firebasePerson || { ...currentUser, type: 'Robotics Engineer', school: 'Robo Alliance', bio: "Building the robotics industry's home on the internet.", followers: 3300, online: true })
    : (firebasePerson || people.find(p => p.id === id))

  if (!person) return (
    <div className="flex items-center justify-center h-screen text-blue-300/50">
      Not found. <button onClick={() => navigate('/')} className="ml-2 text-cyan-400 underline">Home</button>
    </div>
  )

  const bg = (avatarGradients[person.avatar] || person.color || '#0ea5e9')
  const activity = personActivity[id] || []
  const allServerPosts = Object.values(serverPosts).flat()
  const personPosts = [...posts.filter(p => p.author === person.name), ...allServerPosts.filter(p => p.author === person.name)]
    .sort((a, b) => b.likes - a.likes)

  const handleActivity = (item) => {
    if (item.externalUrl) window.open(item.externalUrl, '_blank')
    else if (item.link) navigate(item.link)
  }

  return (
    <div className="page-enter pt-20 pb-24 px-4 max-w-2xl mx-auto relative z-10">
      <button onClick={() => navigate(-1)} className="text-xs text-blue-300/40 hover:text-cyan-400 transition-colors mb-6 flex items-center gap-1">
        ← Back
      </button>

      <div className="rounded-2xl overflow-hidden border border-blue-500/15" style={{ background: 'var(--surface)', backdropFilter: 'blur(16px)' }}>
        <div className="h-24 w-full" style={{ backgroundImage: 'linear-gradient(135deg,' + bg + '22,' + bg + '08,#020814)' }} />
        <div className="px-6 pb-6 -mt-10">
          <div className="flex items-end justify-between mb-4">
            <Avatar
              photo={isMe ? (userPhoto || person.photo) : person.photo}
              avatar={person.avatar}
              color={bg}
              size={80}
              rounded="16px"
              style={{ border: '4px solid #020814', boxShadow: '0 10px 25px rgba(0,0,0,0.4)' }}
            />
            <div className="flex items-center gap-2 mb-2">
              {person.online && <div className="flex items-center gap-1 text-xs text-green-400"><div className="w-1.5 h-1.5 rounded-full bg-green-400" /> Online</div>}
              {!isMe && (
                <>
                  <button className="px-4 py-1.5 text-sm rounded-lg border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-colors" style={{ background: 'rgba(6,182,212,0.1)' }}>Connect</button>
                  <button className="px-4 py-1.5 text-sm rounded-lg border border-blue-500/20 text-blue-300 hover:bg-blue-500/10 transition-colors" style={{ background: 'rgba(14,165,233,0.05)' }}>Message</button>
                </>
              )}
              {isMe && <button className="px-4 py-1.5 text-sm rounded-lg border border-blue-500/20 text-blue-300" style={{ background: 'rgba(14,165,233,0.05)' }}>Edit Profile</button>}
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">{person.name}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded" style={{ background:'rgba(14,165,233,0.1)', border:'1px solid rgba(14,165,233,0.25)', color:'#67e8f9' }}>{person.type}</span>
            <span className="text-sm text-blue-300/50">{person.school}</span>
          </div>
          <p className="mt-4 text-sm text-blue-100/70 leading-relaxed">{person.bio}</p>
          {person.linkedin && (
            <a
              href={person.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 text-xs px-3 py-1.5 rounded-lg border border-blue-500/20 text-blue-300/70 hover:text-cyan-300 hover:border-cyan-500/30 transition-colors"
              style={{ background: 'var(--input-bg)' }}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
          )}
          <div className="flex items-center gap-6 mt-5 pt-5 border-t border-blue-500/10">
            <div><div className="text-white font-semibold text-sm">{person.followers.toLocaleString()}</div><div className="text-xs text-blue-300/40">Followers</div></div>
            <div><div className="text-white font-semibold text-sm">{Math.floor(person.followers * 0.4).toLocaleString()}</div><div className="text-xs text-blue-300/40">Following</div></div>
            <div><div className="text-white font-semibold text-sm">{personPosts.length}</div><div className="text-xs text-blue-300/40">Posts</div></div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 mt-4 mb-3">
        {['posts', 'activity'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={"px-4 py-2 text-sm rounded-lg capitalize transition-colors border " + (tab===t ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' : 'text-blue-300/50 border-blue-500/10 hover:text-white')}
            style={tab !== t ? { background:'var(--surface)' } : {}}>
            {t === 'posts' ? "Posts (" + personPosts.length + ")" : 'Activity'}
          </button>
        ))}
      </div>

      {tab === 'posts' && (
        <div className="space-y-3">
          {personPosts.length === 0 && (
            <div className="rounded-xl border border-blue-500/10 p-8 text-center text-blue-300/30 text-sm" style={{ background:'var(--surface)' }}>
              {isMe ? 'Hit the + button below to share your first post!' : 'No posts yet.'}
            </div>
          )}
          {personPosts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      )}

      {tab === 'activity' && (
        <div className="rounded-xl border border-blue-500/10 overflow-hidden" style={{ background:'var(--surface)', backdropFilter:'blur(14px)' }}>
          {activity.length === 0 && <p className="text-xs text-blue-300/30 text-center py-6">No recent activity.</p>}
          {activity.map((item, i) => (
            <button key={i} onClick={() => handleActivity(item)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-500/5 transition-colors group"
              style={i < activity.length-1 ? {borderBottom:'1px solid rgba(14,165,233,0.06)'} : {}}>
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/60 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <span className="text-xs text-blue-300/50">{item.action} </span>
                <span className="text-xs font-medium text-blue-200 group-hover:text-cyan-300 transition-colors">{item.target}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs text-blue-300/30">{item.time}</span>
                {item.externalUrl && <span className="text-xs text-cyan-400/50">↗</span>}
                {item.link && <span className="text-xs text-blue-400/40">→</span>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
