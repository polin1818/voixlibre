import React, { useState } from 'react';
import apiClient from '../api/client';
import { 
  Search, ShieldCheck, Clock, MapPin, 
  FileText, Image as ImageIcon, Video, 
  AlertCircle, ChevronRight, Lock
} from 'lucide-react';

const SuiviDossier = () => {
  const [code, setCode] = useState('');
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!code) return;

    setLoading(true);
    setErreur('');
    try {
      const res = await apiClient.get(`/signalements/suivi/${code}`);
      setDossier(res.data.data.signalement);
    } catch (err) {
      setErreur(err.response?.data?.message || "Code de suivi introuvable");
      setDossier(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatutBadge = (statut) => {
    const styles = {
      nouveau: "bg-blue-100 text-blue-700",
      en_cours: "bg-amber-100 text-amber-700",
      traite: "bg-emerald-100 text-emerald-700",
      classe: "bg-slate-100 text-slate-700"
    };
    return styles[statut] || styles.nouveau;
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      {/* HEADER STYLE SANCTUARY */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-black text-slate-900 mb-2">Espace Suivi Anonyme</h1>
        <p className="text-slate-500 font-medium">Consultez l'avancement de votre dossier en toute confidentialité.</p>
      </header>

      {/* BARRE DE RECHERCHE */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 mb-10">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Entrez votre code (ex: VL-2026-XXXX)"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 outline-none font-mono font-bold uppercase transition-all"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
          </div>
          <button 
            type="submit"
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            {loading ? "Recherche..." : "Vérifier"}
          </button>
        </form>
        {erreur && <p className="text-red-500 text-xs font-bold mt-3 ml-4">{erreur}</p>}
      </div>

      {dossier && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* COLONNE GAUCHE : INFOS PRINCIPALES */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatutBadge(dossier.statut)}`}>
                    {dossier.statut.replace('_', ' ')}
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-2">{dossier.categorie.replace('_', ' ')}</h2>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Code Dossier</p>
                  <p className="font-mono font-bold text-blue-600">{dossier.codesuivi}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-4 rounded-2xl font-medium">
                  <MapPin size={18} className="text-blue-500" />
                  {dossier.localisation.adresse}, {dossier.localisation.ville}
                </div>
                <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-4 rounded-2xl font-medium">
                  <Clock size={18} className="text-blue-500" />
                  Signalé le : {new Date(dossier.datecreation).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>

            {/* SECTION TIMELINE / ÉTAPES */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100">
              <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                <ShieldCheck className="text-emerald-500" /> État du traitement
              </h3>
              <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                <Step icon={<FileText />} label="Signalement reçu" active={true} desc="Votre déposition est enregistrée dans notre base sécurisée." />
                <Step icon={<Lock />} label="Anonymisation" active={dossier.statut !== 'nouveau'} desc="Vos métadonnées ont été supprimées pour votre protection." />
                <Step icon={<ChevronRight />} label="Analyse par les autorités" active={['en_cours', 'traite'].includes(dossier.statut)} desc="Un agent habilité examine les preuves fournies." />
              </div>
            </div>
          </div>

          {/* COLONNE DROITE : STATS & SOS */}
          <div className="space-y-6">
            <div className="bg-emerald-500 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Niveau de Priorité</p>
                <p className="text-4xl font-black mt-1 capitalize">{dossier.priorite}</p>
                <div className="mt-6 flex items-center gap-2 bg-white/20 backdrop-blur-sm p-3 rounded-xl text-xs font-bold">
                  <AlertCircle size={14} /> Dossier protégé par cryptage
                </div>
              </div>
              <ShieldCheck className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100">
              <h3 className="font-black text-slate-900 mb-4">Besoin d'aide ?</h3>
              <button className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-100">
                URGENCE SOS
              </button>
              <p className="text-[10px] text-center text-slate-400 mt-4 font-bold uppercase tracking-widest">
                Assistance Douala : 117 / 1500
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sous-composant pour les étapes
const Step = ({ icon, label, active, desc }) => (
  <div className={`flex gap-4 relative z-10 ${active ? 'opacity-100' : 'opacity-40 grayscale'}`}>
    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${active ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
      {React.cloneElement(icon, { size: 12 })}
    </div>
    <div>
      <p className="font-black text-slate-900 text-sm leading-none">{label}</p>
      <p className="text-xs text-slate-500 mt-1 font-medium">{desc}</p>
    </div>
  </div>
);

export default SuiviDossier;