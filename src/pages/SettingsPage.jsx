import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { currentUser, roleBadgeColors } from '../data/mockData'
import { useTheme } from '../context/ThemeContext'
import { useUser } from '../context/UserContext'
import Avatar from '../components/Avatar'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { userPhoto, updatePhoto } = useUser()
  const fileInputRef = useRef(null)

  const panelStyle = {
    background: 'var(--surface)',
    backdropFilter: 'blur(16px)',
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => updatePhoto(ev.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="page-enter pt-20 pb-24 px-4 max-w-2xl mx-auto relative z-10">
      <button
        onClick={() => navigate(-1)}
        className="text-xs text-blue-300/40 hover:text-cyan-400 transition-colors mb-6 flex items-center gap-1"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-semibold tracking-tight text-white mb-6">Settings</h1>

      {/* Profile card */}
      <div className="rounded-2xl border border-blue-500/10 overflow-hidden mb-5" style={panelStyle}>
        <div className="px-6 py-4 border-b border-blue-500/10">
          <p className="text-xs text-blue-300/40 font-semibold uppercase tracking-widest">Profile</p>
        </div>
        <div className="px-6 py-5 flex items-center gap-4">
          {/* Clickable avatar — opens file picker */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="relative group shrink-0"
            title="Click to upload profile photo"
          >
            <Avatar
              photo={userPhoto}
              avatar={currentUser.avatar}
              color="linear-gradient(135deg, #00d4ff, #0284c7)"
              size={64}
              rounded="16px"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '16px' }}>
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </button>

          <div className="flex-1 min-w-0">
            <div className="text-lg font-semibold text-white leading-tight">{currentUser.name}</div>
            <div className="text-sm text-blue-300/50 mt-0.5">{currentUser.title}</div>
            <div className="mt-2 flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded ${roleBadgeColors[currentUser.role]}`}>
                {currentUser.role}
              </span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-cyan-400/60 hover:text-cyan-300 transition-colors"
              >
                Change photo
              </button>
            </div>
          </div>
          <button
            onClick={() => navigate(`/profile/${currentUser.id}`)}
            className="px-4 py-2 text-sm rounded-lg border border-blue-500/20 text-blue-300 hover:text-cyan-300 hover:border-cyan-500/30 transition-colors shrink-0"
            style={{ background: 'rgba(14,165,233,0.05)' }}
          >
            View Profile
          </button>
        </div>
      </div>

      {/* Appearance */}
      <div className="rounded-2xl border border-blue-500/10 overflow-hidden mb-5" style={panelStyle}>
        <div className="px-6 py-4 border-b border-blue-500/10">
          <p className="text-xs text-blue-300/40 font-semibold uppercase tracking-widest">Appearance</p>
        </div>
        <div className="px-6 py-5 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-white">Color Mode</div>
            <div className="text-xs text-blue-300/40 mt-0.5">
              {theme === 'dark' ? 'Dark mode is active' : 'Light mode is active'}
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2.5 px-4 py-2 rounded-lg border transition-all text-sm font-medium"
            style={{
              background: theme === 'dark' ? 'rgba(14,165,233,0.08)' : 'rgba(255,255,255,0.8)',
              borderColor: theme === 'dark' ? 'rgba(14,165,233,0.2)' : 'rgba(14,165,233,0.25)',
              color: theme === 'dark' ? '#7dd3fc' : '#0369a1',
            }}
          >
            {theme === 'dark' ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Switch to Light
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                Switch to Dark
              </>
            )}
          </button>
        </div>
      </div>

      {/* Account */}
      <div className="rounded-2xl border border-blue-500/10 overflow-hidden" style={panelStyle}>
        <div className="px-6 py-4 border-b border-blue-500/10">
          <p className="text-xs text-blue-300/40 font-semibold uppercase tracking-widest">Account</p>
        </div>
        <div className="divide-y divide-blue-500/10">
          {[
            { label: 'Email', value: 'luke@robotalliance.io' },
            { label: 'Member since', value: 'January 2025' },
            { label: 'Plan', value: 'Robo Alliance Admin' },
          ].map(row => (
            <div key={row.label} className="px-6 py-4 flex items-center justify-between">
              <span className="text-sm text-blue-300/50">{row.label}</span>
              <span className="text-sm text-white">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
