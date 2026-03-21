import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { companies, currentUser, roleBadgeColors, canAccess, serverPosts } from '../data/mockData'
import { usePosts } from '../context/PostsContext'
import { useUser } from '../context/UserContext'
import PostCard from '../components/PostCard'
import Avatar from '../components/Avatar'

const TABS = ['Chat', 'Posts', 'About', 'Jobs', 'News', 'Investor Relations']

function PostsTab({ companyId, companyName }) {
  const { posts } = usePosts()
  const seedPosts = serverPosts[companyId] || []
  const contextPosts = posts.filter(p => p.serverId === companyId || p.destination === companyName)
  const allPosts = [...contextPosts, ...seedPosts].sort((a, b) => b.likes - a.likes)

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="max-w-2xl mx-auto space-y-3">
        {allPosts.length === 0 && (
          <div className="text-center text-blue-300/30 text-sm py-10">No posts yet. Be the first to post!</div>
        )}
        {allPosts.map(post => <PostCard key={post.id} post={post} />)}
      </div>
    </div>
  )
}

// Avatar background colors per initials — stable per user
const avatarGradients = {
  RP: '#f59e0b', MR: '#d97706', SK: '#0ea5e9', LL: '#00d4ff',
  PS: '#8b5cf6', NK: '#10b981', SC: '#06b6d4', BO: '#f87171',
  MW: '#f59e0b', CM: '#f97316', MP: '#ec4899', EB: '#84cc16',
  DT: '#c084fc', RN: '#34d399', TH: '#fb923c', AJ: '#a78bfa',
  JW: '#4ade80', SR: '#f472b6', DS: '#8b5cf6', JH: '#7c3aed',
  BA: '#ec4899', JP: '#0ea5e9', FA: '#34d399', JL: '#38bdf8',
  YT: '#fb923c',
}

