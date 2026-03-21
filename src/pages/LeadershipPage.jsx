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
              className="rounded-xl border border-blue-500/10 hover:border-blue-500/25 transition-all overflow-hidden group"
              style={blkStyle}
            >
              {/* Color accent bar */}
              <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${person.color}, transparent)` }} />

              <div className="p-5">
                {/* Avatar + name */}
                <div className="flex items-start gap-4 mb-4">
                  <Avatar
                    photo={person.photo}
                    avatar={person.avatar}
                    color={person.color}
                    size={56}
                    style={{ boxShadow: `0 4px 20px ${person.color}30` }}
                  />
                  <div className="flex-1 min-w-0 pt-0.5">
                    <h3 className="text-base font-semibold text-white leading-tight">{person.name}</h3>
                    <p className="text-xs text-blue-300/50 mt-0.5 leading-snug">{person.title}</p>
                    <p className="text-xs text-blue-300/50 mt-1 leading-snug">{person.background}</p>
                  </div>
                  {/* Region badge */}
                  <span className="text-xs text-blue-300/50 border border-blue-500/15 rounded px-2 py-0.5 shrink-0 hidden sm:block">
                    {person.region}
                  </span>
                </div>

                {/* Bio */}
                <p className="text-sm text-blue-100/70 leading-relaxed mb-4">{person.bio}</p>

                {/* Expertise */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {person.expertise.map(tag => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full border border-blue-500/15 text-blue-300/50"
                      style={{ background: 'var(--input-bg)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Initiatives */}
                <div className="border-t border-blue-500/08 pt-3">
                  <p className="text-xs text-blue-300/25 uppercase tracking-widest mb-2">Initiatives</p>
                  <div className="flex flex-col gap-1">
                    {person.initiatives.map(init => (
                      <div key={init} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full shrink-0" style={{ background: person.color }} />
                        <span className="text-xs text-blue-300/60">{init}</span>
                      </div>
                    ))}
                  </div>
                </div>
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
