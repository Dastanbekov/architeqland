export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const headers = new Headers(options.headers || {});
  
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  // Ensure credentials are sent so cookies (refresh token) are included
  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', 
  };

  let response = await fetch(`${API_URL}${endpoint}`, config);

  // If unauthorized, try to refresh the token once
  if (response.status === 401 && endpoint !== '/api/apps/auth/login' && endpoint !== '/api/apps/auth/refresh') {
    try {
      const refreshResponse = await fetch(`${API_URL}/api/apps/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        setAccessToken(data.access);
        
        // Retry original request
        headers.set('Authorization', `Bearer ${data.access}`);
        config.headers = headers;
        response = await fetch(`${API_URL}${endpoint}`, config);
      } else {
        // Refresh failed, clear token
        setAccessToken(null);
      }
    } catch (e) {
      setAccessToken(null);
    }
  }

  return response;
};