// Simulated "bot" messages that fire randomly to keep chat lively
const simulatedMessages = {
  'boston-dynamics': [
    { user: 'Maya Patel', role: 'Member', avatar: 'MP', text: 'just watched the Atlas demo again for the 5th time today lol' },
    { user: 'Ethan Brooks', role: 'Member', avatar: 'EB', text: 'does anyone know if Boston Dynamics offers internships for hs students?' },
    { user: 'Tom Harker', role: 'Member', avatar: 'TH', text: 'the foot compliance on the new version is wild. definitely variable stiffness.' },
    { user: 'Riya Nair', role: 'Member', avatar: 'RN', text: 'I\'ve been trying to replicate the leg spring mechanism on my walker and it is *hard*' },
    { user: 'Aisha Johnson', role: 'Member', avatar: 'AJ', text: 'anyone going to the GTRI open house next month? they\'re showing some cool new manipulation stuff' },
    { user: 'Sofia Reyes', role: 'Member', avatar: 'SR', text: 'my FRC team literally named our robot "Atlas" after this. hope that\'s ok 😅' },
    { user: 'Jaylen Washington', role: 'Member', avatar: 'JW', text: 'ok so I just learned what a jacobian is and now I understand why inverse kinematics is hard' },
    { user: 'Carlos Mendez', role: 'Member', avatar: 'CM', text: 'anyone familiar with the IMU fusion they use? wondering if it\'s EKF or something newer' },
    { user: 'Marcus Webb', role: 'Member', avatar: 'MW', text: 'Reminds me of some of the early Curiosity rover nav testing. Different scale but same challenge set.' },
    { user: 'Noah Kim', role: 'Member', avatar: 'NK', text: 'the VLA integration for manipulation is going to be the real unlock. watching closely.' },
  ],
  'figure-ai': [
    { user: 'Sofia Reyes', role: 'Member', avatar: 'SR', text: 'Brett you\'re so online for a CEO of a billion dollar company lol' },
    { user: 'Aisha Johnson', role: 'Member', avatar: 'AJ', text: 'what does the training pipeline look like for the foundation model? sim-to-real or mostly real data?' },
    { user: 'Tom Harker', role: 'Member', avatar: 'TH', text: 'the hand design on figure 02 looks way better than v1. what changed?' },
    { user: 'Noah Kim', role: 'Member', avatar: 'NK', text: 'dexterous manipulation is still the hardest open problem in embodied AI imo' },
    { user: 'Priya Sharma', role: 'Member', avatar: 'PS', text: 'I just finished my MIT app essays and "wanting to work at Figure" was in like 3 of them 😭' },
    { user: 'Ben Ortega', role: 'Member', avatar: 'BO', text: 'my video on the Series C just hit 500k views. robotics twitter is popping off rn' },
    { user: 'Fatima Al-Hassan', role: 'Member', avatar: 'FA', text: 'following from Oxford — the tactile sensing problem is what my thesis is literally about. love to chat.' },
    { user: 'Yuki Tanaka', role: 'Member', avatar: 'YT', text: 'anyone benchmarking power efficiency vs other humanoids? the 16hr stat seems very good' },
  ],
  'agility-robotics': [
    { user: 'Maya Patel', role: 'Member', avatar: 'MP', text: 'Jon Hurst\'s cassie papers were literally what got me into robotics in 8th grade' },
    { user: 'Ben Ortega', role: 'Member', avatar: 'BO', text: 'the Amazon uptime data is the most compelling argument for humanoids in industry I\'ve seen' },
    { user: 'Ethan Brooks', role: 'Member', avatar: 'EB', text: 'is Digit available for research institutions? asking for a school project (a very big school project)' },
    { user: 'Tom Harker', role: 'Member', avatar: 'TH', text: 'the spring leg architecture is so elegant. passive dynamics doing so much of the work.' },
    { user: 'Carlos Mendez', role: 'Member', avatar: 'CM', text: 'we\'re using Digit in our lab for the next 6 months. happy to share findings here' },
    { user: 'Fatima Al-Hassan', role: 'Member', avatar: 'FA', text: 'what\'s the sensor modality story for in-hand manipulation on digit? any tactile?' },
    { user: 'Riya Nair', role: 'Member', avatar: 'RN', text: 'I\'d love to see the Amazon deployment footage. any public data on task diversity?' },
  ],
}

