// components/admin/CityProgress.jsx
import React from 'react';
import { MapPin } from 'lucide-react';

// ── Composant barre simple ─────────────────────────────────────────
export const CityProgress = ({ city, count, pct, pctBar, rank }) => {
  const colors = [
    'bg-emerald-500',
    'bg-blue-500',
    'bg-amber-500',
    'bg-purple-500',
    'bg-rose-500',
    'bg-cyan-500',
    'bg-orange-500',
    'bg-pink-500',
  ];
  const color = colors[rank % colors.length];

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${color} shrink-0`} />
          <span className="text-sm font-bold text-slate-200 truncate max-w-[130px]">{city}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-slate-500 font-medium">{count} cas</span>
          <span className="text-xs font-black text-slate-300 w-8 text-right">{pct}%</span>
        </div>
      </div>
      <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
        <div
          className={`${color} h-full rounded-full transition-all duration-1000`}
          style={{ width: `${pctBar}%` }}
        />
      </div>
    </div>
  );
};

// ── Bloc complet répartition par ville ────────────────────────────
export const VilleStatsBlock = ({ parVille = [], total = 0 }) => {
  if (!parVille.length) {
    return (
      <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={14} className="text-emerald-400" />
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Répartition par ville</h3>
        </div>
        <p className="text-slate-500 text-sm text-center py-6">Aucune donnée disponible</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-emerald-400" />
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Répartition par ville</h3>
        </div>
        <span className="text-[10px] text-slate-500 font-bold bg-slate-700 px-2 py-1 rounded-full">
          {total} total
        </span>
      </div>

      {parVille.map((v, i) => (
        <CityProgress
          key={v.ville}
          city={v.ville}
          count={v.count}
          pct={v.pct}
          pctBar={v.pctBar}
          rank={i}
        />
      ))}
    </div>
  );
};

export default VilleStatsBlock;