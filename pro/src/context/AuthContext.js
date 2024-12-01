// src/context/AuthContext.js
import React, { useContext, useState, useEffect, createContext } from "react";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged, reload } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

// カスタムフックでコンテキストを簡単に利用できるようにする
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // ユーザーオブジェクト
  const [isEmailVerified, setIsEmailVerified] = useState(false); // メール検証状態
  const [loading, setLoading] = useState(true); // ローディング状態

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Firestore からユーザー情報を取得
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              ...currentUser,
              userName: userData.userName, // Firestore の userName を追加
            });
          } else {
            console.log("Firestore にユーザードキュメントが存在しません");
            setUser(currentUser);
          }

          // メール検証状態を設定
          setIsEmailVerified(currentUser.emailVerified);
        } catch (error) {
          console.error("Firestore からのユーザー情報取得中にエラーが発生しました:", error);
          setUser(currentUser);
          setIsEmailVerified(currentUser.emailVerified);
        }
      } else {
        setUser(null);
        setIsEmailVerified(false);
      }
      setLoading(false); // ローディング終了
    });

    return () => unsubscribe();
  }, []);

  // ユーザー情報をリフレッシュする関数
  const refreshUser = async () => {
    if (auth.currentUser) {
      await reload(auth.currentUser);
      setIsEmailVerified(auth.currentUser.emailVerified);
      setUser({ ...auth.currentUser, userName: user?.userName || "" });
    }
  };

  const value = {
    user,
    setUser,
    isEmailVerified,
    refreshUser, // メール検証後にユーザー情報をリフレッシュするための関数
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <p>ユーザーデータをロード中...</p>}
    </AuthContext.Provider>
  );
};
