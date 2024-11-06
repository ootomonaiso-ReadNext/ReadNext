// src/components/ProtectedRoute.js
import { type ReactNode, useCallback, useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { useAuth } from "../../hooks/useAuth"
import { db } from "../../constants/firebase"

type Props = {
  children?: ReactNode
}

const ProtectedRoute = ({ children }: Props) => {
  const { user } = useAuth()
  const [hasServiceAccount, setHasServiceAccount] = useState<boolean>(false)

  const checkServiceAccount = useCallback(async () => {
    if (user) {
      const serviceAccountRef = doc(db, "users", user.uid) // "users" コレクションに変更
      const docSnap = await getDoc(serviceAccountRef)

      if (docSnap.exists()) {
        setHasServiceAccount(true)
      } else {
        setHasServiceAccount(false)
      }
    }
  }, [user])

  useEffect(() => {
    checkServiceAccount()
  }, [checkServiceAccount])

  // ログインしていない場合はログインページへリダイレクト
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // サービスアカウントがない場合は、アカウント作成ページへリダイレクト
  if (hasServiceAccount === false) {
    return <Navigate to="/usermake" replace />
  }

  // サービスアカウントが存在するか確認中はローディング表示
  if (hasServiceAccount === null) {
    return <p>なうろうでんぐ</p>
  }

  // サービスアカウントが存在する場合のみ子コンポーネントを表示
  return children
}

export default ProtectedRoute
