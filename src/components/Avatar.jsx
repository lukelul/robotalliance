import { useState } from 'react'

// Illustrated portrait fallback — unique per avatar seed
const dicebear = (seed) =>
  `https://api.dicebear.com/9.x/micah/png?seed=${encodeURIComponent(seed)}&size=150&radius=50&backgroundColor=0369a1,0c4a6e,1e3a5f,312e81,4a044e`

/**
 * Avatar — layered rendering:
 *   1. `photo` prop (real photo / logo URL) — if provided, try first
 *   2. DiceBear illustrated portrait — auto-generated from `avatar` seed (people only)
 *   3. Colored initials div — final fallback
 *
 * Pass `useDicebear={false}` for company logos so they fall back to colored initials.
 */
export default function Avatar({
  photo,
  avatar,
  color,
  size = 32,
  rounded = '9999px',
  style: extra = {},
  className = '',
  useDicebear = true,
}) {
  const [photoFailed, setPhotoFailed] = useState(false)
  const [dicebearFailed, setDicebearFailed] = useState(false)
  const base = { width: size, height: size, borderRadius: rounded, flexShrink: 0, ...extra }

  if (photo && !photoFailed) {
    return (
      <img
        src={photo}
        alt={avatar}
        className={`object-cover ${className}`}
        style={base}
        onError={() => setPhotoFailed(true)}
      />
    )
  }

  if (useDicebear && !dicebearFailed) {
    return (
      <img
        src={dicebear(avatar)}
        alt={avatar}
        className={`object-cover ${className}`}
        style={base}
        onError={() => setDicebearFailed(true)}
      />
    )
  }

  return (
    <div
      className={`flex items-center justify-center text-xs font-bold text-white ${className}`}
      style={{ ...base, background: color }}
    >
      {avatar}
    </div>
  )
}
