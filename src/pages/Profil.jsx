import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, Shield, Lock, EyeOff, Trash2, 
  ChevronRight, CheckCircle, Bell, History 
} from 'lucide-react';

const Profil = () => {
  const { user, logout } = useAuth();

  // On simule quelques stats basées sur tes futures fonctionnalités
  const stats = [
    { label: "Signalements", value: "02", color: "bg-blue-500" },
    { label: "Interactions Forum", value: "15", color: "bg-emerald-500" },
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 animate-in fade-in duration-700">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 leading-tight">Profile Sanctuary</h1>
        <p className="text-slate-500 font-medium mt-1">Gérez votre identité et votre confidentialité en toute sécurité.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- COLONNE GAUCHE : INFOS & PARAMÈTRES (8 COL) --- */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* CARTE IDENTITÉ */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-black border-4 border-white shadow-lg">
                  {user?.pseudo?.substring(0, 1).toUpperCase() || "L"}
                </div>
                <div className="absolute bottom-0 right-0 bg-slate-900 p-1.5 rounded-full border-2 border-white text-white">
                  <Shield size={14} />
                </div>
              </div>
              
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-black text-slate-900">{user?.pseudo || "Utilisateur"}</h2>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1 flex items-center justify-center md:justify-start gap-2">
                  <CheckCircle size={14} className="text-emerald-500" /> Membre vérifié depuis 2026
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Pseudo Public</label>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold text-slate-700">
                  {user?.pseudo}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Méthode de contact</label>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold text-slate-700 flex justify-between items-center">
                  Messagerie In-App <ChevronRight size={16} className="text-slate-300" />
                </div>
              </div>
            </div>
          </div>

          {/* CONFIDENTIALITÉ & DISCRÉTION */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
            <h3 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2">
              <Lock className="text-blue-600" size={20} /> Confidentialité & Stealth
            </h3>
            <p className="text-slate-400 text-sm mb-6 font-medium">Contrôlez comment votre activité est perçue par les autres.</p>
            
            <div className="space-y-4">
              <ToggleOption 
                title="Mode Furtif (Flouter mes posts)" 
                desc="Masque votre pseudo sur le forum public pour plus de discrétion."
                defaultActive={true}
              />
              <ToggleOption 
                title="Masquer mon profil des recherches" 
                desc="Seuls les administrateurs pourront trouver votre compte via le code unique."
                defaultActive={false}
              />
            </div>
          </div>

          {/* DANGER ZONE */}
          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="font-black text-slate-900">Contrôle du Compte</h3>
              <p className="text-xs text-slate-500 font-medium">Gérez votre session ou demandez la suppression définitive.</p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <button onClick={logout} className="flex-1 md:flex-none px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all">
                Déconnexion
              </button>
              <button className="flex-1 md:flex-none px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2">
                <Trash2 size={16} /> Supprimer
              </button>
            </div>
          </div>
        </div>

        {/* --- COLONNE DROITE : STATS & RÉSUMÉ (4 COL) --- */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* CARD STATS RÉSUMÉ */}
          <div className="bg-emerald-500 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-100 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-4xl font-black">12</p>
              <p className="text-xs font-black uppercase tracking-widest opacity-80 mt-1">Ressources Consultées</p>
              <p className="text-[10px] font-medium mt-6 opacity-70 leading-relaxed">
                Votre chemin vers la reconstruction est privé et protégé par nos protocoles.
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <History size={120} />
            </div>
          </div>

          {/* ACTIVITÉ FORUM RÉCENTE */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-slate-900">Activité Forum</h3>
              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase">Chiffré</span>
            </div>
            
            <div className="space-y-6">
              <ActivityItem 
                title="Réponse : Conseils Logement"
                time="Il y a 2 jours"
              />
              <ActivityItem 
                title="Post : Témoignage Partagé"
                time="Il y a 1 semaine"
              />
              <button className="w-full text-center text-xs font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors py-2">
                Voir toute l'activité
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- SOUS-COMPOSANTS UTILES ---

const ToggleOption = ({ title, desc, defaultActive }) => (
  <div className="flex justify-between items-center p-5 bg-slate-50/50 rounded-2xl hover:bg-slate-50 transition-colors group">
    <div className="pr-4">
      <p className="font-black text-slate-900 text-sm">{title}</p>
      <p className="text-xs text-slate-400 font-medium mt-1">{desc}</p>
    </div>
    <div className={`w-12 h-6 rounded-full p-1 transition-colors ${defaultActive ? 'bg-emerald-500' : 'bg-slate-200'}`}>
      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${defaultActive ? 'translate-x-6' : 'translate-x-0'}`} />
    </div>
  </div>
);

const ActivityItem = ({ title, time }) => (
  <div className="flex gap-4 items-start relative before:absolute before:left-[5px] before:top-4 before:bottom-0 before:w-[2px] before:bg-slate-50 last:before:hidden">
    <div className="w-[12px] h-[12px] rounded-full bg-blue-500 mt-1 shadow-sm shadow-blue-200 relative z-10" />
    <div>
      <p className="text-xs font-bold text-slate-800 leading-tight">{title}</p>
      <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase">{time}</p>
    </div>
  </div>
);

export default Profil;