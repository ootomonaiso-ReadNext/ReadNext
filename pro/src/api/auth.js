const API_BASE_URL = 'http://localhost:8080/api';

export const googleLogin = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
};