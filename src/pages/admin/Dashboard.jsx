import React, { useState } from 'react';
import { StatCard } from '../../components/admin/StatCard';
import { AdminLayout } from '../../layouts/AdminLayout';
import { useAdminStats } from '../../hooks/useAdminStats';
import {
  CheckCircle, Activity, AlertTriangle, Users,
  TrendingUp, TrendingDown, Minus, MapPin,
  RefreshCw, Calendar, BarChart2
} from 'lucide-react';

// ── Couleurs villes ────────────────────────────────────────────────
const VILLE_COLORS = [
  'bg-blue-900', 'bg-blue-600', 'bg-blue-400',
  'bg-amber-500', 'bg-emerald-500', 'bg-purple-500',
  'bg-rose-500',  'bg-cyan-500',
];

// ── Composant barre ville ─────────────────────────────────────────
const CityBar = ({ city, count, pct, pctBar, rank }) => (
  <div className="mb-5">
    <div className="flex justify-between items-center mb-1.5">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${VILLE_COLORS[rank % VILLE_COLORS.length]} shrink-0`} />
        <span className="text-sm font-bold text-slate-700 truncate max-w-[130px]">{city}</span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs text-slate-400 font-medium">{count} cas</span>
        <span className="text-xs font-black text-slate-600 w-8 text-right">{pct}%</span>
      </div>
    </div>
    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
      <div
        className={`${VILLE_COLORS[rank % VILLE_COLORS.length]} h-full rounded-full transition-all duration-1000`}
        style={{ width: `${pctBar}%` }}
      />
    </div>
  </div>
);

// ── Skeleton loader ───────────────────────────────────────────────
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`} />
);

// ── Tendance ──────────────────────────────────────────────────────
const Tendance = ({ data }) => {
  if (!data?.length || data.length < 2) return null;
  const avant = data[data.length - 2]?.count || 0;
  const apres = data[data.length - 1]?.count || 0;
  const diff  = apres - avant;
  if (diff > 0) return (
    <span className="flex items-center gap-1 text-red-500 text-xs font-bold">
      <TrendingUp size={12} /> +{diff} vs hier
    </span>
  );
  if (diff < 0) return (
    <span className="flex items-center gap-1 text-emerald-500 text-xs font-bold">
      <TrendingDown size={12} /> {diff} vs hier
    </span>
  );
  return <span className="flex items-center gap-1 text-slate-400 text-xs font-bold"><Minus size={12} /> Stable</span>;
};

