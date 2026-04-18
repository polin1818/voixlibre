import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/client';
import { AdminLayout } from '../../layouts/AdminLayout';
import {
  Search, Filter, Download, Plus, ChevronDown, ChevronLeft, ChevronRight,
  AlertTriangle, Eye, Trash2, CheckCircle, Clock, XCircle,
  MapPin, Calendar, FileText, Phone, Upload, X, RefreshCw,
  ArrowUpDown, MoreHorizontal, Shield, Zap, Archive, Tag
} from 'lucide-react';

// ── Config ─────────────────────────────────────────────────────────
const CAT_LABELS = {
  violence_physique:   'Violence physique',
  violence_conjugale: 'Violence conjugale',
  harcelement:         'Harcèlement',
  cyber_harcelement:   'Cyber-harcèlement',
  abus_enfant:         'Abus enfant',
  agression_sexuelle: 'Agression sexuelle',
  corruption:          'Corruption',
  kidnapping:          'Kidnapping',
  menace_mort:         'Menace de mort',
  discrimination:      'Discrimination',
  autre:               'Autre',
};

const PRIORITE_CONFIG = {
  critique: { label: 'CRITIQUE', bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400' },
  haute:    { label: 'HAUTE',    bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-400' },
  moyenne:  { label: 'MEDIUM',   bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-yellow-400' },
  basse:    { label: 'BASSE',    bg: 'bg-slate-500/20', border: 'border-slate-500/50', text: 'text-slate-400' },
};

const STATUT_CONFIG = {
  nouveau:            { label: 'Nouveau',    color: 'text-blue-400',   bg: 'bg-blue-900/40' },
  en_cours:           { label: 'En cours',   color: 'text-amber-400',  bg: 'bg-amber-900/40' },
  transfere_autorite: { label: 'Transféré',  color: 'text-purple-400', bg: 'bg-purple-900/40' },
  traite:             { label: 'Traité',     color: 'text-green-400',  bg: 'bg-green-900/40' },
  classe:             { label: 'Classé',     color: 'text-slate-400',  bg: 'bg-slate-800' },
};

// ── Utilitaires ────────────────────────────────────────────────────
const exportCSV = (data) => {
  const headers = ['Code','Catégorie','Priorité','Statut','Lieu','Date'];
  const rows = data.map(s => [
    s.codesuivi, CAT_LABELS[s.categorie] || s.categorie,
    s.priorite, s.statut,
    s.localisation?.ville || '', new Date(s.datecreation).toLocaleDateString('fr-FR'),
  ]);
  const csv = [headers, ...rows].map(r => r.join(';')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a'); a.href = url;
  a.download = `signalements_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
};

// ── Badge Priorité ─────────────────────────────────────────────────
const BadgePriorite = ({ p }) => {
  const cfg = PRIORITE_CONFIG[p] || PRIORITE_CONFIG.moyenne;
  return (
    <span className={`px-2 py-0.5 rounded border ${cfg.bg} ${cfg.border} ${cfg.text} text-[10px] font-black uppercase tracking-wider`}>
      {cfg.label}
    </span>
  );
};

// ── Select Statut inline ───────────────────────────────────────────
const SelectStatut = ({ value, onChange, disabled }) => {
  const cfg = STATUT_CONFIG[value] || STATUT_CONFIG.nouveau;
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className={`appearance-none pl-3 pr-7 py-1.5 rounded-lg text-xs font-bold border border-slate-700 cursor-pointer outline-none transition-all ${cfg.bg} ${cfg.color} disabled:opacity-50 hover:border-slate-500`}
      >
        {Object.entries(STATUT_CONFIG).map(([v, c]) => (
          <option key={v} value={v} className="bg-slate-800 text-white">{c.label}</option>
        ))}
      </select>
      <ChevronDown size={12} className={`absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none ${cfg.color}`} />
    </div>
  );
};

// ── Ligne tableau ──────────────────────────────────────────────────
const IncidentRow = ({ sig, selected, onSelect, onView, onStatutChange, onDelete, updating }) => {
  const cat    = CAT_LABELS[sig.categorie] || sig.categorie;
  const region = [sig.localisation?.quartier, sig.localisation?.ville].filter(Boolean).join(', ') || '—';

  return (
    <tr className={`border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors ${selected ? 'bg-slate-800/60' : ''}`}>
      <td className="px-4 py-3">
        <input type="checkbox" checked={selected} onChange={onSelect}
          className="w-4 h-4 rounded border-slate-600 bg-slate-900 accent-emerald-500 cursor-pointer" />
      </td>
      <td className="px-4 py-3">
        <span className="font-mono text-xs text-emerald-500 font-bold">{sig.codesuivi}</span>
      </td>
      <td className="px-4 py-3">
        <div className="font-semibold text-slate-200 text-sm">{cat}</div>
        <div className="text-xs text-slate-500 mt-0.5 max-w-[200px] truncate">{sig.description}</div>
      </td>
      <td className="px-4 py-3 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 truncate"><MapPin size={10} className="text-slate-600"/>{region}</div>
      </td>
      <td className="px-4 py-3">
        <div className="text-xs text-slate-300">{new Date(sig.datecreation).toLocaleDateString('fr-FR')}</div>
        <div className="text-[10px] text-slate-500 uppercase">{new Date(sig.datecreation).toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' })}</div>
      </td>
      <td className="px-4 py-3">
        <BadgePriorite p={sig.priorite} />
      </td>
      <td className="px-4 py-3">
        <SelectStatut value={sig.statut} onChange={v => onStatutChange(sig._id, v)} disabled={updating === sig._id} />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button onClick={() => onView(sig)}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-emerald-400 transition-colors">
            <Eye size={16} />
          </button>
          <button onClick={() => onDelete(sig._id)}
            className="p-1.5 rounded-lg hover:bg-red-900/20 text-slate-400 hover:text-red-400 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

// ── Panel détail ───────────────────────────────────────────────────
const DetailPanel = ({ sig, onClose, onUpdate }) => {
  const [statut,   setStatut]   = useState(sig.statut);
  const [priorite, setPriorite] = useState(sig.priorite);
  const [note,     setNote]     = useState('');
  const [saving,   setSaving]   = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await apiClient.patch(`/admin/signalements/${sig._id}`, {
        statut, priorite, note_admin: note || undefined,
      });
      onUpdate(sig._id, { statut, priorite });
      setNote('');
    } catch (e) {
      alert('Erreur : ' + (e.response?.data?.message || e.message));
    } finally { setSaving(false); }
  };

  const cfg    = STATUT_CONFIG[sig.statut]  || STATUT_CONFIG.nouveau;
  const region = [sig.localisation?.quartier, sig.localisation?.ville].filter(Boolean).join(', ') || 'Non précisé';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-end bg-black/80 backdrop-blur-md" onClick={onClose}>
      <div className="w-full max-w-xl h-full bg-slate-900 border-l border-slate-800 overflow-y-auto shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 px-6 py-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Rapport d'incident</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
            </div>
            <h2 className="text-white font-black text-xl font-mono">{sig.codesuivi}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8 flex-1">
          {/* Main Content */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <BadgePriorite p={sig.priorite} />
              <span className="text-[10px] px-2 py-1 rounded-md bg-slate-800 text-slate-300 font-bold uppercase border border-slate-700">
                {CAT_LABELS[sig.categorie] || sig.categorie}
              </span>
            </div>
            
            <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-5">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <FileText size={12} className="text-emerald-500" /> Description des faits
              </p>
              <p className="text-slate-200 text-sm leading-relaxed italic font-serif">"{sig.description}"</p>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <MapPin size={14}/>, label:'Localisation', val: region },
              { icon: <Calendar size={14}/>, label:'Date du rapport', val: new Date(sig.datecreation).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' }) },
              { icon: <Shield size={14}/>, label:'Sûreté', val: 'Chiffrement AES-256' },
              ...(sig.contact?.telephone ? [{ icon: <Phone size={14}/>, label:'Contact source', val: sig.contact.telephone }] : []),
            ].map((info, i) => (
              <div key={i} className="bg-slate-800/30 border border-slate-800/50 rounded-xl p-3">
                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase mb-1">
                  <span className="text-emerald-500/70">{info.icon}</span>{info.label}
                </div>
                <div className="text-slate-300 text-xs font-semibold">{info.val || '—'}</div>
              </div>
            ))}
          </div>

          {/* Files Section */}
          {sig.preuves?.length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Upload size={12} className="text-emerald-500" /> Preuves numériques ({sig.preuves.length})
              </p>
              <div className="grid grid-cols-3 gap-3">
                {sig.preuves.map((p, i) => (
                  <a key={i} href={p.url || p} target="_blank" rel="noreferrer"
                    className="group relative aspect-square rounded-xl overflow-hidden bg-slate-800 border border-slate-700 hover:border-emerald-500/50 transition-all">
                    {(p.resource_type === 'image' || typeof p === 'string') ? (
                      <img src={p.url || p} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                        <FileText size={24} />
                        <span className="text-[10px] mt-2 font-bold uppercase">{p.format || 'DOC'}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Eye size={16} className="text-white" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Admin Action Box */}
          <div className="bg-slate-950/50 rounded-2xl p-5 border border-emerald-500/20 space-y-5">
            <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Console de Traitement</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Statut opérationnel</label>
                <select value={statut} onChange={e => setStatut(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:border-emerald-500 outline-none transition-all">
                  {Object.entries(STATUT_CONFIG).map(([v,c]) => <option key={v} value={v}>{c.label}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Degré d'urgence</label>
                <select value={priorite} onChange={e => setPriorite(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:border-emerald-500 outline-none transition-all">
                  <option value="basse">Basse</option>
                  <option value="moyenne">Moyenne</option>
                  <option value="haute">Haute</option>
                  <option value="critique">Critique</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Notes de suivi interne</label>
              <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
                placeholder="Renseignez les actions entreprises..."
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-xl px-4 py-3 outline-none focus:border-emerald-500 resize-none placeholder-slate-600" />
            </div>

            <button onClick={save} disabled={saving}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl text-xs uppercase tracking-widest transition-all disabled:opacity-50 shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2">
              {saving ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle size={14} />}
              {saving ? 'Mise à jour...' : 'Confirmer les modifications'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Page principale ────────────────────────────────────────────────
const AdminSignalements = () => {
  const [signalements, setSignalements] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [pagination,   setPagination]   = useState({ page: 1, pages: 1, total: 0 });
  const [selected,     setSelected]     = useState(new Set());
  const [detail,       setDetail]       = useState(null);
  const [updating,     setUpdating]     = useState(null);
  const [deleting,     setDeleting]     = useState(false);
  const [stats,        setStats]        = useState(null);

  const [search,    setSearch]    = useState('');
  const [statut,    setStatut]    = useState('');
  const [categorie, setCategorie] = useState('');
  const [priorite,  setPriorite]  = useState('');
  const [tab,       setTab]       = useState('all');
  const [limit,     setLimit]     = useState(25);

  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit });
      if (statut)    params.append('statut', statut);
      if (categorie) params.append('categorie', categorie);
      if (priorite)  params.append('priorite', priorite);
      if (search)    params.append('search', search);
      if (tab === 'unassigned') params.set('statut', 'nouveau');
      if (tab === 'recent')     params.append('tri', 'recent');

      const res = await apiClient.get(`/admin/signalements?${params}`);
      setSignalements(res.data.data || []);
      setPagination(res.data.pagination || { page:1, pages:1, total:0 });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [statut, categorie, priorite, search, tab, limit]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await apiClient.get('/admin/stats');
      setStats(res.data.data?.signalements);
    } catch(e) {}
  }, []);

  useEffect(() => { fetchData(1); fetchStats(); }, [fetchData, fetchStats]);

  const handleStatutChange = async (id, newStatut) => {
    setUpdating(id);
    try {
      await apiClient.patch(`/admin/signalements/${id}`, { statut: newStatut });
      setSignalements(prev => prev.map(s => s._id === id ? { ...s, statut: newStatut } : s));
    } catch (e) { alert('Erreur'); }
    finally { setUpdating(null); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Action irréversible. Supprimer ?')) return;
    try {
      await apiClient.delete(`/admin/signalements/${id}`);
      setSignalements(prev => prev.filter(s => s._id !== id));
      fetchStats();
    } catch (e) { alert('Erreur'); }
  };

  const metrics = [
    { label: 'Critiques', value: stats?.critiques || 0, color: 'text-red-500' },
    { label: 'Total Incidents', value: stats?.total || 0, color: 'text-white' },
    { label: 'Traités', value: stats?.traites || 0, color: 'text-emerald-400' },
    { label: 'Résolution', value: `${stats?.tauxResolution || 0}%`, color: 'text-blue-400' },
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
        {detail && <DetailPanel sig={detail} onClose={() => setDetail(null)} onUpdate={(id, data) => {
          setSignalements(prev => prev.map(s => s._id === id ? { ...s, ...data } : s));
          fetchStats();
        }} />}

        {/* Header Section */}
        <div className="px-8 pt-10 pb-8 border-b border-slate-900 bg-slate-950/50 backdrop-blur-md sticky top-0 z-40">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Opérations Nationales</span>
              </div>
              <h1 className="text-4xl font-black text-white tracking-tighter italic">UNITÉ DE GESTION</h1>
              <p className="text-slate-400 text-sm font-medium">Surveillance en temps réel des signalements citoyens.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button onClick={() => exportCSV(signalements)}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-slate-800">
                <Download size={14} /> Export
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20">
                <Plus size={14} /> Nouveau Cas
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {metrics.map((m, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-900 rounded-2xl p-4 transition-all hover:border-slate-800">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{m.label}</p>
                <p className={`text-2xl font-black ${m.color}`}>{m.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8">
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl overflow-hidden shadow-2xl">
            {/* Toolbar */}
            <div className="px-6 py-5 border-b border-slate-900 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-900">
                {['all', 'unassigned', 'recent'].map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                      tab === t ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-slate-500 hover:text-slate-300'
                    }`}>
                    {t === 'all' ? 'Tous' : t === 'unassigned' ? 'Nouveaux' : 'Récents'}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 flex-1 md:flex-none">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input 
                    type="text" 
                    value={search} 
                    onChange={e => setSearch(e.target.value)}
                    placeholder="ID SIGNALEMENT..."
                    className="w-full md:w-64 bg-slate-950 border border-slate-900 text-slate-200 text-[10px] font-black rounded-xl pl-10 pr-4 py-3 outline-none focus:border-emerald-500/50 transition-all uppercase tracking-widest"
                  />
                </div>
                
                <button onClick={() => fetchData(1)} className="p-3 bg-slate-950 border border-slate-900 rounded-xl text-slate-500 hover:text-emerald-500 transition-all">
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-950/50 border-b border-slate-900">
                    <th className="px-6 py-4">
                      <input type="checkbox" onChange={e => setSelected(e.target.checked ? new Set(signalements.map(s => s._id)) : new Set())}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-950 accent-emerald-500" />
                    </th>
                    {['Reference', 'Incident', 'Localisation', 'Date', 'Priorité', 'Statut', ''].map(h => (
                      <th key={h} className="px-4 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({length: 8}).map((_, i) => (
                      <tr key={i} className="animate-pulse border-b border-slate-900/50">
                        <td colSpan={8} className="px-6 py-4"><div className="h-10 bg-slate-900 rounded-xl w-full" /></td>
                      </tr>
                    ))
                  ) : (
                    signalements.map(sig => (
                      <IncidentRow 
                        key={sig._id} 
                        sig={sig}
                        selected={selected.has(sig._id)}
                        onSelect={() => {
                          const n = new Set(selected);
                          n.has(sig._id) ? n.delete(sig._id) : n.add(sig._id);
                          setSelected(n);
                        }}
                        onView={setDetail}
                        onStatutChange={handleStatutChange}
                        onDelete={handleDelete}
                        updating={updating}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Pagination */}
            <div className="px-8 py-5 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-950/30">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                Affichage {signalements.length} / {pagination.total} Entrées enregistrées
              </p>
              
              <div className="flex items-center gap-2">
                <button disabled={pagination.page === 1} onClick={() => fetchData(pagination.page - 1)}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 hover:text-white disabled:opacity-30">
                  <ChevronLeft size={16} />
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).slice(0, 5).map(p => (
                    <button key={p} onClick={() => fetchData(p)}
                      className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${
                        pagination.page === p ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-500 hover:text-slate-200'
                      }`}>
                      {p}
                    </button>
                  ))}
                </div>
                <button disabled={pagination.page === pagination.pages} onClick={() => fetchData(pagination.page + 1)}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 hover:text-white disabled:opacity-30">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Footer */}
        <div className="p-8 flex justify-center opacity-40">
          <div className="flex items-center gap-3 px-6 py-2 bg-slate-900 rounded-full border border-slate-800">
            <Shield size={12} className="text-emerald-500" />
            <span className="text-[9px] font-black tracking-[0.3em] text-slate-500 uppercase">Cryptosystème actif : Protocole de Sécurité SGN-237</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSignalements;