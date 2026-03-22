import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import TopBar from './components/TopBar'
import NetworkCanvas from './components/NetworkCanvas'
import PostComposer from './components/PostComposer'
import HomePage from './pages/HomePage'
import ServerPage from './pages/ServerPage'
import ProfilePage from './pages/ProfilePage'
import EventPage from './pages/EventPage'
import { PostsProvider } from './context/PostsContext'
import { ThemeProvider } from './context/ThemeContext'
import { UserProvider, useUser } from './context/UserContext'
import SettingsPage from './pages/SettingsPage'
import LeadershipPage from './pages/LeadershipPage'
import LandingPage from './pages/LandingPage'
import AuthModal from './components/AuthModal'
import ProfileSetupModal from './components/ProfileSetupModal'

function AuthOverlays() {
  const { showAuthModal, showProfileSetup } = useUser()
  return (
    <>
      {showAuthModal && <AuthModal />}
      {showProfileSetup && <ProfileSetupModal />}
    </>
  )
}

function AppInner() {
  const [zoomTarget, setZoomTarget] = useState(null)
  const [zoomOutTrigger, setZoomOutTrigger] = useState(null)
  const [contentOpacity, setContentOpacity] = useState(0)
  const [instantHide, setInstantHide] = useState(false)
  const pendingNav = useRef(null)
  const isZoomedIn = useRef(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Initial boot: reveal content after canvas has started rendering
  useEffect(() => {
    const t = setTimeout(() => setContentOpacity(1), 280)
    return () => clearTimeout(t)
  }, [])

  // When navigating back to home while zoomed in, instantly hide content before paint.
  // Both state updates batch together in the same render, so the browser never sees
  // the home page at opacity 1 — and with transition:'none', there's no fade either.
  useLayoutEffect(() => {
    if (location.pathname === '/' && isZoomedIn.current) {
      setInstantHide(true)    // disables CSS transition
      setContentOpacity(0)    // hides without animating
      setZoomOutTrigger({ _ts: Date.now() })
    }
  }, [location.pathname])

  const triggerZoom = (item, destination) => {
    pendingNav.current = destination
    setContentOpacity(0)
    setTimeout(() => {
      setZoomTarget({ ...item, _ts: Date.now() })
    }, 320)
  }

  const handleSearch = (item) => {
    const path = item._kind === 'company' ? `/server/${item.id}` : `/profile/${item.id}`
    triggerZoom(item, { type: 'internal', path })
  }

  const handleHomeNavigate = (item) => {
    if (item._kind === 'company') {
      triggerZoom(item, { type: 'internal', path: `/server/${item.id}` })
    } else if (item._kind === 'event') {
      triggerZoom(item, { type: 'internal', path: `/event/${item.id}` })
    }
  }

  const handleZoomComplete = () => {
    const nav = pendingNav.current
    pendingNav.current = null
    setZoomTarget(null)

    if (nav?.type === 'internal') {
      navigate(nav.path)
      isZoomedIn.current = true
      setTimeout(() => setContentOpacity(1), 80)
    } else if (nav?.type === 'external') {
      window.open(nav.url, '_blank', 'noopener,noreferrer')
      // Still on same page — zoom back out
      setTimeout(() => setZoomOutTrigger({ _ts: Date.now() }), 100)
    }
  }

  const handleZoomOutComplete = () => {
    isZoomedIn.current = false
    setZoomOutTrigger(null)
    setTimeout(() => {
      setInstantHide(false)   // re-enable CSS transition before fading in
      setContentOpacity(1)
    }, 80)
  }

  return (
    <div className="relative min-h-screen" style={{ background: 'var(--bg)' }}>
      <NetworkCanvas zoomTarget={zoomTarget} onZoomComplete={handleZoomComplete} zoomOutTrigger={zoomOutTrigger} onZoomOutComplete={handleZoomOutComplete} />

      {/* Radial glow overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(14,165,233,0.07) 0%, transparent 70%)',
          zIndex: 1,
        }}
      />

      <div
        className="relative content-boot"
        style={{
          zIndex: 2,
          opacity: contentOpacity,
          transition: instantHide ? 'none' : 'opacity 0.45s ease',
          pointerEvents: contentOpacity < 0.5 ? 'none' : 'auto',
        }}
      >
        {location.pathname !== '/welcome' && <TopBar onSearch={handleSearch} />}
        <Routes>
          <Route path="/" element={<HomePage onNavigate={handleHomeNavigate} />} />
          <Route path="/server/:id" element={<ServerPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/event/:id" element={<EventPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/leadership" element={<LeadershipPage />} />
          <Route path="/welcome" element={<LandingPage />} />
        </Routes>
      </div>
      {location.pathname !== '/welcome' && <PostComposer />}
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <PostsProvider>
          <AppInner />
          <AuthOverlays />
        </PostsProvider>
      </UserProvider>
    </ThemeProvider>
  )
}
