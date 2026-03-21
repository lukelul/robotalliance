import { createContext, useContext, useState } from 'react'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [userPhoto, setUserPhoto] = useState(
    () => localStorage.getItem('ra-user-photo') || null
  )

  const updatePhoto = (dataUrl) => {
    setUserPhoto(dataUrl)
    localStorage.setItem('ra-user-photo', dataUrl)
  }

  return (
    <UserContext.Provider value={{ userPhoto, updatePhoto }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
