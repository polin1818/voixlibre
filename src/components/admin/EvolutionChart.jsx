// components/admin/EvolutionChart.jsx
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react';

// ── Mini graphique à barres SVG ────────────────────────────────────
const BarChart = ({ data, color = '#10b981', height = 80 }) => {
  if (!data?.length) return null;

  const max = Math.max(...data.map(d => d.count), 1);
  const barW = Math.floor(200 / data.length) - 4;

  return (
    <svg width="100%" viewBox={`0 0 ${data.length * (barW + 4)} ${height + 20}`} preserveAspectRatio="none">
      {data.map((d, i) => {
        const barH = Math.max(2, (d.count / max) * height);
        const x    = i * (barW + 4);
        const y    = height - barH;
        return (
          <g key={i}>
            <rect
              x={x} y={y} width={barW} height={barH}
              rx="3"
              fill={d.count === 0 ? '#334155' : color}
              opacity={d.count === 0 ? 0.4 : 0.9}
            >
              <title>{d.label} : {d.count} signalement{d.count > 1 ? 's' : ''}</title>
            </rect>
            {/* Valeur au-dessus si > 0 */}
            {d.count > 0 && (
              <text
                x={x + barW / 2} y={y - 4}
                textAnchor="middle"
                fontSize="8"
                fill="#94a3b8"
                fontWeight="bold"
              >
                {d.count}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

// ── Tendance ───────────────────────────────────────────────────────
const Tendance = ({ data }) => {
  if (!data?.length || data.length < 2) return null;
  const avant  = data[data.length - 2]?.count || 0;
  const apres  = data[data.length - 1]?.count || 0;
  const diff   = apres - avant;

  if (diff > 0) return (
    <span className="flex items-center gap-1 text-red-400 text-xs font-bold">
      <TrendingUp size={12} /> +{diff} vs hier
    </span>
  );
  if (diff < 0) return (
    <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
      <TrendingDown size={12} /> {diff} vs hier
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-slate-500 text-xs font-bold">
      <Minus size={12} /> Stable
    </span>
  );
};

// ── Composant principal ────────────────────────────────────────────
const EvolutionChart = ({ evolution7j = [], evolution4s = [] }) => {
  const [mode, setMode] = useState('daily'); // daily | weekly

  const data    = mode === 'daily' ? evolution7j : evolution4s;
  const isEmpty = !data?.length;

  const total   = data.reduce((s, d) => s + d.count, 0);
  const moyenne = data.length ? Math.round(total / data.length) : 0;
  const max     = data.length ? Math.max(...data.map(d => d.count)) : 0;

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-emerald-400" />
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Évolution des signalements
          </h3>
        </div>
        {/* Toggle quotidien / hebdo */}
        <div className="flex items-center gap-1 bg-slate-900/60 rounded-lg p-0.5">
          <button
            onClick={() => setMode('daily')}
            className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider transition-all ${
              mode === 'daily' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            7 jours
          </button>
          <button
            onClick={() => setMode('weekly')}
            className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider transition-all ${
              mode === 'weekly' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            4 semaines
          </button>
        </div>
      </div>

      {/* Métriques rapides */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Total période', value: total },
          { label: 'Moyenne / jour', value: moyenne },
          { label: 'Pic',            value: max },
        ].map((m, i) => (
          <div key={i} className="bg-slate-700/40 rounded-xl p-3 text-center">
            <p className="text-lg font-black text-white">{m.value}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Graphique */}
      {isEmpty ? (
        <div className="h-24 flex items-center justify-center text-slate-600">
          <div className="text-center">
            <Calendar size={24} className="mx-auto mb-2 opacity-40" />
            <p className="text-xs font-bold">Aucune donnée sur cette période</p>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-3">
            <BarChart data={data} color="#10b981" height={80} />
          </div>

          {/* Labels axe X */}
          <div className="flex justify-between mt-1">
            {data.map((d, i) => (
              <span key={i} className="text-[9px] text-slate-600 font-bold text-center flex-1 truncate px-0.5">
                {mode === 'daily' ? d.label : d.semaine}
              </span>
            ))}
          </div>
        </>
      )}

      {/* Tendance */}
      {mode === 'daily' && evolution7j.length >= 2 && (
        <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
          <Tendance data={evolution7j} />
          <span className="text-[10px] text-slate-600">
            {evolution7j[evolution7j.length - 1]?.label}
          </span>
        </div>
      )}
    </div>
  );
};

export default EvolutionChart;