import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token) {
        // 1. On restaure l'utilisateur local immédiatement pour éviter les redirections flash
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }

        try {
          // 2. On vérifie la validité du token avec le backend
          const res = await apiClient.get('/auth/me');
          // On s'adapte à ta structure backend (res.data.donnees ou res.data.data)
          const fetchedUser = res.data.donnees?.user || res.data.data?.user;
          
          if (fetchedUser) {
            setUser(fetchedUser);
            localStorage.setItem('user', JSON.stringify(fetchedUser));
          }
        } catch (error) {
          console.error("Session expirée ou invalide");
          logout(); // Nettoie tout si le token est mort
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData, token) => {
    // On sauvegarde les DEUX dans le localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    // Optionnel : forcer une redirection vers la page de login
    // window.location.href = '/auth'; 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {/* On n'affiche l'app que quand la vérification initiale est finie */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);