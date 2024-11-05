// src/context/AuthContext.js
import React, { useContext, useState, useEffect, createContext } from "react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
