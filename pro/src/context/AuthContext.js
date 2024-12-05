import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged, reload } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Firebase認証ユーザー
  const [userData, setUserData] = useState(null); // Firestoreのデータ
  const [isEmailVerified, setIsEmailVerified] = useState(false); // メール検証状態
  const [loading, setLoading] = useState(true); // ローディング状態

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Firebase認証オブジェクトをセット
        setIsEmailVerified(currentUser.emailVerified);

        // Firestoreから追加データを取得
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data()); // Firestoreのデータをセット
          } else {
            setUserData(null);
          }
        } catch (error) {
          console.error("Firestoreからのデータ取得エラー:", error);
          setUserData(null);
        }
      } else {
        setUser(null);
        setUserData(null);
        setIsEmailVerified(false);
      }
      setLoading(false); // ローディング終了
    });

    return () => unsubscribe();
  }, []);

  const refreshUser = async () => {
    if (auth.currentUser) {
      await reload(auth.currentUser);
      setUser(auth.currentUser); // Firebaseユーザーをリロード
      setIsEmailVerified(auth.currentUser.emailVerified);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, setUser, isEmailVerified, refreshUser }}>
      {!loading ? children : <p>ユーザーデータをロード中...</p>}
    </AuthContext.Provider>
  );
};