// ── Dashboard ─────────────────────────────────────────────────────
const Dashboard = () => {
  const {
    stats, loading, refresh,
    signalements, utilisateurs, forum,
    evolution7j, evolution4s, parVille,
    tauxResolution,
  } = useAdminStats();

  const [modeEvol, setModeEvol] = useState('daily');
  const evolData = modeEvol === 'daily' ? evolution7j : evolution4s;

  // Calcul hauteur barres (normalisé sur le max)
  const maxCount = Math.max(...(evolData.map(d => d.count)), 1);

  return (
    <AdminLayout>
      <section className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Tableau de bord VoixLibre</h1>
            <p className="text-slate-500 mt-1">
              Yaoundé Hub — État du système :{' '}
              <span className="text-green-500 font-bold inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                Opérationnel
              </span>
            </p>
          </div>
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-900 bg-white border border-slate-200 px-4 py-2 rounded-xl hover:border-blue-200 transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Actualiser
          </button>
        </div>

        {/* ── 4 cartes stat ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)
          ) : (
            <>
              <StatCard
                title="Cas Traités"
                value={signalements.traites || 0}
                trend={`${tauxResolution}% résolution`}
                color="green"
                icon={CheckCircle}
              />
              <StatCard
                title="En Cours"
                value={signalements.enCours || 0}
                trend={`${signalements.mois || 0} ce mois`}
                color="blue"
                icon={Activity}
              />
              <StatCard
                title="Total Signalements"
                value={signalements.total || 0}
                trend={`+${signalements.mois || 0} nouveaux`}
                color="red"
                icon={AlertTriangle}
              />
              <StatCard
                title="Communauté"
                value={utilisateurs.total || 0}
                trend={`+${utilisateurs.mois || 0} ce mois`}
                color="orange"
                icon={Users}
              />
            </>
          )}
        </div>

        {/* ── Ligne principale : graphique + villes ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

          {/* Graphique évolution */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="font-black text-lg text-slate-900">Évolution des signalements</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-slate-500 text-sm">
                    Total période : <span className="font-bold text-slate-900">{evolData.reduce((s, d) => s + d.count, 0)}</span>
                  </span>
                  <Tendance data={evolData} />
                </div>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                <button
                  onClick={() => setModeEvol('daily')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    modeEvol === 'daily'
                      ? 'bg-white text-blue-900 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  7 jours
                </button>
                <button
                  onClick={() => setModeEvol('weekly')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    modeEvol === 'weekly'
                      ? 'bg-white text-blue-900 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  4 semaines
                </button>
              </div>
            </div>

            {loading ? (
              <Skeleton className="h-64" />
            ) : evolData.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-slate-300">
                <BarChart2 size={40} className="mb-3" />
                <p className="font-bold text-sm">Aucune donnée sur cette période</p>
              </div>
            ) : (
              <>
                {/* Barres */}
                <div className="h-56 flex items-end justify-between gap-2 px-2">
                  {evolData.map((d, i) => {
                    const hauteurPct = maxCount > 0 ? Math.max(4, (d.count / maxCount) * 100) : 4;
                    const isMax = d.count === maxCount && d.count > 0;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                        {/* Tooltip valeur */}
                        <span className={`text-xs font-black transition-all ${
                          d.count === 0 ? 'text-slate-200' : isMax ? 'text-blue-900' : 'text-slate-500'
                        }`}>
                          {d.count}
                        </span>
                        {/* Barre */}
                        <div
                          className={`w-full rounded-t-xl transition-all duration-700 cursor-pointer ${
                            d.count === 0
                              ? 'bg-slate-100'
                              : isMax
                                ? 'bg-blue-900'
                                : 'bg-blue-200 group-hover:bg-blue-400'
                          }`}
                          style={{ height: `${hauteurPct}%` }}
                          title={`${d.label || d.semaine} : ${d.count} signalement${d.count > 1 ? 's' : ''}`}
                        />
                        {/* Label */}
                        <span className="text-[10px] font-bold text-slate-400 uppercase text-center leading-tight">
                          {modeEvol === 'daily'
                            ? (d.label || d.date?.split('-')[2])
                            : (d.semaine || d.label)
                          }
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Métriques */}
                <div className="mt-6 pt-5 border-t border-slate-50 grid grid-cols-3 gap-4">
                  {[
                    { label: 'Total',   value: evolData.reduce((s,d) => s + d.count, 0) },
                    { label: 'Moyenne', value: Math.round(evolData.reduce((s,d) => s + d.count, 0) / (evolData.length || 1)) },
                    { label: 'Pic',     value: maxCount },
                  ].map((m, i) => (
                    <div key={i} className="text-center">
                      <p className="text-xl font-black text-slate-900">{m.value}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{m.label}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Répartition par ville */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-lg text-slate-900">Par ville</h3>
              <div className="flex items-center gap-1.5">
                <MapPin size={12} className="text-blue-600" />
                <span className="text-xs font-bold text-slate-400">
                  {signalements.total || 0} total
                </span>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8" />)}
              </div>
            ) : parVille.length === 0 ? (
              <div className="text-center py-8 text-slate-300">
                <MapPin size={32} className="mx-auto mb-3" />
                <p className="font-bold text-sm">Aucune donnée</p>
              </div>
            ) : (
              parVille.map((v, i) => (
                <CityBar
                  key={v.ville}
                  city={v.ville}
                  count={v.count}
                  pct={v.pct}
                  pctBar={v.pctBar}
                  rank={i}
                />
              ))
            )}

            <div className="mt-8 pt-5 border-t border-slate-50 text-[10px] text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
              Données synchronisées en temps réel
            </div>
          </div>
        </div>

        {/* ── Ligne secondaire : statuts + catégories ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Répartition par statut */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="font-black text-lg text-slate-900 mb-6">État des dossiers</h3>
            {loading ? <Skeleton className="h-32" /> : (
              <div className="space-y-3">
                {[
                  { key: 'nouveau',            label: 'Nouveaux',     color: 'bg-blue-500',   textColor: 'text-blue-600' },
                  { key: 'en_cours',           label: 'En cours',     color: 'bg-amber-500',  textColor: 'text-amber-600' },
                  { key: 'transfere_autorite', label: 'Transférés',   color: 'bg-purple-500', textColor: 'text-purple-600' },
                  { key: 'traite',             label: 'Traités',      color: 'bg-green-500',  textColor: 'text-green-600' },
                  { key: 'classe',             label: 'Classés',      color: 'bg-slate-400',  textColor: 'text-slate-500' },
                ].map(s => {
                  const found = signalements.parStatut?.find(p => p._id === s.key);
                  const count = found?.count || 0;
                  const total = signalements.total || 1;
                  const pct   = Math.round((count / total) * 100);
                  return (
                    <div key={s.key} className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${s.color} shrink-0`} />
                      <span className="text-sm font-bold text-slate-600 flex-grow">{s.label}</span>
                      <span className={`text-sm font-black ${s.textColor}`}>{count}</span>
                      <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className={`${s.color} h-full rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-slate-400 font-bold w-8 text-right">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Répartition par catégorie */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="font-black text-lg text-slate-900 mb-6">Types d'incidents</h3>
            {loading ? <Skeleton className="h-32" /> : (
              <div className="space-y-3">
                {(signalements.parCategorie || []).slice(0, 6).map((cat, i) => {
                  const total  = signalements.total || 1;
                  const pct    = Math.round((cat.count / total) * 100);
                  const maxCat = signalements.parCategorie?.[0]?.count || 1;
                  const pctBar = Math.round((cat.count / maxCat) * 100);
                  const labels = {
                    violence_physique:  'Violence physique',
                    violence_conjugale: 'Violence conjugale',
                    harcelement:        'Harcèlement',
                    cyber_harcelement:  'Cyber-harcèlement',
                    abus_enfant:        'Abus enfant',
                    corruption:         'Corruption',
                    kidnapping:         'Kidnapping',
                    autre:              'Autre',
                  };
                  return (
                    <div key={cat._id} className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-slate-400 w-4 text-right">{i + 1}</span>
                      <span className="text-sm font-bold text-slate-600 flex-grow truncate">{labels[cat._id] || cat._id}</span>
                      <span className="text-sm font-black text-slate-900">{cat.count}</span>
                      <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-900 h-full rounded-full" style={{ width: `${pctBar}%` }} />
                      </div>
                      <span className="text-xs text-slate-400 font-bold w-8 text-right">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </section>
    </AdminLayout>
  );
};

export default Dashboard;