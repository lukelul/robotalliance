import { useState, useRef } from 'react'
import { usePosts } from '../context/PostsContext'
import { currentUser, companies } from '../data/mockData'
import { useTheme } from '../context/ThemeContext'

const avatarGradients = {
  LL: '#00d4ff', RP: '#f59e0b', MP: '#f59e0b', EB: '#8b5cf6', SR: '#ec4899',
  JW: '#10b981', PS: '#0ea5e9', CM: '#f97316', AJ: '#a78bfa', NK: '#34d399',
  YT: '#fb923c', SC: '#06b6d4', MW: '#f59e0b', DT: '#ec4899', TH: '#84cc16',
  RN: '#c084fc', BO: '#f87171', JL: '#38bdf8', FA: '#4ade80',
}

const destinationOptions = [
  { value: 'My Profile', label: 'My Profile' },
  ...companies.map(c => ({ value: c.id, label: c.name })),
]

export default function PostComposer() {
  const { addPost } = usePosts()
  const { theme } = useTheme()
  const L = theme === 'light'

  const [open, setOpen] = useState(false)
  const [content, setContent] = useState('')
  const [destination, setDestination] = useState('My Profile')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState([])
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [video, setVideo] = useState(null)
  const [hoverBtn, setHoverBtn] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const photoRef = useRef(null)
  const videoRef = useRef(null)

  const avatarColor = avatarGradients[currentUser.avatar] || '#00d4ff'

  // Theme-aware style tokens
  const T = {
    overlay:      L ? 'rgba(15,23,42,0.45)' : 'rgba(2,8,23,0.78)',
    modalBg:      L ? '#ffffff' : '#0d1829',
    modalBorder:  L ? 'rgba(14,100,200,0.18)' : 'rgba(6,182,212,0.2)',
    headerBorder: L ? 'rgba(14,100,200,0.1)' : 'rgba(255,255,255,0.06)',
    headerBg:     L ? 'rgba(14,100,200,0.04)' : 'rgba(6,182,212,0.04)',
    titleColor:   L ? '#0f172a' : '#f1f5f9',
    closeColor:   L ? '#475569' : '#64748b',
    labelColor:   L ? '#475569' : '#94a3b8',
    inputBg:      L ? 'rgba(14,100,200,0.05)' : 'rgba(255,255,255,0.03)',
    inputBorder:  L ? 'rgba(14,100,200,0.18)' : 'rgba(255,255,255,0.08)',
    inputColor:   L ? '#0f172a' : '#e2e8f0',
    inputFocus:   L ? 'rgba(14,100,200,0.35)' : 'rgba(6,182,212,0.45)',
    inputBlur:    L ? 'rgba(14,100,200,0.18)' : 'rgba(255,255,255,0.08)',
    selectBg:     L ? 'rgba(14,100,200,0.05)' : 'rgba(255,255,255,0.04)',
    selectBorder: L ? 'rgba(14,100,200,0.18)' : 'rgba(255,255,255,0.1)',
    selectBlur:   L ? 'rgba(14,100,200,0.18)' : 'rgba(255,255,255,0.1)',
    optionBg:     L ? '#ffffff' : '#0d1829',
    optionColor:  L ? '#0f172a' : '#e2e8f0',
    btnBg:        L ? 'rgba(14,100,200,0.06)' : 'rgba(255,255,255,0.04)',
    btnBorder:    L ? 'rgba(14,100,200,0.15)' : 'rgba(255,255,255,0.08)',
    btnColor:     L ? '#475569' : '#94a3b8',
    footerBorder: L ? 'rgba(14,100,200,0.1)' : 'rgba(255,255,255,0.06)',
    tooltipBg:    L ? 'rgba(15,23,42,0.88)' : 'rgba(15,23,42,0.92)',
    tooltipColor: '#e2e8f0',
    tooltipBorder:L ? 'rgba(14,100,200,0.2)' : 'rgba(255,255,255,0.08)',
    tagBg:        L ? 'rgba(14,100,200,0.1)' : 'rgba(6,182,212,0.12)',
    tagBorder:    L ? 'rgba(14,100,200,0.25)' : 'rgba(6,182,212,0.25)',
    tagColor:     L ? '#1d4ed8' : '#67e8f9',
    disabledBg:   L ? 'rgba(14,100,200,0.06)' : 'rgba(255,255,255,0.06)',
    disabledColor:L ? '#94a3b8' : '#475569',
  }

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() }
  }

  const addTag = () => {
    const raw = tagInput.split(',').map(t => t.trim().replace(/^#+/, '')).filter(Boolean)
    setTags(prev => [...new Set([...prev, ...raw])])
    setTagInput('')
  }

  const removeTag = (tag) => setTags(tags.filter(t => t !== tag))

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhoto(file)
    if (file.type.startsWith('image/')) {
      setPhotoPreview(URL.createObjectURL(file))
    } else {
      setPhotoPreview(null)
    }
  }

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setVideo(file)
  }

  const handleClose = () => {
    setOpen(false); setContent(''); setDestination('My Profile')
    setTagInput(''); setTags([]); setPhoto(null); setPhotoPreview(null); setVideo(null)
  }

  const handleSubmit = () => {
    if (!content.trim()) return
    setSubmitting(true)
    const finalTags = [...tags]
    if (tagInput.trim()) {
      tagInput.split(',').map(t => t.trim().replace(/^#+/, '')).filter(Boolean).forEach(t => {
        if (!finalTags.includes(t)) finalTags.push(t)
      })
    }
    const destinationLabel = destinationOptions.find(d => d.value === destination)?.label || 'My Profile'
    addPost({
      author: currentUser.name, avatar: currentUser.avatar, color: avatarColor,
      title: currentUser.title, content: content.trim(), tags: finalTags, destination: destinationLabel,
    })
    setTimeout(() => { setSubmitting(false); handleClose() }, 320)
  }

  return (
    <>
      {/* ── Floating trigger button ── */}
      <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 40 }}>
        <span style={{
          position: 'absolute', inset: 0, borderRadius: '9999px',
          background: 'rgba(0,212,255,0.35)',
          animation: 'composerPulse 2.2s ease-out infinite', pointerEvents: 'none',
        }} />
        <button
          onClick={() => setOpen(true)}
          onMouseEnter={() => setHoverBtn(true)}
          onMouseLeave={() => setHoverBtn(false)}
          title="New Post"
          style={{
            position: 'relative', width: '48px', height: '48px', borderRadius: '9999px',
            border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
            color: '#fff', fontSize: '24px', lineHeight: 1, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            boxShadow: hoverBtn ? '0 0 0 3px rgba(6,182,212,0.45), 0 8px 24px rgba(0,0,0,0.55)' : '0 4px 16px rgba(0,0,0,0.45)',
            transform: hoverBtn ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          aria-label="New Post"
        >+</button>

        {hoverBtn && (
          <div style={{
            position: 'absolute', bottom: '56px', left: '50%', transform: 'translateX(-50%)',
            background: T.tooltipBg, color: T.tooltipColor,
            fontSize: '12px', padding: '4px 10px', borderRadius: '6px',
            whiteSpace: 'nowrap', border: `1px solid ${T.tooltipBorder}`, pointerEvents: 'none',
          }}>New Post</div>
        )}
      </div>

      {/* ── Modal overlay ── */}
      {open && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            background: T.overlay, backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
          }}
        >
          <div style={{
            width: '100%', maxWidth: '560px',
            background: T.modalBg, border: `1px solid ${T.modalBorder}`,
            borderRadius: '16px',
            boxShadow: L ? '0 24px 64px rgba(0,0,0,0.18)' : '0 24px 64px rgba(0,0,0,0.7)',
            overflow: 'hidden', display: 'flex', flexDirection: 'column',
          }}>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 20px', borderBottom: `1px solid ${T.headerBorder}`, background: T.headerBg,
            }}>
              <span style={{ color: T.titleColor, fontSize: '16px', fontWeight: 600, letterSpacing: '0.01em' }}>
                Create Post
              </span>
              <button
                onClick={handleClose}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.closeColor, fontSize: '20px', lineHeight: 1, padding: '2px 6px', borderRadius: '6px', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = L ? '#0f172a' : '#cbd5e1'}
                onMouseLeave={e => e.currentTarget.style.color = T.closeColor}
                aria-label="Close"
              >✕</button>
            </div>

            {/* Body */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Author row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '9999px',
                  background: `linear-gradient(135deg, ${avatarColor}cc, ${avatarColor}55)`,
                  border: `2px solid ${avatarColor}66`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: '#fff', flexShrink: 0,
                }}>
                  {currentUser.avatar}
                </div>
                <div>
                  <div style={{ color: T.titleColor, fontSize: '14px', fontWeight: 600 }}>{currentUser.name}</div>
                  <div style={{ color: T.labelColor, fontSize: '12px' }}>{currentUser.title}</div>
                </div>
              </div>

              {/* Textarea */}
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="What's on your mind?"
                rows={5}
                style={{
                  width: '100%', background: T.inputBg, border: `1px solid ${T.inputBorder}`,
                  borderRadius: '10px', color: T.inputColor, fontSize: '15px', lineHeight: '1.6',
                  padding: '12px 14px', resize: 'vertical', outline: 'none', fontFamily: 'inherit',
                  boxSizing: 'border-box', transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = T.inputFocus}
                onBlur={e => e.target.style.borderColor = T.inputBlur}
              />

              {/* Photo / Video previews */}
              {(photoPreview || photo || video) && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {photoPreview && (
                    <div style={{ position: 'relative' }}>
                      <img src={photoPreview} alt="attachment" style={{ height: '72px', width: '72px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(6,182,212,0.3)' }} />
                      <button
                        onClick={() => { setPhoto(null); setPhotoPreview(null) }}
                        style={{ position: 'absolute', top: '-6px', right: '-6px', width: '18px', height: '18px', borderRadius: '9999px', background: '#ef4444', border: 'none', color: '#fff', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        aria-label="Remove photo"
                      >✕</button>
                    </div>
                  )}
                  {photo && !photoPreview && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: T.tagBg, border: `1px solid ${T.tagBorder}`, borderRadius: '8px', padding: '6px 10px', color: T.tagColor, fontSize: '12px' }}>
                      Photo: {photo.name}
                      <button onClick={() => setPhoto(null)} style={{ background: 'none', border: 'none', color: T.labelColor, cursor: 'pointer', fontSize: '11px', padding: 0 }}>✕</button>
                    </div>
                  )}
                  {video && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: L ? 'rgba(107,33,168,0.08)' : 'rgba(139,92,246,0.08)', border: `1px solid ${L ? 'rgba(107,33,168,0.2)' : 'rgba(139,92,246,0.25)'}`, borderRadius: '8px', padding: '6px 10px', color: L ? '#6b21a8' : '#c4b5fd', fontSize: '12px' }}>
                      Video: {video.name}
                      <button onClick={() => setVideo(null)} style={{ background: 'none', border: 'none', color: T.labelColor, cursor: 'pointer', fontSize: '11px', padding: 0 }}>✕</button>
                    </div>
                  )}
                </div>
              )}

              {/* Destination selector */}
              <div>
                <label style={{ color: T.labelColor, fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
                  Where to post
                </label>
                <select
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  style={{
                    width: '100%', background: T.selectBg, border: `1px solid ${T.selectBorder}`,
                    borderRadius: '8px', color: T.inputColor, fontSize: '14px',
                    padding: '8px 12px', outline: 'none', cursor: 'pointer', boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = T.inputFocus}
                  onBlur={e => e.target.style.borderColor = T.selectBlur}
                >
                  {destinationOptions.map(opt => (
                    <option key={opt.value} value={opt.value} style={{ background: T.optionBg, color: T.optionColor }}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags input */}
              <div>
                <label style={{ color: T.labelColor, fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
                  Tags <span style={{ color: T.disabledColor, fontWeight: 400 }}>(comma-separated)</span>
                </label>
                <input
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={addTag}
                  placeholder="e.g. locomotion, ROS2, manipulation"
                  style={{
                    width: '100%', background: T.inputBg, border: `1px solid ${T.inputBorder}`,
                    borderRadius: '8px', color: T.inputColor, fontSize: '14px',
                    padding: '8px 12px', outline: 'none', fontFamily: 'inherit',
                    boxSizing: 'border-box', transition: 'border-color 0.15s',
                  }}
                  onFocus={e => e.target.style.borderColor = T.inputFocus}
                  onBlur={e => { addTag(); e.target.style.borderColor = T.inputBlur }}
                />
                {tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                    {tags.map(tag => (
                      <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: T.tagBg, border: `1px solid ${T.tagBorder}`, borderRadius: '9999px', color: T.tagColor, fontSize: '12px', padding: '3px 10px' }}>
                        #{tag}
                        <button
                          onClick={() => removeTag(tag)}
                          style={{ background: 'none', border: 'none', color: T.disabledColor, cursor: 'pointer', fontSize: '11px', padding: '0 0 0 2px', lineHeight: 1 }}
                          onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                          onMouseLeave={e => e.currentTarget.style.color = T.disabledColor}
                          aria-label={`Remove tag ${tag}`}
                        >✕</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px 16px', borderTop: `1px solid ${T.footerBorder}` }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input ref={photoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
                <button
                  onClick={() => photoRef.current?.click()}
                  title="Attach photo"
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', background: T.btnBg, border: `1px solid ${T.btnBorder}`, borderRadius: '8px', color: T.btnColor, fontSize: '13px', padding: '7px 12px', cursor: 'pointer', transition: 'background 0.15s, color 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = L ? 'rgba(14,100,200,0.1)' : 'rgba(6,182,212,0.1)'; e.currentTarget.style.color = L ? '#1d4ed8' : '#67e8f9' }}
                  onMouseLeave={e => { e.currentTarget.style.background = T.btnBg; e.currentTarget.style.color = T.btnColor }}
                >Photo</button>

                <input ref={videoRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={handleVideoChange} />
                <button
                  onClick={() => videoRef.current?.click()}
                  title="Attach video"
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', background: T.btnBg, border: `1px solid ${T.btnBorder}`, borderRadius: '8px', color: T.btnColor, fontSize: '13px', padding: '7px 12px', cursor: 'pointer', transition: 'background 0.15s, color 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = L ? 'rgba(107,33,168,0.08)' : 'rgba(139,92,246,0.1)'; e.currentTarget.style.color = L ? '#6b21a8' : '#c4b5fd' }}
                  onMouseLeave={e => { e.currentTarget.style.background = T.btnBg; e.currentTarget.style.color = T.btnColor }}
                >Video</button>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!content.trim() || submitting}
                style={{
                  background: content.trim() && !submitting ? 'linear-gradient(135deg, #06b6d4, #2563eb)' : T.disabledBg,
                  border: 'none', borderRadius: '9px',
                  color: content.trim() && !submitting ? '#fff' : T.disabledColor,
                  fontSize: '14px', fontWeight: 600, padding: '8px 22px',
                  cursor: content.trim() && !submitting ? 'pointer' : 'not-allowed',
                  transition: 'opacity 0.15s, transform 0.1s',
                  boxShadow: content.trim() && !submitting ? '0 4px 14px rgba(6,182,212,0.3)' : 'none',
                  minWidth: '80px',
                }}
                onMouseEnter={e => { if (content.trim() && !submitting) e.currentTarget.style.opacity = '0.88' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                onMouseDown={e => { if (content.trim() && !submitting) e.currentTarget.style.transform = 'scale(0.97)' }}
                onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
              >
                {submitting ? 'Posting…' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes composerPulse {
          0%   { transform: scale(1);    opacity: 0.7; }
          60%  { transform: scale(1.75); opacity: 0;   }
          100% { transform: scale(1.75); opacity: 0;   }
        }
      `}</style>
    </>
  )
}
