import { useEffect, useRef } from 'react'
import { companies, people, events } from '../data/mockData'
import { useTheme } from '../context/ThemeContext'

// Which people are active in each company server
const COMPANY_PEOPLE = {
  'boston-dynamics': ['p3', 'p4', 'p10', 'p11', 'p14'],
  'figure-ai':       ['p5', 'p6', 'p8',  'p13', 'p17'],
  'agility-robotics':['p7', 'p9', 'p15'],
}

// Which events are associated with each company
const COMPANY_EVENTS = {
  'boston-dynamics': [2],
  'figure-ai':       [3],
  'agility-robotics': [1, 5],
}

// Build the list of labeled nodes to assign around the glow node
function buildEntities(target) {
  const trunc = (s, n = 22) => s.length > n ? s.slice(0, n - 1) + '…' : s
  const entities = []

  if (target._kind === 'company') {
    // Partner companies
    companies.filter(c => c.id !== target.id).forEach(c => {
      entities.push({ label: c.name, sublabel: 'Company', color: c.color, dot: '#7c3aed' })
    })
    // Related events
    const evIds = COMPANY_EVENTS[target.id] || []
    events.filter(ev => evIds.includes(ev.id)).forEach(ev => {
      entities.push({ label: trunc(ev.title.split('—')[0].trim()), sublabel: ev.type, color: '#f59e0b', dot: '#f59e0b' })
    })
    // Related people
    const pIds = COMPANY_PEOPLE[target.id] || []
    people.filter(p => pIds.includes(p.id)).slice(0, 5).forEach(p => {
      entities.push({ label: p.name, sublabel: p.type, color: '#10b981', dot: '#10b981' })
    })

  } else if (target._kind === 'event') {
    // Host company
    const hostC = companies.find(c => c.name === target.host)
    if (hostC) entities.push({ label: hostC.name, sublabel: 'Host', color: hostC.color, dot: '#7c3aed' })
    // Other events
    events.filter(ev => ev.id !== target.id).slice(0, 3).forEach(ev => {
      entities.push({ label: trunc(ev.title.split('—')[0].trim()), sublabel: ev.type, color: '#f59e0b', dot: '#f59e0b' })
    })
    // People
    people.slice(0, 4).forEach(p => {
      entities.push({ label: p.name, sublabel: p.type, color: '#10b981', dot: '#10b981' })
    })

  } else {
    // person or other
    companies.slice(0, 2).forEach(c => {
      entities.push({ label: c.name, sublabel: 'Company', color: c.color, dot: '#7c3aed' })
    })
    events.slice(0, 2).forEach(ev => {
      entities.push({ label: trunc(ev.title.split('—')[0].trim()), sublabel: ev.type, color: '#f59e0b', dot: '#f59e0b' })
    })
    people.filter(p => p.id !== target.id).slice(0, 4).forEach(p => {
      entities.push({ label: p.name, sublabel: p.type, color: '#10b981', dot: '#10b981' })
    })
  }

  return entities
}

