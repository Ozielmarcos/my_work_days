import type { LoginResponse } from '@/types';

export const login = async (email: string, password: string): Promise<LoginResponse> => {

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3005';
  const response = await fetch(`${apiUrl}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    let errMsg = 'Login failed';
    try {
      const errData = await response.json();
      console.error('Login error response:', errData);
      errMsg = errData.message || errMsg;
    } catch (_) {
      const text = await response.text();
      console.error('Login error response (non-JSON):', text);
      errMsg = text || errMsg;
    }
    throw new Error(errMsg);
  }

  const data = (await response.json()) as LoginResponse;
  return data;
};
