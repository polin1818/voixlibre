import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // 🔥 IMPORTANT pour cookies (refreshToken)
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─────────────────────────────
// 🔐 REQUEST INTERCEPTOR
// ─────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('accessToken') ||
      localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─────────────────────────────
// 🔄 RESPONSE INTERCEPTOR (AUTO REFRESH)
// ─────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🔥 Si token expiré → refresh automatique
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { withCredentials: true }
        );

        const newToken = res.data.data.accessToken;

        localStorage.setItem('accessToken', newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return apiClient(originalRequest);
      } catch (err) {
        // 🔴 refresh échoué → logout
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;