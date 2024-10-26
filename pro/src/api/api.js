import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

const api = axios.create({
  baseURL: API_URL,
});

// Googleログインリクエストを送信する関数
export const googleLogin = async (token) => {
  try {
    const response = await api.post('google', {}, {
      headers: {
        'Authorization': `Bearer ${token}`, // トークンはAuthorizationヘッダーで送信
      }
    });
    return response.data; // 成功時のレスポンスデータを返す
  } catch (error) {
    console.error('Googleログインに失敗しました', error);
    throw error; // エラーを呼び出し元に再スロー
  }
};

// ユーザー登録リクエストを送信する関数
export const register = async (username, email, password) => {
  try {
    const response = await api.post('register', {
      username,
      email,
      password,
    });
    return response.data; // 成功時のレスポンスデータを返す
  } catch (error) {
    console.error('ユーザー登録に失敗しました', error);
    throw error; // エラーを呼び出し元に再スロー
  }
};
