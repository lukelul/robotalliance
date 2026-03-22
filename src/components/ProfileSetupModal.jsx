import { useState } from 'react'
import { useUser } from '../context/UserContext'

const TYPES = ['HS Student', 'College Student', 'Researcher', 'Mentor', 'Robotics Engineer', 'Enthusiast', 'Investor', 'Industry Professional']

export default function ProfileSetupModal() {
  const { saveProfile, firebaseUser } = useUser()
  const [name, setName] = useState(firebaseUser?.displayName || '')
  const [type, setType] = useState('Enthusiast')
  const [school, setSchool] = useState('')
  const [bio, setBio] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    await saveProfile({ name: name.trim(), type, school: school.trim(), bio: bio.trim(), title: title.trim() })
    setLoading(false)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-blue-500/20 p-6"
        style={{ background: 'rgba(4,13,26,0.97)' }}
      >
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">Set up your profile</h2>
          <p className="text-xs text-blue-300/70 mt-1">You'll appear in the Robo Alliance network once you're set up.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-blue-300/70 mb-1 block">Full Name *</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Your name"
              className="w-full px-3 py-2.5 rounded-lg border border-blue-500/30 bg-white/10 text-sm text-white placeholder-blue-300/50 outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-blue-300/70 mb-1 block">I am a…</label>
            <div className="flex flex-wrap gap-2">
              {TYPES.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`px-3 py-1 rounded-full text-xs border transition-all ${
                    type === t
                      ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                      : 'border-blue-500/20 text-blue-300/50 hover:border-blue-500/40 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-blue-300/70 mb-1 block">School / Organization</label>
            <input
              value={school}
              onChange={e => setSchool(e.target.value)}
              placeholder="e.g. MIT, Boston Dynamics, Independent"
              className="w-full px-3 py-2.5 rounded-lg border border-blue-500/30 bg-white/10 text-sm text-white placeholder-blue-300/50 outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-blue-300/70 mb-1 block">Title / Role</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Robotics Engineer, PhD Candidate"
              className="w-full px-3 py-2.5 rounded-lg border border-blue-500/30 bg-white/10 text-sm text-white placeholder-blue-300/50 outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-blue-300/70 mb-1 block">Bio</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Tell the community about yourself…"
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-blue-500/30 bg-white/10 text-sm text-white placeholder-blue-300/50 outline-none focus:border-cyan-500/50 transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full py-2.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-sm font-medium hover:bg-cyan-500/30 transition-all disabled:opacity-50"
          >
            {loading ? 'Saving…' : 'Join the Network'}
          </button>
        </form>
      </div>
    </div>
  )
}