// ─── Typing indicator component ───────────────────────────────────────────────
function TypingIndicator({ names }) {
  if (!names.length) return null
  let label
  if (names.length === 1) label = `${names[0]} is typing`
  else if (names.length === 2) label = `${names[0]} and ${names[1]} are typing`
  else label = `${names[0]}, ${names[1]} and ${names.length - 2} others are typing`

  return (
    <div className="flex items-center gap-2 px-4 py-1.5 text-xs text-blue-300/50 h-7">
      <span className="flex gap-0.5 items-end">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-1 h-1 rounded-full bg-blue-400/60 inline-block"
            style={{ animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </span>
      <span>{label}...</span>
    </div>
  )
}

// ─── Chat Channel ─────────────────────────────────────────────────────────────
function ChatChannel({ messages, channelName, companyId, membersList }) {
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState(messages || [])
  const [typingUsers, setTypingUsers] = useState([])
  const bottomRef = useRef(null)
  const typingTimers = useRef({})

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, typingUsers])

  // Simulate incoming messages + typing
  useEffect(() => {
    const pool = simulatedMessages[companyId] || []
    if (!pool.length) return

    const scheduleNext = () => {
      const delay = 4000 + Math.random() * 9000 // 4–13s
      return setTimeout(() => {
        const msg = pool[Math.floor(Math.random() * pool.length)]

        // show typing for 1.5–3s before "sending"
        const typeDuration = 1500 + Math.random() * 1500
        setTypingUsers(prev => prev.includes(msg.user) ? prev : [...prev, msg.user])

        setTimeout(() => {
          setTypingUsers(prev => prev.filter(u => u !== msg.user))
          setMsgs(prev => [
            ...prev,
            {
              ...msg,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ])
        }, typeDuration)

        timerId = scheduleNext()
      }, delay)
    }

    let timerId = scheduleNext()
    return () => clearTimeout(timerId)
  }, [companyId])

  // Self-typing indicator
  const handleInput = (val) => {
    setInput(val)
    if (typingTimers.current.self) clearTimeout(typingTimers.current.self)
    if (val.trim()) {
      setTypingUsers(prev => prev.includes(currentUser.name) ? prev : [...prev, currentUser.name])
      typingTimers.current.self = setTimeout(() => {
        setTypingUsers(prev => prev.filter(u => u !== currentUser.name))
      }, 2000)
    } else {
      setTypingUsers(prev => prev.filter(u => u !== currentUser.name))
    }
  }

  const send = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    setTypingUsers(prev => prev.filter(u => u !== currentUser.name))
    if (typingTimers.current.self) clearTimeout(typingTimers.current.self)
    setMsgs(m => [...m, {
      user: currentUser.name,
      role: currentUser.role,
      avatar: currentUser.avatar,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: input.trim(),
    }])
    setInput('')
  }

  // Group consecutive messages from same user (within 5 min conceptually)
  const grouped = msgs.reduce((acc, m, i) => {
    const prev = msgs[i - 1]
    const sameUser = prev && prev.user === m.user
    acc.push({ ...m, compact: sameUser })
    return acc
  }, [])

  return (
    <div className="flex flex-col h-full">
      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>

      <div className="flex-1 overflow-y-auto pt-4 px-4">
        {grouped.length === 0 && (
          <div className="text-center text-blue-300/30 text-sm py-8">No messages yet.</div>
        )}
        {grouped.map((m, i) => (
          <div
            key={i}
            className={`flex gap-3 group hover:bg-white/[0.02] rounded-lg px-2 -mx-2 transition-colors ${m.compact ? 'pt-0.5 pb-0.5' : 'pt-2 pb-0.5'}`}
          >
            {m.compact ? (
              <div className="w-8 shrink-0 flex items-center justify-center">
                <span className="text-blue-300/20 text-xs opacity-0 group-hover:opacity-100 transition-opacity select-none leading-none">
                  {m.time}
                </span>
              </div>
            ) : (
              <Avatar
                avatar={m.avatar}
                color={avatarGradients[m.avatar] || '#0ea5e9'}
                size={32}
                className="mt-0.5"
              />
            )}
            <div className="flex-1 min-w-0">
              {!m.compact && (
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span
                    className="text-sm font-semibold text-white hover:underline cursor-pointer px-1 rounded"
                    style={{ background: 'rgba(0,0,0,0.15)', backdropFilter: 'blur(4px)' }}
                  >{m.user}</span>
                  <span className={`text-xs px-1.5 py-0 rounded ${roleBadgeColors[m.role] || ''}`}>{m.role}</span>
                  <span className="text-xs text-blue-300/25">{m.time}</span>
                </div>
              )}
              <p
                className="text-sm text-blue-100/90 leading-relaxed break-words inline-block px-2 py-0.5 rounded-md"
                style={{ background: 'rgba(0,0,0,0.15)', backdropFilter: 'blur(4px)' }}
              >{m.text}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Typing indicator */}
      <TypingIndicator names={typingUsers.filter(u => u !== currentUser.name)} />

      {/* Input */}
      <form onSubmit={send} className="px-4 pb-4">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 border border-blue-500/20 focus-within:border-cyan-500/40 transition-colors"
          style={{ background: 'rgba(4,13,26,0.6)', backdropFilter: 'blur(12px)' }}>
          <input
            value={input}
            onChange={e => handleInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(e)}
            placeholder={`Message #${channelName}`}
            className="flex-1 bg-transparent text-sm text-white placeholder-blue-300/25 outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-7 h-7 rounded-md flex items-center justify-center bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 disabled:opacity-20 transition-all disabled:cursor-not-allowed shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19V5m-7 7l7-7 7 7" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  )
}

// ─── Meeting Stage ────────────────────────────────────────────────────────────
function MeetingStage({ company, onClose }) {
  const [muted, setMuted] = useState(false)
  const [videoOn, setVideoOn] = useState(true)
  const participants = [
    { name: currentUser.name, role: currentUser.role, avatar: currentUser.avatar },
    ...company.members_list.filter(m => m.online && m.name !== currentUser.name).slice(0, 3),
  ]

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'rgba(2,8,20,0.98)', backdropFilter: 'blur(8px)' }}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-blue-500/10">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white font-semibold">{company.name} — Main Stage</span>
          <span className="text-xs text-blue-300/40">{participants.length} participant{participants.length !== 1 ? 's' : ''}</span>
        </div>
        <button onClick={onClose} className="px-4 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-colors border border-red-500/20">
          Leave Stage
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
          {participants.map((p, i) => (
            <div key={i} className="aspect-video rounded-xl relative overflow-hidden border border-blue-500/20"
              style={{ background: 'linear-gradient(135deg, #071428, #040d1a)' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white"
                  style={{ background: avatarGradients[p.avatar] || '#0ea5e9' }}
                >
                  {p.avatar}
                </div>
              </div>
              <div className="absolute bottom-2 left-2">
                <span className="text-xs text-white bg-black/60 px-2 py-0.5 rounded">{p.name}</span>
              </div>
              {i === 0 && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-400" />}
            </div>
          ))}
          <div className="aspect-video rounded-xl border border-dashed border-blue-500/15 flex items-center justify-center">
            <span className="text-xs text-blue-300/25">Waiting...</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 py-5 border-t border-blue-500/10">
        <button onClick={() => setMuted(m => !m)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${muted ? 'bg-red-500/30 border border-red-500/40 text-red-400' : 'border border-blue-500/20 text-white hover:border-cyan-500/40'}`}
          style={!muted ? { background: 'rgba(7,20,40,0.7)' } : {}}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {muted
              ? <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></>
              : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></>
            }
          </svg>
        </button>
        <button onClick={() => setVideoOn(v => !v)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${!videoOn ? 'bg-red-500/30 border border-red-500/40 text-red-400' : 'border border-blue-500/20 text-white hover:border-cyan-500/40'}`}
          style={videoOn ? { background: 'rgba(7,20,40,0.7)' } : {}}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        <button onClick={onClose}
          className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors text-lg">
          ✕
        </button>
      </div>
    </div>
  )
}

// ─── Server Page ──────────────────────────────────────────────────────────────
export default function ServerPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { userPhoto } = useUser()
  const company = companies.find(c => c.id === id)
  const [activeChannel, setActiveChannel] = useState(null)
  const [activeTab, setActiveTab] = useState('Chat')
  const [inStage, setInStage] = useState(false)
  const [activeVoiceChannel, setActiveVoiceChannel] = useState(null)
  const [voiceParticipants, setVoiceParticipants] = useState({})

  useEffect(() => {
    if (company) {
      const firstText = company.channels.find(c => c.type === 'text')
      if (firstText) setActiveChannel(firstText)
      setActiveTab('Chat')

      // Seed some online members into the first voice channel
      const vc = company.channels.find(c => c.type === 'voice')
      if (vc) {
        const online = company.members_list.filter(m => m.online && m.name !== currentUser.name)
        const seed = online.slice(0, 2 + Math.floor(Math.random() * 2))
        setVoiceParticipants({ [vc.id]: seed })
      }
    }
  }, [id])

  const joinVoice = (ch) => {
    setActiveVoiceChannel(ch)
    setVoiceParticipants(prev => {
      const existing = prev[ch.id] || []
      const alreadyIn = existing.some(m => m.name === currentUser.name)
      return alreadyIn ? prev : { ...prev, [ch.id]: [...existing, { name: currentUser.name, avatar: currentUser.avatar, role: currentUser.role, online: true }] }
    })
    setInStage(true)
  }

  const leaveVoice = () => {
    if (activeVoiceChannel) {
      setVoiceParticipants(prev => ({
        ...prev,
        [activeVoiceChannel.id]: (prev[activeVoiceChannel.id] || []).filter(m => m.name !== currentUser.name),
      }))
    }
    setActiveVoiceChannel(null)
    setInStage(false)
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center h-screen text-blue-300/50">
        Server not found. <button onClick={() => navigate('/')} className="ml-2 text-cyan-400 underline">Go home</button>
      </div>
    )
  }

  const accessible = (ch) => {
    const roleMap = { public: 'Public', member: 'Member', partner: 'Partner', investor: 'Investor', admin: 'Admin' }
    return canAccess(currentUser.role, roleMap[ch.role] || 'Public')
  }

  const textChannels = company.channels.filter(c => c.type === 'text')
  const voiceChannels = company.channels.filter(c => c.type === 'voice')

  return (
    <div className="page-enter flex h-screen pt-14 relative z-10">
      {inStage && <MeetingStage company={company} onClose={leaveVoice} />}

      {/* Left Sidebar */}
      <aside className="w-56 border-r border-blue-500/10 flex flex-col shrink-0"
        style={{ background: 'var(--surface)', backdropFilter: 'blur(14px)' }}>
        <div className="p-3 border-b border-blue-500/10">
          <button onClick={() => navigate('/')} className="text-xs text-blue-300/40 hover:text-cyan-400 transition-colors mb-2 flex items-center gap-1">
            ← Home
          </button>
          <div className="flex items-center gap-2">
            <Avatar photo={company.logo} avatar={company.avatar} color={company.color} size={36} rounded="8px" useDicebear={false} />
            <div>
              <div className="text-sm font-semibold text-white leading-tight">{company.name}</div>
              <div className="text-xs text-blue-300/40">
                <span className="text-green-400">●</span> {company.online} online
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-3">
          <div>
            <p className="text-xs text-blue-300/25 px-2 mb-1 font-semibold tracking-wider uppercase">Text Channels</p>
            {textChannels.map(ch => {
              const ok = accessible(ch)
              return (
                <button key={ch.id}
                  onClick={() => ok && (setActiveChannel(ch), setActiveTab('Chat'))}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors text-sm ${
                    activeChannel?.id === ch.id && activeTab === 'Chat'
                      ? 'bg-blue-500/20 text-white'
                      : ok ? 'text-blue-300/60 hover:text-white hover:bg-blue-500/10' : 'text-blue-300/20 cursor-not-allowed'
                  }`}>
                  <span className="text-xs">{ch.icon}</span>
                  <span className="truncate">{ch.name}</span>
                  {!ok && <svg className="ml-auto w-3 h-3 text-blue-300/20 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>}
                </button>
              )
            })}
          </div>

          <div>
            <p className="text-xs text-blue-300/25 px-2 mb-1 font-semibold tracking-wider uppercase">Voice / Stage</p>
            {voiceChannels.map(ch => {
              const ok = accessible(ch)
              const participants = voiceParticipants[ch.id] || []
              const iAmIn = participants.some(m => m.name === currentUser.name)
              return (
                <div key={ch.id}>
                  <button
                    onClick={() => ok && joinVoice(ch)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors text-sm ${
                      iAmIn
                        ? 'bg-green-500/10 text-green-300 border border-green-500/20'
                        : ok ? 'text-blue-300/60 hover:text-white hover:bg-blue-500/10' : 'text-blue-300/20 cursor-not-allowed'
                    }`}>
                    <span className="text-xs">{ch.icon}</span>
                    <span className="truncate">{ch.name}</span>
                    {participants.length > 0 && (
                      <span className="ml-auto text-xs text-blue-300/40">{participants.length}</span>
                    )}
                    {!ok && <svg className="ml-auto w-3 h-3 text-blue-300/20 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>}
                    {ok && participants.length === 0 && (
                      <span className="ml-auto text-green-400 text-xs opacity-60">Join</span>
                    )}
                  </button>
                  {/* Participants list */}
                  {participants.length > 0 && (
                    <div className="ml-5 mb-1 space-y-0.5">
                      {participants.map((p, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-1 py-0.5">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                            style={{ background: avatarGradients[p.avatar] || '#0ea5e9' }}>
                            {p.avatar}
                          </div>
                          <span className={`text-xs truncate ${p.name === currentUser.name ? 'text-green-300' : 'text-blue-300/60'}`}>
                            {p.name === currentUser.name ? 'You' : p.name}
                          </span>
                          {p.name === currentUser.name && (
                            <span className="ml-auto shrink-0">
                              <svg className="w-2.5 h-2.5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
                                <path d="M12 1a11 11 0 100 22A11 11 0 0012 1zm0 18a7 7 0 110-14 7 7 0 010 14z" fillOpacity="0.3"/>
                              </svg>
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </aside>

      {/* Main area */}
      <main className="flex-1 flex flex-col min-w-0" style={{ background: 'var(--main-bg)' }}>
        {/* Tab bar */}
        <div className="flex items-center border-b border-blue-500/10 px-4 gap-1 shrink-0 h-12">
          {activeChannel && activeTab === 'Chat' && (
            <span className="text-blue-300/40 text-sm mr-2 hidden sm:block">
              # {activeChannel.name}
            </span>
          )}
          <div className="flex items-center gap-1 ml-auto">
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs rounded transition-colors ${
                  activeTab === tab
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-blue-300/50 hover:text-white hover:bg-blue-500/10'
                }`}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {activeTab === 'Chat' && activeChannel && (
            <ChatChannel
              key={`${id}-${activeChannel.id}`}
              messages={company.messages[activeChannel.id] || []}
              channelName={activeChannel.name}
              companyId={id}
              membersList={company.members_list}
            />
          )}

          {activeTab === 'Posts' && (
            <PostsTab companyId={id} companyName={company.name} />
          )}

          {activeTab === 'About' && (
            <div className="p-6 overflow-y-auto h-full">
              <div className="max-w-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar photo={company.logo} avatar={company.avatar} color={company.color} size={64} rounded="12px" useDicebear={false} />
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl font-bold text-white">{company.name}</h1>
                      {company.verified && <span className="text-cyan-400 text-sm">✓</span>}
                    </div>
                    <p className="text-blue-300/60 text-sm">{company.tagline}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-blue-300/40">
                      <span>{company.members.toLocaleString()} members</span>
                      <span className="text-green-400">● {company.online} online</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl p-4 border border-blue-500/10" style={{ background: 'rgba(14,165,233,0.04)' }}>
                  <h3 className="text-sm font-semibold text-cyan-400 mb-2">About</h3>
                  <p className="text-sm text-blue-100/70 leading-relaxed">{company.about}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Jobs' && (
            <div className="p-6 overflow-y-auto h-full">
              <div className="max-w-2xl space-y-3">
                <h2 className="text-lg font-semibold text-white mb-4">Open Positions</h2>
                {company.jobs.map((job, i) => (
                  <div key={i} className="rounded-xl p-4 border border-blue-500/10 hover:border-cyan-500/30 transition-colors cursor-pointer group"
                    style={{ background: 'rgba(14,165,233,0.04)' }}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">{job.title}</h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-blue-300/40">
                          <span>{job.dept}</span><span>·</span><span>{job.location}</span>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded border border-blue-500/20">{job.type}</span>
                    </div>
                    <button className="mt-3 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Apply →</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'News' && (
            <div className="p-6 overflow-y-auto h-full">
              <div className="max-w-2xl space-y-4">
                <h2 className="text-lg font-semibold text-white mb-4">{company.name} News</h2>
                {company.news.map((item, i) => (
                  <div key={i} className="rounded-xl p-4 border border-blue-500/10 hover:border-cyan-500/30 transition-colors cursor-pointer group"
                    style={{ background: 'rgba(14,165,233,0.04)' }}>
                    <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">{item.title}</h3>
                    <p className="text-xs text-blue-300/40 mt-1">{item.date}</p>
                    <p className="text-sm text-blue-100/60 mt-2 leading-relaxed">{item.excerpt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Investor Relations' && (
            <div className="p-6 overflow-y-auto h-full">
              <div className="max-w-2xl">
                {canAccess(currentUser.role, 'Investor') ? (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-white mb-4">Investor Relations</h2>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Total Funding', value: '$1.1B', change: '+$675M Series C' },
                        { label: 'Valuation', value: '$3.4B', change: '+24% YoY' },
                        { label: 'Revenue Run Rate', value: '$89M', change: '+140% YoY' },
                        { label: 'Deployments', value: '2,400+', change: '+800 this quarter' },
                      ].map((m, i) => (
                        <div key={i} className="rounded-xl p-4 border border-blue-500/10" style={{ background: 'rgba(14,165,233,0.04)' }}>
                          <p className="text-xs text-blue-300/40">{m.label}</p>
                          <p className="text-xl font-bold text-white mt-1">{m.value}</p>
                          <p className="text-xs text-green-400 mt-0.5">{m.change}</p>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl p-4 border border-blue-500/10" style={{ background: 'rgba(14,165,233,0.04)' }}>
                      <h3 className="text-sm font-semibold text-cyan-400 mb-2">Upcoming Investor Call</h3>
                      <p className="text-sm text-blue-100/70">Q1 2026 Earnings — March 25, 2026 at 4:00 PM ET</p>
                      <button className="mt-3 px-4 py-1.5 bg-cyan-500/20 text-cyan-300 rounded-lg text-sm border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors">
                        Add to Calendar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 border border-blue-500/10" style={{ background: 'rgba(14,165,233,0.05)' }}>
                    <svg className="w-6 h-6 text-blue-300/30" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                  </div>
                    <h3 className="text-white font-semibold mb-2">Investor Access Required</h3>
                    <p className="text-blue-300/40 text-sm max-w-xs">This section is restricted to verified investors.</p>
                    <span className={`mt-3 text-xs px-2 py-1 rounded ${roleBadgeColors['Investor']}`}>Investor Role Required</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar: Members */}
      <aside className="w-52 border-l border-blue-500/10 overflow-y-auto shrink-0 hidden lg:block"
        style={{ background: 'var(--surface)', backdropFilter: 'blur(14px)' }}>
        <div className="p-3 border-b border-blue-500/10">
          <p className="text-xs text-blue-300/30 font-semibold tracking-wider uppercase">
            Members — {company.members_list.length}
          </p>
        </div>

        {['Admin', 'Partner', 'Investor', 'Member'].map(role => {
          const members = company.members_list.filter(m => m.role === role)
          if (!members.length) return null
          return (
            <div key={role} className="p-2">
              <p className="text-xs text-blue-300/20 px-2 mb-1 uppercase tracking-wider">
                {role} — {members.length}
              </p>
              {members.map(m => (
                <div key={m.id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-blue-500/10 cursor-pointer group transition-colors">
                  <div className="relative shrink-0">
                    <Avatar photo={m.name === currentUser.name ? (userPhoto || m.photo) : m.photo} avatar={m.avatar} color={avatarGradients[m.avatar] || '#0ea5e9'} size={28} />
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 ${m.online ? 'bg-green-400' : 'bg-gray-600'}`}
                      style={{ borderColor: '#040d1a' }} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-white truncate group-hover:text-cyan-300 transition-colors">{m.name}</div>
                    <div className="text-xs text-blue-300/25 truncate">{m.title}</div>
                  </div>
                </div>
              ))}
            </div>
          )
        })}
      </aside>
    </div>
  )
}
