import React, { useEffect, useState, createContext } from 'react'

import { getUserData, logoutUser } from '../../helpers/api'

export const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    getUserData()
      .then(data => {
        if (data) {
          setUser(data)
        }
      })
  }, [])

  async function logout() {
    await logoutUser()
    setUser(null)
  }

  return (
    <UserContext.Provider value={{ user, logout }}>
      {children}
    </UserContext.Provider>
  )
}