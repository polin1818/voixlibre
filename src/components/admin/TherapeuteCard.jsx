import React from 'react';
import { Check, X, MapPin, Star, User } from 'lucide-react';

export const TherapeuteCard = ({ therapeute, onToggleStatus, onDelete }) => {
  
  const categories = Array.isArray(therapeute.categories) ? therapeute.categories : [];

  // ✅ Avec Cloudinary, therapeute.photo est déjà une URL complète.
  // On définit une image par défaut au cas où le champ est vide.
  const photoUrl = therapeute.photo || null;

  return (
    <div className="bg-white p-5 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:border-blue-200 hover:shadow-md transition-all">
      
      {/* INFOS GAUCHE */}
      <div className="flex items-center gap-5">
        
        {/* AVATAR / PHOTO */}
        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-blue-600 font-bold text-xl overflow-hidden border border-slate-100 shadow-inner">
          {photoUrl ? (
            <img 
              src={photoUrl} 
              alt={therapeute.nom} 
              className="w-full h-full object-cover" 
              // En cas d'erreur de chargement de Cloudinary, on met un avatar par nom
              onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${therapeute.nom}&background=random` }}
            />
          ) : (
            <div className="flex flex-col items-center">
               <User size={24} className="text-slate-300" />
               <span className="uppercase text-[10px] text-slate-400 mt-0.5">
                {therapeute.nom ? therapeute.nom[0] : '?'}
              </span>
            </div>
          )}
        </div>
        
        {/* TEXTE & DETAILS */}
        <div>
          <h4 className="font-bold text-slate-900 capitalize text-lg leading-tight">
            {therapeute.nom}
          </h4>
          <p className="text-blue-600 text-xs font-semibold">{therapeute.specialite}</p>
          
          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
            <span className="flex items-center gap-1">
              <MapPin size={12} className="text-slate-300"/> {therapeute.ville || 'Douala'}
            </span>
            <span className="flex items-center gap-1 text-amber-500 font-medium">
              <Star size={12} fill="currentColor"/> {therapeute.note || 4.8}/5
            </span>
          </div>

          {/* BADGES CATEGORIES */}
          <div className="mt-2 flex flex-wrap gap-1">
            {categories.map((cat, index) => (
              <span 
                key={index} 
                className="text-[9px] bg-blue-50/50 px-2 py-0.5 rounded-full text-blue-500 font-bold border border-blue-100/50 uppercase tracking-tighter"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* BOUTONS ACTIONS DROITE */}
      <div className="flex gap-2">

        {/* TOGGLE STATUS */}
        <button 
          onClick={() => onToggleStatus?.(therapeute._id)}
          title={therapeute.disponible ? "Passer en indisponible" : "Passer en disponible"}
          className={`p-3 rounded-2xl transition-all border ${
            therapeute.disponible 
              ? 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100' 
              : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-blue-50 hover:text-blue-600'
          }`}
        >
          <Check size={20} strokeWidth={3} />
        </button>
        
        {/* DELETE */}
        <button 
          onClick={() => {
            if (window.confirm(`Supprimer définitivement ${therapeute.nom} ?`)) {
              onDelete?.(therapeute._id);
            }
          }}
          className="p-3 rounded-2xl bg-red-50 text-red-400 border border-red-100 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm shadow-red-100"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};