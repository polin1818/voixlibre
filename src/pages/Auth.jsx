import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import { User, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ pseudo: '', motdepasse: '' });
  const [erreur, setErreur] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login: saveAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErreur('');
    
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    
    try {
      const res = await apiClient.post(endpoint, formData);
      
      // --- CORRECTION DE L'ERREUR DE DESTRUCTURATION ---
      // On vérifie dynamiquement où se trouvent les données (donnees ou data)
      const responseData = res.data.donnees || res.data.data;

      if (!responseData) {
        throw new Error("Format de réponse invalide");
      }

      const { user, accessToken } = responseData;

      // 1. Mise à jour du contexte global
      saveAuth(user, accessToken);

      // 2. LOGIQUE DE REDIRECTION PAR RÔLE
      if (user && user.role === 'admin') {
        console.log("Bienvenue Admin, redirection...");
        navigate('/admin');
      } else {
        console.log("Bienvenue Membre, redirection...");
        navigate('/');
      }

    } catch (err) {
      console.error("Erreur Auth détaillée:", err);
      // Affiche le message du serveur ou un message générique
      setErreur(err.response?.data?.message || "Identifiants incorrects ou problème de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-slate-50/50">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
            {isLogin ? "Bon retour parmi nous" : "Rejoindre VoixLibre"}
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            {isLogin 
              ? "Connectez-vous pour gérer vos rapports et la communauté." 
              : "Créez un compte anonyme en quelques secondes."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Alerte d'erreur avec animation de secousse */}
          {erreur && (
            <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100">
              <AlertCircle size={18} />
              <span>{erreur}</span>
            </div>
          )}
          
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Pseudo</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                required 
                placeholder="Votre pseudo"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-[1.2rem] outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-700 font-medium"
                onChange={(e) => setFormData({...formData, pseudo: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="password" 
                required 
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-[1.2rem] outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-700 font-medium"
                onChange={(e) => setFormData({...formData, motdepasse: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white py-4 rounded-[1.2rem] font-bold shadow-lg shadow-blue-200 hover:bg-blue-800 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span>{isLogin ? "Démarrer la session" : "Finaliser l'inscription"}</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-slate-400 text-sm font-medium mb-2">
            {isLogin ? "Pas encore de compte ?" : "Vous avez déjà un compte ?"}
          </p>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 font-bold hover:underline underline-offset-4"
          >
            {isLogin ? "Créer un profil anonyme" : "Se connecter maintenant"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;