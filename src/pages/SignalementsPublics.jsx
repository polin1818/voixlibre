import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';
import {
  MapPin, Calendar, ChevronDown, AlertCircle, Search,
  Loader2, Share2, ArrowLeft, X, Phone, FileText,
  Tag, SlidersHorizontal, ImageOff
} from 'lucide-react';

// ── Config ─────────────────────────────────────────────────────────
const CAT_CONFIG = {
  '':                  { label: 'Toutes catégories',  color: 'bg-slate-100 text-slate-700',   dot: '#64748b' },
  violence_physique:   { label: 'Violence physique',  color: 'bg-red-100 text-red-700',        dot: '#dc2626' },
  violence_conjugale:  { label: 'Violence conjugale', color: 'bg-pink-100 text-pink-700',      dot: '#db2777' },
  harcelement:         { label: 'Harcèlement',        color: 'bg-orange-100 text-orange-700',  dot: '#ea580c' },
  cyber_harcelement:   { label: 'Cyber-harcèlement',  color: 'bg-violet-100 text-violet-700', dot: '#7c3aed' },
  abus_enfant:         { label: 'Abus enfant',        color: 'bg-purple-100 text-purple-700',  dot: '#9333ea' },
  agression_sexuelle:  { label: 'Agression sexuelle', color: 'bg-rose-100 text-rose-700',      dot: '#e11d48' },
  corruption:          { label: 'Corruption',         color: 'bg-yellow-100 text-yellow-700',  dot: '#ca8a04' },
  kidnapping:          { label: 'Kidnapping',         color: 'bg-red-200 text-red-800',        dot: '#b91c1c' },
  menace_mort:         { label: 'Menace de mort',     color: 'bg-red-100 text-red-700',        dot: '#dc2626' },
  discrimination:      { label: 'Discrimination',     color: 'bg-blue-100 text-blue-700',      dot: '#2563eb' },
  autre:               { label: 'Autre',              color: 'bg-slate-100 text-slate-700',    dot: '#64748b' },
};

const STATUT_CONFIG = {
  '':                  { label: 'Tous les statuts',  color: '' },
  nouveau:             { label: 'Nouveau',           color: 'bg-blue-50 text-blue-700 border-blue-200' },
  en_cours:            { label: 'En cours',          color: 'bg-amber-50 text-amber-700 border-amber-200' },
  transfere_autorite:  { label: 'Transféré',         color: 'bg-purple-50 text-purple-700 border-purple-200' },
  traite:              { label: 'Traité ✓',          color: 'bg-green-50 text-green-700 border-green-200' },
};

// ── Numéro de contact : signalant si consent, sinon 117 ────────────
const getContactNumber = (telephone, accepterAppel) => {
  if (telephone && accepterAppel === true) {
    return { num: telephone.replace(/\s/g, ''), label: 'Contacter le signalant', isDefault: false };
  }
  return { num: '117', label: 'Police Secours', isDefault: true };
};

