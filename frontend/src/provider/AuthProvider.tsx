import { useState, useEffect } from "react"
import type { ReactNode } from "react"
import { auth } from "../constants/firebase"
import { onAuthStateChanged, type User } from "firebase/auth"
import { AuthContext } from "../context/AuthContext"

type Props = {
  children?: ReactNode
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const handleUpdateUser = (user: User | null) => {
    setUser(user)
  }

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <AuthContext.Provider value={{ user, setUser: handleUpdateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
