// hooks/useAdminStats.js
import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/client';

export const useAdminStats = () => {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/admin/stats');
      // Compatible avec les deux formats de réponse
      setStats(res.data.donnees || res.data.data);
    } catch (err) {
      console.error('Erreur stats:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  // Sélecteurs pratiques
  const signalements = stats?.signalements || {};
  const utilisateurs = stats?.utilisateurs || {};
  const forum        = stats?.forum        || {};
  const bienEtre     = stats?.bienEtre     || {};

  return {
    stats,
    loading,
    error,
    refresh: fetchStats,
    // Données directement utilisables dans les composants
    signalements,
    utilisateurs,
    forum,
    bienEtre,
    // Raccourcis
    evolution7j:   signalements.evolution7j  || [],
    evolution4s:   signalements.evolution4s  || [],
    parVille:      signalements.parVille     || [],
    parCategorie:  signalements.parCategorie || [],
    parStatut:     signalements.parStatut    || [],
    tauxResolution: signalements.tauxResolution || 0,
  };
};