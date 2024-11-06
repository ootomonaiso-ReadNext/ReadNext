import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { auth } from "../constants/firebase"
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth"

export const useAuth = () => {
  const { user, setUser } = useContext(AuthContext)

  const signUpWithEmailAndPassword = async (email: string, password: string) => {
    return await createUserWithEmailAndPassword(auth, email, password)
  }
  
  const loginWithEmailAndPassword = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password)
  }
  
  const loginWithGoogle = async () => {
    return await signInWithPopup(auth, new GoogleAuthProvider())
  }
  
  const logout = async () => {
    return await signOut(auth)
  }
  
  return {
    user,
    setUser,
    signUpWithEmailAndPassword,
    loginWithEmailAndPassword,
    loginWithGoogle,
    logout,
  }
}