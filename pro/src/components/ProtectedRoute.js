// src/components/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const [hasServiceAccount, setHasServiceAccount] = useState(null);

  useEffect(() => {
    const checkServiceAccount = async () => {
      if (user) {
        const serviceAccountRef = doc(db, 'users', user.uid); // 'users' コレクションに変更
        const docSnap = await getDoc(serviceAccountRef);

        if (docSnap.exists()) {
          setHasServiceAccount(true);
        } else {
          setHasServiceAccount(false);
        }
      }
    };

    checkServiceAccount();
  }, [user]);

  // ログインしていない場合はログインページへリダイレクト
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // サービスアカウントがない場合は、アカウント作成ページへリダイレクト
  if (hasServiceAccount === false) {
    return <Navigate to="/usermake" replace />;
  }

  // サービスアカウントが存在するか確認中はローディング表示
  if (hasServiceAccount === null) {
    return <p>なうろうでんぐ</p>;
  }

  // サービスアカウントが存在する場合のみ子コンポーネントを表示
  return children;
};

export default ProtectedRoute;
