import React from 'react';
import { MapPin, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const IncidentCard = ({ incident, isSelected, onClick }) => {
  // Mapping des styles selon tes priorités MongoDB
  const getPriorityStyle = (prio) => {
    const styles = {
      critique: 'bg-red-600 text-white border-red-700',
      haute: 'bg-orange-500 text-white border-orange-600',
      moyenne: 'bg-blue-500 text-white border-blue-600',
      basse: 'bg-slate-400 text-white border-slate-500'
    };
    return styles[prio] || 'bg-slate-500 text-white';
  };

  return (
    <div 
      onClick={() => onClick(incident)}
      className={`p-4 mb-3 rounded-xl border-2 cursor-pointer transition-all ${
        isSelected 
        ? 'border-blue-600 bg-blue-50/50 shadow-md scale-[1.02]' 
        : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-mono font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
          {incident.codesuivi}
        </span>
        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase shadow-sm ${getPriorityStyle(incident.priorite)}`}>
          {incident.priorite}
        </span>
      </div>

      <h4 className="font-black text-slate-900 text-sm mb-1 uppercase tracking-tight">
        {incident.categorie.replace('_', ' ')}
      </h4>
      
      <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed italic">
        "{incident.description}"
      </p>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
          <span className="flex items-center gap-1">
            <MapPin size={10} className="text-blue-500" /> 
            {incident.localisation?.ville || 'Douala'}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={10} className="text-slate-400" /> 
            {format(new Date(incident.datecreation), 'dd MMM yyyy', { locale: fr })}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[9px] font-black text-emerald-600 uppercase">{incident.statut}</span>
        </div>
      </div>
    </div>
  );
};

export default IncidentCard;