// phase: 'idle' | 'glowing' | 'zooming' | 'zoomed' | 'zoomingOut'
export default function NetworkCanvas({ zoomTarget, onZoomComplete, zoomOutTrigger, onZoomOutComplete }) {
  const canvasRef = useRef(null)
  const { theme } = useTheme()
  const themeRef = useRef(theme)
  useEffect(() => { themeRef.current = theme }, [theme])

  const stateRef = useRef({
    nodes: [],
    animFrame: null,
    zoom: 1,
    zoomX: 0,
    zoomY: 0,
    glowNodeIdx: -1,
    glowIntensity: 0,
    phase: 'idle',
    tilt: 0,
    targetTilt: 0,
    semanticMap: new Map(),   // nodeIdx → { label, sublabel, color, dot, isCenter }
    introZoom: 1.35,          // pulls back to 1 on boot
  })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const state = stateRef.current
    const NODE_COUNT = 110
    const MAX_DIST = 200

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onScroll = () => {
      state.targetTilt = Math.min(window.scrollY * 0.025, 25)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    state.nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2.5 + 1,
      pulse: Math.random() * Math.PI * 2,
    }))

    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      const isLight = themeRef.current === 'light'
      ctx.clearRect(0, 0, w, h)

      const s = state
      const z = s.zoom

      // Smooth 3D tilt toward scroll target
      s.tilt += (s.targetTilt - s.tilt) * 0.06
      canvas.style.transform = `perspective(900px) rotateY(${s.tilt}deg)`

      // Camera-zoom transform
      let gnx = 0, gny = 0, pivotX = 0, pivotY = 0
      const zooming = z !== 1 && s.glowNodeIdx >= 0
      const iz = s.introZoom
      const introZooming = iz > 1.001 && !zooming
      if (zooming) {
        const gn = s.nodes[s.glowNodeIdx]
        gnx = gn.x
        gny = gn.y
        const t = (z - 1) / (8 - 1)
        pivotX = gnx + (w / 2 - gnx) * t
        pivotY = gny + (h / 2 - gny) * t
      }

      const toScreen = (x, y) => {
        if (zooming) return [pivotX + (x - gnx) * z, pivotY + (y - gny) * z]
        if (introZooming) return [w / 2 + (x - w / 2) * iz, h / 2 + (y - h / 2) * iz]
        return [x, y]
      }

      // Label fade-in starts at z=2.5, fully visible at z=5.5
      const labelAlpha = s.semanticMap.size > 0 ? Math.min(1, Math.max(0, (z - 2.5) / 3)) : 0

      // ── Connections ─────────────────────────────────────────────────
      for (let i = 0; i < s.nodes.length; i++) {
        for (let j = i + 1; j < s.nodes.length; j++) {
          const a = s.nodes[i]
          const b = s.nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MAX_DIST) {
            let boost = 1
            if (s.glowNodeIdx >= 0 && s.glowIntensity > 0) {
              const gn = s.nodes[s.glowNodeIdx]
              const near = Math.min(Math.hypot(a.x - gn.x, a.y - gn.y), Math.hypot(b.x - gn.x, b.y - gn.y))
              boost = 1 + s.glowIntensity * 3 * Math.max(0, 1 - near / 200)
            }

            // Highlighted connections between semantic nodes
            const iSem = s.semanticMap.has(i)
            const jSem = s.semanticMap.has(j)
            const iCenter = i === s.glowNodeIdx
            const jCenter = j === s.glowNodeIdx
            const isSemanticEdge = labelAlpha > 0 && ((iSem || iCenter) && (jSem || jCenter))

            const [ax, ay] = toScreen(a.x, a.y)
            const [bx, by] = toScreen(b.x, b.y)

            if (isSemanticEdge) {
              const edgeAlpha = labelAlpha * (1 - dist / MAX_DIST) * (isLight ? 0.9 : 0.7)
              const semI = s.semanticMap.get(i)
              const semJ = s.semanticMap.get(j)
              const col = (iCenter || semI?.isCenter) ? (semJ?.dot || '#00d4ff') : (semI?.dot || '#00d4ff')
              ctx.beginPath()
              ctx.moveTo(ax, ay)
              ctx.lineTo(bx, by)
              ctx.strokeStyle = col.startsWith('#')
                ? `${col}${Math.round(edgeAlpha * 255).toString(16).padStart(2, '0')}`
                : `rgba(0,212,255,${edgeAlpha})`
              ctx.lineWidth = isLight ? 1.8 : 1.4
              ctx.stroke()
            } else {
              const alpha = (1 - dist / MAX_DIST) * (isLight ? 0.55 : 0.22) * boost
              ctx.beginPath()
              ctx.moveTo(ax, ay)
              ctx.lineTo(bx, by)
              ctx.strokeStyle = isLight
                ? `rgba(30, 90, 180, ${Math.min(alpha, 0.85)})`
                : `rgba(14, 165, 233, ${Math.min(alpha, 0.8)})`
              ctx.lineWidth = isLight ? 1.1 : 0.8
              ctx.stroke()
            }
          }
        }
      }

      // ── Nodes + Labels ───────────────────────────────────────────────
      s.nodes.forEach((n, idx) => {
        n.x += n.vx
        n.y += n.vy
        n.pulse += 0.018
        if (n.x < 0 || n.x > w) n.vx *= -1
        if (n.y < 0 || n.y > h) n.vy *= -1

        const isGlow = idx === s.glowNodeIdx
        const sem = s.semanticMap.get(idx)
        const gi = isGlow ? s.glowIntensity : 0
        const basePulse = 0.5 + 0.3 * Math.sin(n.pulse)
        const alpha = basePulse + gi * 0.5
        const r = n.r + gi * 6

        const [sx, sy] = toScreen(n.x, n.y)

        // Node dot — tint semantic nodes with their type color when zoomed
        const nodeBaseColor = isLight ? [3, 105, 161] : [0, 212, 255]
        const nodeGlowColor = isLight ? [3, 105, 161] : [0, 255, 255]
        ctx.beginPath()
        ctx.arc(sx, sy, r + (sem && labelAlpha > 0 ? 1.5 : 0), 0, Math.PI * 2)
        if (sem && !sem.isCenter && labelAlpha > 0) {
          // Parse hex color for semantic node
          const hex = sem.dot || '#00d4ff'
          const rb = parseInt(hex.slice(1, 3), 16)
          const gb = parseInt(hex.slice(3, 5), 16)
          const bb = parseInt(hex.slice(5, 7), 16)
          const a2 = alpha * (0.5 + labelAlpha * 0.5)
          ctx.fillStyle = `rgba(${rb},${gb},${bb},${Math.min(a2, 1)})`
        } else {
          const [nr, ng, nb] = isGlow ? nodeGlowColor : nodeBaseColor
          ctx.fillStyle = `rgba(${nr}, ${ng}, ${nb}, ${Math.min(isLight ? alpha * 1.4 : alpha, 1)})`
        }
        ctx.fill()

        // Glow halo
        const haloR = isGlow ? r * 6 + gi * 30 : r * 3
        const grad = ctx.createRadialGradient(sx, sy, r * 0.5, sx, sy, haloR)
        const [hr, hg, hb] = nodeBaseColor
        if (isGlow) {
          const [gr, gg, gb2] = nodeGlowColor
          grad.addColorStop(0, `rgba(${gr}, ${gg}, ${gb2}, ${0.6 * gi})`)
          grad.addColorStop(0.3, `rgba(${hr}, ${hg}, ${hb}, ${0.3 * gi})`)
          grad.addColorStop(1, `rgba(${hr}, ${hg}, ${hb}, 0)`)
        } else if (sem && labelAlpha > 0) {
          const hex = sem.dot || '#00d4ff'
          const rb = parseInt(hex.slice(1, 3), 16)
          const gb = parseInt(hex.slice(3, 5), 16)
          const bb = parseInt(hex.slice(5, 7), 16)
          grad.addColorStop(0, `rgba(${rb},${gb},${bb},${0.3 * labelAlpha})`)
          grad.addColorStop(1, `rgba(${rb},${gb},${bb},0)`)
        } else {
          grad.addColorStop(0, `rgba(${hr}, ${hg}, ${hb}, ${alpha * (isLight ? 0.4 : 0.25)})`)
          grad.addColorStop(1, `rgba(${hr}, ${hg}, ${hb}, 0)`)
        }
        ctx.beginPath()
        ctx.arc(sx, sy, haloR, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        // Expanding ring on glow node
        if (isGlow && gi > 0.3) {
          const [gr, gg, gb2] = nodeGlowColor
          const ringR = r * 3 + gi * 50 * ((Date.now() % 1200) / 1200)
          ctx.beginPath()
          ctx.arc(sx, sy, ringR, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(${gr}, ${gg}, ${gb2}, ${gi * 0.4 * (1 - (Date.now() % 1200) / 1200)})`
          ctx.lineWidth = 2
          ctx.stroke()
        }

        // ── Semantic label ────────────────────────────────────────────
        if (sem && labelAlpha > 0) {
          ctx.save()
          ctx.globalAlpha = labelAlpha
          ctx.textAlign = 'center'
          ctx.shadowColor = isLight ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.95)'
          ctx.shadowBlur = isLight ? 6 : 8

          if (sem.isCenter) {
            ctx.font = 'bold 14px "Inter", system-ui, sans-serif'
            ctx.fillStyle = sem.color || (isLight ? '#0369a1' : '#00d4ff')
            ctx.textBaseline = 'bottom'
            ctx.fillText(sem.label, sx, sy - r - 10)
            if (sem.sublabel) {
              ctx.font = '10px "Inter", system-ui, sans-serif'
              ctx.fillStyle = isLight ? 'rgba(30,64,175,0.7)' : 'rgba(147,197,253,0.75)'
              ctx.textBaseline = 'bottom'
              ctx.fillText(sem.sublabel, sx, sy - r - 10 + 12)
            }
          } else {
            ctx.font = '11px "Inter", system-ui, sans-serif'
            ctx.fillStyle = isLight ? '#1e3a5f' : '#e2e8f0'
            ctx.textBaseline = 'top'
            ctx.fillText(sem.label, sx, sy + r + 5)
            if (sem.sublabel) {
              ctx.font = '9px "Inter", system-ui, sans-serif'
              ctx.fillStyle = sem.color || (isLight ? 'rgba(30,64,175,0.7)' : 'rgba(147,197,253,0.6)')
              ctx.fillText(sem.sublabel, sx, sy + r + 18)
            }
          }
          ctx.restore()
        }
      })

      state.animFrame = requestAnimationFrame(draw)
    }

    draw()

    // Intro: zoom out from 1.35x to 1x over 1100ms with ease-out
    const introStart = performance.now()
    const introDuration = 1100
    const introAnimate = (ts) => {
      const t = Math.min((ts - introStart) / introDuration, 1)
      const eased = 1 - Math.pow(1 - t, 3)  // cubic ease-out
      state.introZoom = 1.35 - 0.35 * eased
      if (t < 1) requestAnimationFrame(introAnimate)
    }
    requestAnimationFrame(introAnimate)

    return () => {
      cancelAnimationFrame(state.animFrame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    if (!zoomTarget) return
    const state = stateRef.current
    const canvas = canvasRef.current

    // Pick a random visible node as the glow target
    const margin = 120
    const visibleNodes = state.nodes
      .map((n, i) => ({ i, n }))
      .filter(({ n }) =>
        n.x > margin && n.x < canvas.width - margin &&
        n.y > margin && n.y < canvas.height - margin
      )
    const pick = visibleNodes[Math.floor(Math.random() * visibleNodes.length)] || { i: 0 }
    state.glowNodeIdx = pick.i
    const gn = state.nodes[pick.i]
    state.zoomX = gn.x
    state.zoomY = gn.y
    state.phase = 'glowing'

    // ── Build semantic network around the glow node ──────────────────
    state.semanticMap = new Map()
    state.semanticMap.set(state.glowNodeIdx, {
      label: zoomTarget.name || zoomTarget.title || '',
      sublabel: zoomTarget.category || zoomTarget.type || '',
      color: zoomTarget.color || '#00d4ff',
      dot: zoomTarget.color || '#00d4ff',
      isCenter: true,
    })

    const entities = buildEntities(zoomTarget)
    const nearby = state.nodes
      .map((n, i) => ({ i, dist: Math.hypot(n.x - gn.x, n.y - gn.y) }))
      .filter(({ i }) => i !== state.glowNodeIdx)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, Math.min(entities.length, 10))

    nearby.forEach(({ i }, ei) => {
      if (ei < entities.length) state.semanticMap.set(i, entities[ei])
    })

    // Phase 1: glow up (400ms)
    const glowStart = performance.now()
    const glowDuration = 400
    const glowUp = (ts) => {
      const t = Math.min((ts - glowStart) / glowDuration, 1)
      state.glowIntensity = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      if (t < 1) {
        requestAnimationFrame(glowUp)
      } else {
        state.glowIntensity = 1
        startZoom()
      }
    }
    requestAnimationFrame(glowUp)

    // Phase 2: zoom in + fade out
    const startZoom = () => {
      state.phase = 'zooming'
      const zStart = performance.now()
      const zDuration = 550
      const zoomAnimate = (ts) => {
        const t = Math.min((ts - zStart) / zDuration, 1)
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
        state.zoom = 1 + (8 - 1) * eased
        if (t < 1) {
          requestAnimationFrame(zoomAnimate)
        } else {
          state.zoom = 8
          startFade()
        }
      }
      requestAnimationFrame(zoomAnimate)

      const startFade = () => {
        const fStart = performance.now()
        const fDuration = 220
        const fadeAnimate = (ts) => {
          const t = Math.min((ts - fStart) / fDuration, 1)
          canvas.style.opacity = String(1 - t)
          if (t < 1) {
            requestAnimationFrame(fadeAnimate)
          } else {
            canvas.style.opacity = '0'
            state.glowIntensity = 0
            state.phase = 'zoomed'
            if (onZoomComplete) onZoomComplete()
            requestAnimationFrame(() => { canvas.style.opacity = '1' })
          }
        }
        requestAnimationFrame(fadeAnimate)
      }
    }
  }, [zoomTarget])

  useEffect(() => {
    if (!zoomOutTrigger) return
    const state = stateRef.current
    if (state.zoom <= 1) {
      if (onZoomOutComplete) onZoomOutComplete()
      return
    }
    state.phase = 'zoomingOut'
    const startZoom = state.zoom
    const zStart = performance.now()
    const zDuration = 600
    const zoomOutAnimate = (ts) => {
      const t = Math.min((ts - zStart) / zDuration, 1)
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      state.zoom = startZoom + (1 - startZoom) * eased
      if (t < 1) {
        requestAnimationFrame(zoomOutAnimate)
      } else {
        state.zoom = 1
        state.glowNodeIdx = -1
        state.phase = 'idle'
        state.semanticMap = new Map()
        if (onZoomOutComplete) onZoomOutComplete()
      }
    }
    requestAnimationFrame(zoomOutAnimate)
  }, [zoomOutTrigger])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none canvas-boot"
      style={{ zIndex: 0, transformOrigin: 'center center' }}
    />
  )
}
