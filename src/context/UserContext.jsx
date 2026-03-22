import { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc, collection, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../firebase'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(undefined) // undefined = loading
  const [profile, setProfile] = useState(null)
  const [allUsers, setAllUsers] = useState([])
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showProfileSetup, setShowProfileSetup] = useState(false)

  // Listen to auth state
  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user)
      if (user) {
        const ref = doc(db, 'users', user.uid)
        const snap = await getDoc(ref)
        if (snap.exists()) {
          setProfile({ id: user.uid, ...snap.data() })
        } else {
          // New user — needs profile setup
          setShowProfileSetup(true)
        }
      } else {
        setProfile(null)
      }
    })
  }, [])

  // Live-sync all user profiles from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      setAllUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [])

  const saveProfile = async (data) => {
    if (!firebaseUser) return
    const initials = data.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    const colors = ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ec4899', '#f97316', '#38bdf8', '#a78bfa']
    const color = colors[Math.floor(Math.random() * colors.length)]
    const profileData = {
      name: data.name,
      title: data.title || '',
      type: data.type || 'Enthusiast',
      school: data.school || '',
      bio: data.bio || '',
      linkedin: data.linkedin || '',
      avatar: initials,
      color: data.color || color,
      photo: firebaseUser.photoURL || null,
      followers: 0,
      online: true,
      createdAt: Date.now(),
    }
    await setDoc(doc(db, 'users', firebaseUser.uid), profileData)
    setProfile({ id: firebaseUser.uid, ...profileData })
    setShowProfileSetup(false)
  }

  const updatePhoto = async (dataUrl) => {
    if (!firebaseUser) return
    await setDoc(doc(db, 'users', firebaseUser.uid), { photo: dataUrl }, { merge: true })
    setProfile(p => ({ ...p, photo: dataUrl }))
  }

  const logout = () => signOut(auth)

  const isGuest = !firebaseUser
  const isLoading = firebaseUser === undefined

  return (
    <UserContext.Provider value={{
      firebaseUser,
      profile,
      allUsers,
      isGuest,
      isLoading,
      showAuthModal,
      setShowAuthModal,
      showProfileSetup,
      saveProfile,
      updatePhoto,
      logout,
      // legacy compat
      userPhoto: profile?.photo || null,
    }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
