import React from 'react';
import { format } from 'date-fns';

const IncidentRow = ({ incident, isSelected, onSelect }) => {
  const getPriorityBadge = (prio) => {
    const styles = {
      critique: "bg-red-50 text-red-600 border-red-100",
      haute: "bg-orange-50 text-orange-600 border-orange-100",
      moyenne: "bg-blue-50 text-blue-600 border-blue-100"
    };
    return styles[prio] || styles.moyenne;
  };

  return (
    <tr 
      onClick={() => onSelect(incident)}
      className={`group cursor-pointer transition-all border-b border-slate-50 hover:bg-slate-50/80 ${isSelected ? 'bg-blue-50/50' : ''}`}
    >
      <td className="px-6 py-4">
        <input type="checkbox" checked={isSelected} readOnly className="rounded border-slate-300 text-blue-600" />
      </td>
      <td className="px-6 py-4 text-[11px] font-mono font-bold text-slate-400">
        #{incident.codesuivi.split('-').pop()}
      </td>
      <td className="px-6 py-4">
        <div className="text-sm font-black text-slate-900 capitalize">{incident.categorie.replace('_', ' ')}</div>
        <div className="text-[10px] text-slate-400 font-medium line-clamp-1">{incident.description}</div>
      </td>
      <td className="px-6 py-4 text-xs font-bold text-slate-600">
        {format(new Date(incident.datecreation), 'MMM dd, yyyy')}<br/>
        <span className="text-[10px] text-slate-400 font-normal">{format(new Date(incident.datecreation), 'HH:mm')}</span>
      </td>
      <td className="px-6 py-4 text-xs text-slate-500">
        {incident.localisation?.quartier || 'Sector 7'}, {incident.localisation?.ville}
      </td>
      <td className="px-6 py-4">
        <span className={`px-2 py-0.5 rounded text-[9px] font-black border uppercase tracking-tighter ${getPriorityBadge(incident.priorite)}`}>
          {incident.priorite === 'critique' ? 'IMMEDIATE' : incident.priorite}
        </span>
      </td>
      <td className="px-6 py-4">
        <select 
          value={incident.statut} 
          className="bg-slate-100 border-none rounded-lg text-[10px] font-black uppercase py-1 px-2 focus:ring-0"
          onClick={(e) => e.stopPropagation()}
        >
          <option value="nouveau">New</option>
          <option value="en_cours">In Progress</option>
          <option value="traite">Resolved</option>
        </select>
      </td>
    </tr>
  );
};

export default IncidentRow;