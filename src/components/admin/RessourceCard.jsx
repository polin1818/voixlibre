import React from 'react';
import { Headphones, FileText, Trash2, Clock, Play, Calendar, ExternalLink } from 'lucide-react';

export const RessourceCard = ({ ressource, onDelete }) => {
  // Sécurité si ressource n'est pas encore chargée
  if (!ressource) return null;

  const isAudio = ressource.type === 'audio';
  const isExercice = ressource.type === 'exercice';
  
  // --- LOGIQUE DE RÉPARATION D'URL CLOUDINARY ---
  const getCorrectUrl = (url) => {
    if (!url) return "#";
    // Si c'est un PDF (exercice) et que l'URL contient /image/, on force le passage en /raw/
    // Cela évite l'erreur 401 Unauthorized de Cloudinary
    if (isExercice && url.includes('/image/upload/')) {
      return url.replace('/image/upload/', '/raw/upload/');
    }
    return url;
  };

  // Formatage de la date (ex: 7 Avril 2026)
  const dateCreation = ressource.createdAt 
    ? new Date(ressource.createdAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : "Date inconnue";

  // Formatage de l'heure (ex: 18:30)
  const heureCreation = ressource.createdAt
    ? new Date(ressource.createdAt).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    : "";

  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group text-left">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-5">
          {/* ICONE DYNAMIQUE */}
          <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all group-hover:scale-105 ${
            isAudio ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
          }`}>
            {isAudio ? <Headphones size={28} /> : <FileText size={28} />}
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                isAudio ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                {ressource.type === 'exercice' ? 'PDF' : (ressource.categorie || 'Général')}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                <Calendar size={10} /> {dateCreation} {heureCreation && `à ${heureCreation}`}
              </span>
            </div>

            <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
              {ressource.titre || ressource.nom}
            </h3>

            <div className="flex items-center gap-4 mt-2">
                {ressource.duree && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-lg">
                        <Clock size={12} /> {ressource.duree}
                    </span>
                )}
                <p className="text-slate-400 text-[11px] font-medium italic">
                    ID: #{ressource?._id ? ressource._id.slice(-5) : '...'}
                </p>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => window.open(getCorrectUrl(ressource.url_media), '_blank')}
            className="p-3 bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-2xl transition-all active:scale-90 shadow-sm"
            title={isAudio ? "Écouter" : "Ouvrir le document"}
          >
            {isAudio ? <Play size={18} fill="currentColor" /> : <ExternalLink size={18} />}
          </button>
          
          <button 
            onClick={() => {
                if(window.confirm("Supprimer cette ressource ?")) onDelete();
            }}
            className="p-3 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all shadow-sm"
            title="Supprimer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      {/* DESCRIPTION */}
      <div className="mt-4 pt-4 border-t border-slate-50">
          <p className="text-slate-500 text-sm font-medium line-clamp-2 italic">
            "{ressource.description || 'Aucune description disponible'}"
          </p>
      </div>
    </div>
  );
};