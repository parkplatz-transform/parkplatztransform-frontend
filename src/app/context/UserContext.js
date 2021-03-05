import React, { useEffect, useState, createContext } from 'react'

import { getUserData } from '../../helpers/api'

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

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  )
}