import React from 'react';
import { AlertTriangle, Clock, MapPin, ShieldCheck } from 'lucide-react';

const StatIncidents = ({ stats }) => {
  const cards = [
    { label: "Critical Response", value: stats.critical || 0, sub: "+3 since last hour", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" },
    { label: "Active Cases", value: stats.active || 0, sub: "82% resolution rate", icon: Clock, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Regions Monitored", value: stats.regions || "09", sub: "Active coverage", icon: MapPin, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "System Integrity", value: "100%", sub: "Encrypted & Secure", icon: ShieldCheck, color: "text-blue-500", bg: "bg-blue-50" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {cards.map((c, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.label}</span>
            <div className={`p-2 rounded-lg ${c.bg} ${c.color}`}><c.icon size={18} /></div>
          </div>
          <h3 className="text-3xl font-black text-slate-900">{c.value}</h3>
          <p className="text-[10px] font-bold text-slate-400 mt-1">{c.sub}</p>
          <div className={`absolute -right-2 -bottom-2 opacity-5 ${c.color}`}><c.icon size={80} /></div>
        </div>
      ))}
    </div>
  );
};

export default StatIncidents;