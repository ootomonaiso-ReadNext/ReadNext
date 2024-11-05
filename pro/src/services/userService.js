// src/services/userService.js
import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

/**
 * ユーザーの基本情報と設定をFirestoreに保存
 * @param {string} uid - Firebase AuthenticationのユーザーUID
 * @param {string} userId - 一意のユーザーID
 * @param {string} userName - ユーザー名
 * @param {object} settings - ユーザーの設定情報
 */
export const createUserDocument = async (uid, userId, userName, settings = {}) => {
  // Firestoreの `users` コレクションにユーザー情報を保存
  await setDoc(doc(db, "users", uid), {
    userId,
    userName,
    settings,
    createdAt: new Date()
  });
};
