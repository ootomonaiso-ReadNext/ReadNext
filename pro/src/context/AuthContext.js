// src/context/AuthContext.js
import React, { useContext, useState, useEffect, createContext } from "react";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Firestore から userName を取得
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUser({
              ...currentUser,
              userName: userDoc.data().userName, // Firestore の userName を user オブジェクトに追加
            });
          } else {
            console.log("User document not found in Firestore");
            setUser(currentUser); // Firestore にデータがない場合も currentUser を設定
          }
        } catch (error) {
          console.error("Error fetching userName from Firestore:", error);
          setUser(currentUser); // エラー発生時も currentUser を設定
        }
      } else {
        setUser(null);
      }
      setLoading(false); // ローディングが終了
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <p>ユーザーデータをロード中</p>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
