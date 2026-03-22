import { useNavigate } from 'react-router-dom'
import { leadership, advisors } from '../data/mockData'
import Avatar from '../components/Avatar'

const blkStyle = { background: 'var(--surface)', backdropFilter: 'blur(14px)' }

export default function LeadershipPage() {
  const navigate = useNavigate()

  return (
    <div className="page-enter pt-20 pb-16 px-4 max-w-6xl mx-auto relative z-10">

      {/* Page header */}
      <div className="mb-12 border-b border-blue-500/10 pb-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-blue-300/30 mb-2">Robo Alliance</p>
        <h1 className="text-3xl font-semibold tracking-tight text-white mb-3">Leadership &amp; Governance</h1>
        <p className="text-blue-300/50 text-sm leading-relaxed max-w-2xl">
          Robo Alliance is guided by a diverse executive team and an independent board of advisors drawn from
          the world's foremost research institutions, industry organizations, and investment communities.
          Our leadership is committed to a single mission: making the global robotics ecosystem more
          open, collaborative, and impactful.
        </p>
      </div>

      {/* Executive Leadership */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-blue-300/40">Executive Team</h2>
          <span className="text-xs text-blue-300/25 tracking-wide">{leadership.length} Members</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {leadership.map((person, i) => (
            <div
              key={person.id}
              className="rounded-xl border border-blue-500/10 hover:border-blue-500/25 transition-all overflow-hidden group relative"
              style={{ ...blkStyle, height: '360px' }}
            >
              {/* Large photo */}
              <div className="absolute inset-0" style={{
                backgroundImage: `url(${person.photo})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center top',
                backgroundRepeat: 'no-repeat',
                backgroundColor: person.color + '22',
              }} />
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, transparent 70%)' }} />

              {/* Text overlay — bottom left */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-lg font-semibold text-white leading-tight">{person.name}</h3>
                <p className="text-sm text-white/60 mt-1">{person.title}</p>
                <p className="text-xs text-white/40 mt-1">{person.background}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Board of Advisors */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-blue-300/40">Board of Advisors</h2>
          <span className="text-xs text-blue-300/25 tracking-wide">{advisors.length} Members</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {advisors.map(adv => (
            <div
              key={adv.id}
              className="rounded-xl border border-blue-500/10 hover:border-blue-500/20 transition-all p-4"
              style={blkStyle}
            >
              <div className="flex items-center gap-3 mb-3">
                <Avatar photo={adv.photo} avatar={adv.avatar} color={adv.color} size={40} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white leading-tight">{adv.name}</div>
                  <div className="text-xs text-blue-300/40 mt-0.5">{adv.title}</div>
                </div>
              </div>
              <p className="text-xs text-blue-300/60 leading-snug mb-3">{adv.affiliation}</p>
              <div className="flex flex-wrap gap-1">
                {adv.expertise.map(tag => (
                  <span
                    key={tag}
                    className="text-xs px-1.5 py-0.5 rounded border border-blue-500/15 text-blue-300/40"
                    style={{ background: 'var(--input-bg)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Governance principles */}
      <section>
        <div className="mb-6">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-blue-300/40">Governance Principles</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Neutrality',
              body: 'Robo Alliance does not endorse individual companies or technologies. Our leadership serves the broader community — not any single interest group.',
              icon: '⊖',
              color: '#0ea5e9',
            },
            {
              title: 'Transparency',
              body: 'Decisions affecting platform policy, membership, and partnerships are documented and shared with community stakeholders through our quarterly reports.',
              icon: '◎',
              color: '#10b981',
            },
            {
              title: 'Inclusion',
              body: 'We are committed to ensuring the robotics ecosystem reflects the full breadth of human talent — across geographies, backgrounds, and career stages.',
              icon: '◈',
              color: '#f59e0b',
            },
          ].map(p => (
            <div
              key={p.title}
              className="rounded-xl border border-blue-500/10 p-5"
              style={blkStyle}
            >
              <div
                className="text-lg mb-3 font-mono"
                style={{ color: p.color }}
              >
                {p.icon}
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">{p.title}</h3>
              <p className="text-xs text-blue-300/60 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