// ── Image robuste ─────────────────────────────────────────────────
const RobustImage = ({ src, className = '', fallbackClass = '' }) => {
  const [state, setState] = useState(src ? 'loading' : 'empty');
  useEffect(() => { setState(src ? 'loading' : 'empty'); }, [src]);

  if (state === 'error' || state === 'empty') {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 to-slate-200 ${fallbackClass || className}`}>
        <ImageOff className="text-slate-300" size={28} />
        <span className="text-xs text-slate-400 font-medium">Aucune image</span>
      </div>
    );
  }
  return (
    <img src={src} className={className}
      onLoad={() => setState('loaded')}
      onError={() => setState('error')}
      style={state === 'loading' ? { opacity: 0.6 } : { opacity: 1 }}
      alt="Signalement"
    />
  );
};

// ── Modal détail ───────────────────────────────────────────────────
const DetailModal = ({ report, onClose }) => {
  if (!report) return null;
  const cat     = CAT_CONFIG[report.categorie] || CAT_CONFIG[''];
  const statut  = STATUT_CONFIG[report.statut] || STATUT_CONFIG.nouveau;
  const contact = getContactNumber(report.telephone, report.accepterAppel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>

        {/* Image */}
        <div className="h-52 relative rounded-t-[2.5rem] overflow-hidden">
          <RobustImage src={report.image} className="w-full h-full object-cover" fallbackClass="w-full h-full" />
          <button onClick={onClose} className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow hover:bg-red-50 hover:text-red-500 transition-colors z-10">
            <X size={18} />
          </button>
          <span className={`absolute top-4 left-4 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider border ${cat.color}`}>
            {cat.label}
          </span>
        </div>

        <div className="p-7">
          {/* Badges statut + code */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            {statut.color && (
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${statut.color}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />{statut.label}
              </span>
            )}
            <span className="font-mono text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full font-bold tracking-wider">
              {report.codesuivi}
            </span>
            {report.priorite && report.priorite !== 'moyenne' && (
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 capitalize">
                {report.priorite}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="mb-5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText size={11} /> Description complète
            </p>
            <p className="text-slate-700 text-sm leading-relaxed">{report.description || report.titre}</p>
          </div>

          {/* Infos */}
          <div className="bg-slate-50 rounded-2xl p-4 space-y-3 mb-5">
            {report.lieu && report.lieu.trim() !== ',' && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin size={15} className="text-blue-500 shrink-0" />
                <span className="text-slate-600 font-medium">{report.lieu}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm">
              <Calendar size={15} className="text-blue-500 shrink-0" />
              <span className="text-slate-600 font-medium">{report.date}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Tag size={15} className="text-blue-500 shrink-0" />
              <span className="text-slate-600 font-medium">{cat.label}</span>
            </div>
          </div>

          {/* Numéro de contact */}
          <div className={`rounded-2xl p-4 mb-5 border ${contact.isDefault ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
            <p className={`text-[10px] font-black uppercase tracking-wider mb-2 ${contact.isDefault ? 'text-red-700' : 'text-emerald-700'}`}>
              {contact.isDefault ? "Numéro d'urgence" : 'Contact du signalant'}
            </p>
            <a href={`tel:${contact.num}`}
              className={`flex items-center justify-between px-4 py-3 rounded-xl font-black transition-colors text-white ${
                contact.isDefault ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              <span className="flex items-center gap-2 text-sm">
                <Phone size={16} /> {contact.label}
              </span>
              <span className="text-2xl font-black tracking-wider">{contact.num}</span>
            </a>
            {!contact.isDefault && (
              <p className="text-xs text-emerald-700 mt-2 font-medium">
                Ce numéro a été volontairement partagé par le signalant.
              </p>
            )}
          </div>

          {/* Urgences secondaires si numéro perso */}
          {!contact.isDefault && (
            <div className="grid grid-cols-2 gap-2 mb-5">
              {[{num:'117',label:'Police'},{num:'119',label:'SAMU'},{num:'113',label:'Gendarm.'},{num:'116',label:'Enfance'}].map(n => (
                <a key={n.num} href={`tel:${n.num}`}
                  className="flex items-center justify-between bg-slate-100 text-slate-800 px-3 py-2 rounded-xl hover:bg-red-50 hover:text-red-700 transition-all">
                  <span className="text-xs font-bold">{n.label}</span>
                  <span className="text-base font-black">{n.num}</span>
                </a>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Link to={`/suivi?code=${report.codesuivi}`}
              className="flex-1 bg-slate-900 text-white py-3.5 rounded-2xl font-black text-sm text-center hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
              <Search size={16} /> Suivre ce dossier
            </Link>
            <button
              onClick={() => {
                if (navigator.share) navigator.share({ title: report.titre, url: window.location.href });
                else navigator.clipboard.writeText(window.location.origin + '/suivi?code=' + report.codesuivi);
              }}
              className="p-3.5 bg-slate-100 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Carte signalement ──────────────────────────────────────────────
const SignalCard = ({ signal, onClick }) => {
  const cat     = CAT_CONFIG[signal.categorie] || CAT_CONFIG[''];
  const statut  = STATUT_CONFIG[signal.statut] || STATUT_CONFIG.nouveau;
  const contact = getContactNumber(signal.telephone, signal.accepterAppel);

  return (
    <div onClick={() => onClick(signal)}
      className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer group">

      {/* Image */}
      <div className="h-40 relative overflow-hidden">
        <RobustImage src={signal.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" fallbackClass="w-full h-full" />
        <span className={`absolute top-3 left-3 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${cat.color}`}>
          {cat.label}
        </span>
        {statut.color && (
          <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full border ${statut.color}`}>
            {statut.label}
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <p className="text-sm font-black text-slate-900 line-clamp-2 mb-3 leading-snug group-hover:text-blue-600 transition-colors">
          {signal.titre}
        </p>

        <div className="space-y-1.5 flex-grow mb-4">
          {signal.lieu && signal.lieu.trim() !== ',' && (
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <MapPin size={11} className="text-blue-500 shrink-0" />
              <span className="truncate">{signal.lieu}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Calendar size={11} className="text-blue-500 shrink-0" />
            {signal.date}
          </div>
          {/* Statut sous la date */}
          {statut.color && (
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${statut.color}`}>
              <span className="w-1 h-1 rounded-full bg-current" />{statut.label}
            </span>
          )}
        </div>

        {/* Bouton contact : numéro signalant ou 117 */}
        <a href={`tel:${contact.num}`} onClick={e => e.stopPropagation()}
          className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-colors text-white ${
            contact.isDefault ? 'bg-slate-900 hover:bg-red-600' : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
            <Phone size={11} />
            {contact.isDefault ? 'Urgence' : 'Contacter'}
          </span>
          <span className="text-lg font-black">{contact.num}</span>
        </a>
      </div>
    </div>
  );
};

// ── Page principale ────────────────────────────────────────────────
const SignalementsPublics = () => {
  const [signals, setSignals]               = useState([]);
  const [loading, setLoading]               = useState(true);
  const [loadingMore, setLoadingMore]       = useState(false);
  const [paginationData, setPagination]     = useState({ page:1, pages:1, total:0 });
  const [search, setSearch]                 = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showFilters, setShowFilters]       = useState(false);
  const [categorie, setCategorie]           = useState('');
  const [statut, setStatut]                 = useState('');
  const [tri, setTri]                       = useState('recent');

  const fetchSignals = useCallback(async (page = 1, append = false) => {
    append ? setLoadingMore(true) : setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12, tri });
      if (categorie) params.append('categorie', categorie);
      if (statut)    params.append('statut', statut);

      const res = await apiClient.get('/signalements/tous?' + params.toString());
      const { data, pagination: pg } = res.data;
      setSignals(prev => append ? [...prev, ...(data || [])] : (data || []));
      setPagination(pg || { page:1, pages:1, total:0 });
    } catch (err) { console.error(err); }
    finally { setLoading(false); setLoadingMore(false); }
  }, [categorie, statut, tri]);

  useEffect(() => { fetchSignals(1, false); }, [fetchSignals]);

  const filtres = signals.filter(s =>
    !search ||
    s.titre?.toLowerCase().includes(search.toLowerCase()) ||
    s.description?.toLowerCase().includes(search.toLowerCase()) ||
    s.lieu?.toLowerCase().includes(search.toLowerCase())
  );

  const nbActifs = [categorie, statut].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {selectedReport && <DetailModal report={selectedReport} onClose={() => setSelectedReport(null)} />}

      {/* Header sticky */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="font-black text-slate-900 text-lg">Tous les signalements</h1>
              <p className="text-xs text-slate-500">{paginationData.total} signalement{paginationData.total > 1 ? 's' : ''}</p>
            </div>
          </div>
          <Link to="/signalement" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 flex items-center gap-2">
            <AlertCircle size={16} /> Signaler
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Barre recherche + filtres */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Rechercher par titre, lieu..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 pl-11 pr-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 text-sm font-medium shadow-sm" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm border shadow-sm transition-colors ${
              nbActifs > 0 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
            }`}>
            <SlidersHorizontal size={16} />
            Filtres {nbActifs > 0 && (
              <span className="bg-white text-blue-600 rounded-full w-5 h-5 text-xs flex items-center justify-center font-black">{nbActifs}</span>
            )}
          </button>
        </div>

        {/* Panneau filtres */}
        {showFilters && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 mb-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label:'Catégorie', value:categorie, set:setCategorie,
                  opts: Object.entries(CAT_CONFIG).map(([v,c]) => ({ v, l: c.label })) },
                { label:'Statut',    value:statut,    set:setStatut,
                  opts: Object.entries(STATUT_CONFIG).map(([v,s]) => ({ v, l: s.label })) },
                { label:'Trier par', value:tri,       set:setTri,
                  opts: [{v:'recent',l:'Plus récent'},{v:'ancien',l:'Plus ancien'},{v:'priorite',l:'Par priorité'}] },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">{f.label}</label>
                  <div className="relative">
                    <select value={f.value} onChange={e => f.set(e.target.value)}
                      className="w-full appearance-none bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 pl-4 pr-8 py-2.5 rounded-xl outline-none cursor-pointer">
                      {f.opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              ))}
            </div>

            {/* Chips catégories rapides */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
              {Object.entries(CAT_CONFIG).map(([v, c]) => (
                <button key={v} onClick={() => setCategorie(v)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    categorie === v ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'
                  }`}>
                  {v && <span style={{ background: c.dot }} className="w-1.5 h-1.5 rounded-full shrink-0" />}
                  {c.label}
                </button>
              ))}
            </div>

            {nbActifs > 0 && (
              <button onClick={() => { setCategorie(''); setStatut(''); setSearch(''); }}
                className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1.5">
                <X size={12} /> Effacer filtres
              </button>
            )}
          </div>
        )}

        {/* Grille */}
        {loading ? (
          <div className="flex flex-col items-center py-24 text-slate-400">
            <Loader2 className="animate-spin text-blue-600 mb-3" size={36} />
            <p className="text-sm font-bold">Chargement...</p>
          </div>
        ) : filtres.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
            <AlertCircle className="text-slate-300 mx-auto mb-4" size={40} />
            <p className="text-slate-500 font-bold">Aucun signalement ne correspond.</p>
            <button onClick={() => { setCategorie(''); setStatut(''); setSearch(''); }}
              className="mt-4 text-blue-600 font-bold text-sm hover:underline">
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-slate-500 font-medium mb-5">
              {filtres.length} résultat{filtres.length > 1 ? 's' : ''}
              {nbActifs > 0 && <span className="text-blue-600"> (filtrés)</span>}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtres.map(s => (
                <SignalCard key={s.id || s._id} signal={s} onClick={setSelectedReport} />
              ))}
            </div>

            {paginationData.page < paginationData.pages && (
              <div className="flex justify-center mt-10">
                <button onClick={() => fetchSignals(paginationData.page + 1, true)} disabled={loadingMore}
                  className="bg-white border border-slate-200 text-slate-700 px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 flex items-center gap-2 shadow-sm disabled:opacity-50">
                  {loadingMore
                    ? <><Loader2 className="animate-spin" size={16} /> Chargement...</>
                    : <>Voir plus <span className="text-slate-400 font-normal">({paginationData.total - signals.length} restants)</span></>
                  }
                </button>
              </div>
            )}
            <p className="text-center text-xs text-slate-400 mt-5">
              {signals.length} / {paginationData.total} signalements chargés
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default SignalementsPublics;