import { createContext } from "react"
import type { User } from "firebase/auth"

type AuthContextType = {
  user: User | null,
  setUser: (user: User | null) => void
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)
