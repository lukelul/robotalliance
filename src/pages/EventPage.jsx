import { useParams, useNavigate } from 'react-router-dom'
import { events, roleBadgeColors } from '../data/mockData'

const eventTypeColors = {
  Conference: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  'Partner Event': 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  'Investor Call': 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
  Community: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
  Academic: 'bg-green-500/20 text-green-300 border border-green-500/30',
}


export default function EventPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const ev = events.find(e => String(e.id) === String(id))

  if (!ev) return (
    <div className="flex items-center justify-center h-screen text-blue-300/50">
      Event not found. <button onClick={() => navigate('/')} className="ml-2 text-cyan-400 underline">Home</button>
    </div>
  )

  return (
    <div className="page-enter pt-20 pb-24 px-4 max-w-2xl mx-auto relative z-10">
      <button onClick={() => navigate('/')} className="text-xs text-blue-300/40 hover:text-cyan-400 transition-colors mb-6 flex items-center gap-1">
        ← Back to Home
      </button>

      {/* Main card */}
      <div className="rounded-2xl overflow-hidden border border-blue-500/15"
        style={{ background: 'var(--surface)', backdropFilter: 'blur(16px)' }}>

        {/* Header band */}
        <div className="px-8 pt-8 pb-6 border-b border-blue-500/10">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded font-medium tracking-wide ${eventTypeColors[ev.type] || ''}`}>
              {ev.type}
            </span>
            {ev.role !== 'public' && (
              <span className={`text-xs px-2 py-0.5 rounded border ${roleBadgeColors[ev.role === 'partner' ? 'Partner' : 'Investor']}`}>
                {ev.role}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white leading-snug mb-2">{ev.title}</h1>
          <p className="text-blue-300/50 text-sm">Hosted by <span className="text-cyan-400">{ev.host}</span></p>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-px border-b border-blue-500/10"
          style={{ background: 'rgba(14,165,233,0.05)' }}>
          <div className="px-6 py-4" style={{ background: 'rgba(4,13,26,0.2)' }}>
            <p className="text-xs text-blue-300/30 mb-1 uppercase tracking-wider">Date</p>
            <p className="text-sm font-medium text-cyan-400">{ev.date}</p>
          </div>
          <div className="px-6 py-4" style={{ background: 'rgba(4,13,26,0.2)' }}>
            <p className="text-xs text-blue-300/30 mb-1 uppercase tracking-wider">Location</p>
            <p className="text-sm font-medium text-white">{ev.location}</p>
          </div>
        </div>

        {/* Description */}
        <div className="px-8 py-6">
          <p className="text-sm text-blue-300/60 leading-relaxed">{ev.description}</p>
        </div>

        {/* CTA */}
        {ev.externalUrl ? (
          <div className="px-8 pb-8">
            <a
              href={ev.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-white transition-all hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.8), rgba(14,165,233,0.7))', boxShadow: '0 0 24px rgba(6,182,212,0.25)' }}
            >
              Visit Event Website ↗
            </a>
          </div>
        ) : (
          <div className="px-8 pb-8">
            <p className="text-xs text-blue-300/30 italic">Registration details will be posted in the Robo Alliance community.</p>
          </div>
        )}
      </div>
    </div>
  )
}
