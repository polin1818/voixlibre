import axios from 'axios';

// On récupère l'URL de base et on s'assure qu'elle ne finit pas par un slash
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─────────────────────────────
// 🔐 REQUEST INTERCEPTOR
// ─────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─────────────────────────────
// 🔄 RESPONSE INTERCEPTOR
// ─────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si erreur 401 et qu'on n'a pas déjà essayé de rafraîchir
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // IMPORTANT: Appeler directement /auth/refresh sans la base /api
        // Si ton backend attend /api/auth/refresh, alors garde API_BASE_URL
        const res = await axios.get(`${API_BASE_URL}/auth/refresh`, {
          withCredentials: true,
        });

        const newToken = res.data.data.accessToken;
        localStorage.setItem('accessToken', newToken);

        // Mettre à jour l'autorisation de la requête originale et relancer
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (err) {
        // Refresh échoué : nettoyer et rediriger
        localStorage.removeItem('accessToken');
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;