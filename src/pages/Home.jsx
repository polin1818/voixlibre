import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';
import AnimatedNumber from '../components/AnimatedNumber';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import {
  Shield, AlertCircle, ArrowRight, CheckCircle, Lock,
  EyeOff, Search, HeartPulse, Scale, Phone, Share2,
  MapPin, Calendar, ChevronLeft, ChevronRight, X, Tag, FileText, ImageOff
} from 'lucide-react';

const CAT_CONFIG = {
  violence_physique:  { label: 'Violence physique',  color: 'bg-red-100 text-red-700',      dot: '#dc2626' },
  violence_conjugale: { label: 'Violence conjugale', color: 'bg-pink-100 text-pink-700',     dot: '#db2777' },
  harcelement:        { label: 'Harcèlement',        color: 'bg-orange-100 text-orange-700', dot: '#ea580c' },
  cyber_harcelement:  { label: 'Cyber-harcèlement',  color: 'bg-violet-100 text-violet-700', dot: '#7c3aed' },
  abus_enfant:        { label: 'Abus enfant',        color: 'bg-purple-100 text-purple-700', dot: '#9333ea' },
  agression_sexuelle: { label: 'Agression sexuelle', color: 'bg-rose-100 text-rose-700',     dot: '#e11d48' },
  corruption:         { label: 'Corruption',         color: 'bg-yellow-100 text-yellow-700', dot: '#ca8a04' },
  kidnapping:         { label: 'Kidnapping',         color: 'bg-red-200 text-red-800',       dot: '#b91c1c' },
  menace_mort:        { label: 'Menace de mort',     color: 'bg-red-100 text-red-700',       dot: '#dc2626' },
  discrimination:     { label: 'Discrimination',     color: 'bg-blue-100 text-blue-700',     dot: '#2563eb' },
  autre:              { label: 'Autre',              color: 'bg-slate-100 text-slate-700',   dot: '#64748b' },
};

const STATUT_CONFIG = {
  nouveau:            { label: 'Nouveau',   color: 'bg-blue-50 text-blue-700 border-blue-200' },
  en_cours:           { label: 'En cours',  color: 'bg-amber-50 text-amber-700 border-amber-200' },
  transfere_autorite: { label: 'Transféré', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  traite:             { label: 'Traité ✓',  color: 'bg-green-50 text-green-700 border-green-200' },
  classe:             { label: 'Classé',    color: 'bg-slate-50 text-slate-700 border-slate-200' },
};

// ── Numéro de contact : signalant (si accepté) ou 117 par défaut ──
const getContactNumber = (telephone, accepterAppel) => {
  if (telephone && accepterAppel === true) {
    const cleaned = telephone.replace(/\s/g, '');
    return { num: cleaned, label: 'Contacter le signalant', isDefault: false };
  }
  return { num: '117', label: 'Police Secours', isDefault: true };
};

// ── Image robuste avec fallback ────────────────────────────────────
const RobustImage = ({ src, alt = '', className = '', fallbackClass = '' }) => {
  const [state, setState] = useState(src ? 'loading' : 'empty');

  useEffect(() => { setState(src ? 'loading' : 'empty'); }, [src]);

  if (state === 'error' || state === 'empty') {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 to-slate-200 ${fallbackClass || className}`}>
        <ImageOff className="text-slate-300" size={32} />
        <span className="text-xs text-slate-400 font-medium">Aucune image</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onLoad={() => setState('loaded')}
      onError={() => setState('error')}
      style={state === 'loading' ? { opacity: 0.5 } : { opacity: 1 }}
    />
  );
};

// ── Modal Détail ───────────────────────────────────────────────────
const DetailModal = ({ report, onClose }) => {
  if (!report) return null;
  const cat     = CAT_CONFIG[report.categorie]  || { label: 'Autre', color: 'bg-slate-100 text-slate-700' };
  const statut  = STATUT_CONFIG[report.statut]  || STATUT_CONFIG.nouveau;
  const contact = getContactNumber(report.telephone, report.accepterAppel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>

        {/* Image */}
        <div className="h-56 relative rounded-t-[2.5rem] overflow-hidden">
          <RobustImage
            src={report.image}
            alt="Preuve"
            className="w-full h-full object-cover"
            fallbackClass="w-full h-full"
          />
          <button onClick={onClose} className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow hover:bg-red-50 hover:text-red-500 transition-colors z-10">
            <X size={18} />
          </button>
          <span className={`absolute top-4 left-4 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider border ${cat.color}`}>
            {cat.label}
          </span>
        </div>

        <div className="p-7">
          {/* Statut + code */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${statut.color}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />{statut.label}
            </span>
            <span className="font-mono text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full font-bold tracking-wider">
              {report.codesuivi}
            </span>
          </div>

          {/* Description */}
          <div className="mb-5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText size={11} /> Description
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
            <a
              href={`tel:${contact.num}`}
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

          {/* Urgences secondaires si numéro perso affiché */}
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

// ── Carte carrousel ────────────────────────────────────────────────
const ReportCard = ({ report, onClick }) => {
  const cat     = CAT_CONFIG[report.categorie]  || { label: 'Autre', color: 'bg-slate-100 text-slate-700' };
  const statut  = STATUT_CONFIG[report.statut]  || STATUT_CONFIG.nouveau;
  const contact = getContactNumber(report.telephone, report.accepterAppel);

  return (
    <div onClick={() => onClick(report)}
      className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col w-[300px] shrink-0 snap-start">

      {/* Image robuste */}
      <div className="h-44 relative overflow-hidden">
        <RobustImage
          src={report.image}
          alt="Signalement"
          className="w-full h-full object-cover"
          fallbackClass="w-full h-full"
        />
        <span className={`absolute top-3 left-3 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${cat.color}`}>
          {cat.label}
        </span>
        <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full border ${statut.color}`}>
          {statut.label}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <p className="text-sm font-black text-slate-900 line-clamp-2 mb-2 leading-snug">{report.titre}</p>

        <div className="space-y-1.5 mb-3 flex-grow">
          {report.lieu && report.lieu.trim() !== ',' && (
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <MapPin size={11} className="text-blue-500 shrink-0" />
              <span className="truncate">{report.lieu}</span>
            </div>
          )}
          {/* Date */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Calendar size={11} className="text-blue-500 shrink-0" />
            {report.date}
          </div>
          {/* Statut visible sous la date */}
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${statut.color}`}>
              <span className="w-1 h-1 rounded-full bg-current" />
              {statut.label}
            </span>
          </div>
        </div>

        {/* Bouton contact : numéro signalant (si accepté) ou 117 */}
        <a
          href={`tel:${contact.num}`}
          onClick={e => e.stopPropagation()}
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

// ── Skeleton ───────────────────────────────────────────────────────
const CardSkeleton = () => (
  <div className="w-[300px] shrink-0 bg-white rounded-[2rem] border border-slate-100 h-[380px] animate-pulse">
    <div className="h-44 bg-slate-100 rounded-t-[2rem]" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-slate-100 rounded w-3/4" />
      <div className="h-3 bg-slate-100 rounded w-1/2" />
      <div className="h-3 bg-slate-100 rounded w-1/3" />
      <div className="h-10 bg-slate-100 rounded mt-4" />
    </div>
  </div>
);

// ── Home ───────────────────────────────────────────────────────────
const Home = () => {
  const [stats, setStats]                   = useState(null);
  const [recentReports, setRecentReports]   = useState([]);
  const [loading, setLoading]               = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const scrollRef     = useRef(null);
  const autoScrollRef = useRef(null);

  useEffect(() => {
    apiClient.get('/signalements/stats').then(res => setStats(res.data.data)).catch(console.error);
    apiClient.get('/signalements/public?limit=8')
      .then(res => { setRecentReports(res.data.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!recentReports.length) return;
    autoScrollRef.current = setInterval(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
      }
    }, 3500);
    return () => clearInterval(autoScrollRef.current);
  }, [recentReports]);

  const pauseAutoScroll = () => clearInterval(autoScrollRef.current);
  const scrollLeft  = () => { pauseAutoScroll(); scrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' }); };
  const scrollRight = () => { pauseAutoScroll(); scrollRef.current?.scrollBy({ left:  320, behavior: 'smooth' }); };

  const pieData = stats?.parCategorie?.slice(0, 4).map((c, i) => ({
    name: CAT_CONFIG[c._id]?.label || c._id,
    value: c.count,
    color: ['#2563eb','#e11d48','#f59e0b','#10b981'][i],
  })) || [
    { name: 'Harcèlement',        value: 400, color: '#2563eb' },
    { name: 'Violence Conjugale', value: 300, color: '#e11d48' },
    { name: 'Corruption',         value: 200, color: '#f59e0b' },
    { name: 'Autre',              value: 100, color: '#10b981' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {selectedReport && <DetailModal report={selectedReport} onClose={() => setSelectedReport(null)} />}

      {/* 1. HERO */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#ECFDF5] border border-[#A7F3D0] px-4 py-1 rounded-full text-[#059669] text-sm font-semibold mb-6">
              <EyeOff size={16} /> Espace Sécurisé & Anonyme
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tighter text-slate-950 leading-[1.1]">
              Vous n'êtes plus seul,<br />
              <span className="text-blue-600">votre voix compte.</span>
            </h1>
            <p className="text-slate-600 text-lg max-w-xl mb-10 leading-relaxed">
              VoixLibre est votre sanctuaire numérique au Cameroun. Signalez une violence, trouvez du soutien. 100% chiffré, 100% protégé.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signalement" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20">
                <AlertCircle size={20} /> Signaler une violence
              </Link>
              <Link to="/suivi" className="bg-[#E2E8F0] hover:bg-[#CBD5E1] text-slate-900 px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                <Search size={19} /> Suivre un dossier
              </Link>
            </div>
          </div>
          <div className="bg-slate-950 aspect-[4/5] rounded-3xl p-4 shadow-2xl transform rotate-2 hidden md:block overflow-hidden">
            <img src="https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?q=80&w=600&auto=format&fit=crop" alt="Sanctuary" className="w-full h-full object-cover rounded-2xl opacity-80" />
          </div>
        </div>
      </section>

      {/* 2. URGENCES */}
      <section className="py-12 px-6 md:px-12 bg-[#F1F5F9]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight mb-8">Urgences Immédiates (Cameroun)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Shield className="text-blue-600"/>,    num:'117', title:'Police Secours',  desc:'Danger immédiat.',     border:'border-blue-200',    bg:'bg-blue-50/50'    },
              { icon: <HeartPulse className="text-red-600"/>, num:'119', title:'SAMU',            desc:'Urgences médicales.',  border:'border-red-200',     bg:'bg-red-50/50'     },
              { icon: <Phone className="text-amber-600"/>,    num:'113', title:'Gendarmerie',     desc:'Sécurité publique.',   border:'border-amber-200',   bg:'bg-amber-50/50'   },
              { icon: <Lock className="text-emerald-600"/>,   num:'116', title:'Enfance Danger',  desc:'Signalement anonyme.', border:'border-emerald-200', bg:'bg-emerald-50/50' },
            ].map(c => (
              <a key={c.num} href={`tel:${c.num}`}
                className={`p-6 rounded-[2rem] border ${c.border} ${c.bg} shadow-sm flex items-start gap-4 bg-white transition-all hover:shadow-md hover:scale-[1.02]`}>
                <div className="p-2 bg-white rounded-lg shadow-sm">{c.icon}</div>
                <div className="flex-grow">
                  <p className="text-3xl font-black text-slate-950">{c.num}</p>
                  <p className="font-bold text-slate-900 text-sm">{c.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{c.desc}</p>
                </div>
                <Phone size={16} className="text-slate-400 mt-1 shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ALERTES COMMUNAUTAIRES */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-slate-950 tracking-tight">Alertes Communautaires</h2>
              <p className="text-slate-500 font-medium mt-1">
                {loading ? 'Chargement...' : `${recentReports.length} alertes récentes`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={scrollLeft}  className="p-2.5 bg-slate-100 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors"><ChevronLeft  size={20} /></button>
              <button onClick={scrollRight} className="p-2.5 bg-slate-100 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors"><ChevronRight size={20} /></button>
              <Link to="/signalements" className="bg-slate-900 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2">
                Voir tout <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div ref={scrollRef} onMouseEnter={pauseAutoScroll}
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth:'none', msOverflowStyle:'none' }}>
            {loading
              ? [1,2,3,4].map(i => <CardSkeleton key={i} />)
              : recentReports.length > 0
                ? recentReports.map(r => <ReportCard key={r.id || r._id} report={r} onClick={setSelectedReport} />)
                : (
                  <div className="w-full text-center py-16 text-slate-400">
                    <AlertCircle className="mx-auto mb-3" size={32} />
                    <p className="font-bold">Aucun signalement pour le moment.</p>
                    <Link to="/signalement" className="text-blue-600 font-bold text-sm mt-2 inline-block hover:underline">Soyez le premier à signaler</Link>
                  </div>
                )
            }
          </div>

          {recentReports.length > 0 && (
            <>
              <div className="flex justify-center gap-1.5 mt-4">
                {recentReports.map((_, i) => <span key={i} className="w-1.5 h-1.5 rounded-full bg-slate-300" />)}
              </div>
              <div className="flex justify-center mt-8">
                <Link to="/signalements" className="bg-white border-2 border-slate-200 text-slate-700 px-8 py-3.5 rounded-2xl font-bold hover:border-blue-500 hover:text-blue-600 transition-all flex items-center gap-2 shadow-sm">
                  Voir tous les signalements <ArrowRight size={18} />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 4. FORUM & OUTILS */}
      <section className="py-16 px-6 md:px-12 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-[#064E3B] text-white p-10 rounded-[3rem] flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-block bg-white/10 px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-widest">Communauté</div>
              <h3 className="text-4xl font-extrabold mb-5 tracking-tighter leading-tight">Forum : Un espace d'écoute</h3>
              <p className="text-emerald-200 text-lg max-w-lg mb-12 leading-relaxed">
                Partagez anonymement et recevez le soutien de ceux qui ont traversé les mêmes épreuves.
              </p>
            </div>
            <Link to="/forum" className="bg-white text-emerald-900 px-8 py-3 rounded-xl font-bold self-start hover:bg-emerald-50 flex items-center gap-2 relative z-10">
              Accéder au forum <ArrowRight size={19} />
            </Link>
          </div>
          <div className="space-y-6">
            <Link to="/suivi" className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-all group">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><Search size={24}/></div>
              <div className="flex-grow"><h4 className="font-bold text-slate-950">Suivre un Dossier</h4><p className="text-sm text-slate-500">Consultez l'avancement.</p></div>
              <ArrowRight className="text-slate-400 group-hover:text-blue-500" size={20}/>
            </Link>
            <Link to="/psychologie" className="bg-[#FEF3C7] p-6 rounded-3xl border border-[#FDE68A] flex items-center gap-5 hover:bg-[#FDE68A] transition-all group">
              <div className="p-3 bg-white/60 rounded-xl text-amber-700"><HeartPulse size={24}/></div>
              <div className="flex-grow"><h4 className="font-bold text-slate-950">Aide Psychologique</h4><p className="text-sm text-amber-900/70">Ressources immédiates.</p></div>
              <ArrowRight className="text-amber-400 group-hover:translate-x-1 transition-transform" size={20}/>
            </Link>
            <div className="bg-[#DBEAFE] p-6 rounded-3xl border border-[#BFDBFE] flex items-center gap-5">
              <div className="p-3 bg-white/60 rounded-xl text-blue-700"><Scale size={24}/></div>
              <div className="flex-grow"><h4 className="font-bold text-slate-950">Conseil Juridique</h4><p className="text-sm text-blue-900/70">Connaître vos droits.</p></div>
              <ArrowRight className="text-blue-400" size={20}/>
            </div>
          </div>
        </div>
      </section>

      {/* 5. STATS */}
      <section className="py-12 px-6 md:px-12 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight mb-10 flex items-center gap-3">
            <div className="p-2.5 bg-slate-100 rounded-xl"><AlertCircle size={22} /></div>
            Analyse des Signalements
          </h2>
          <div className="h-80 bg-slate-50 rounded-[2.5rem] p-6 border border-slate-100">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                  {pieData.map((e, i) => <Cell key={i} fill={e.color} stroke="none" />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius:'12px', border:'none', boxShadow:'0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* 6. IMPACT */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-slate-950 mb-16 tracking-tighter">Notre Impact au 237</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ImpactCard title="Signalements"  value={stats?.totalGeneral || 0} bgColor="bg-white" />
            <ImpactCard
              title="Cas Traités"
              value={stats?.traite || 0}
              bgColor="bg-emerald-100"
              textColor="text-emerald-900"
              icon={<CheckCircle className="text-emerald-500 w-12 h-12" />}
            />
            <ImpactCard title="Ce mois" value={stats?.totalMois || 0} bgColor="bg-white" />
          </div>
        </div>
      </section>
    </div>
  );
};

const ImpactCard = ({ title, value, bgColor, textColor = 'text-slate-950', icon }) => (
  <div className={`${bgColor} p-10 rounded-[3rem] border border-slate-100 shadow-lg flex flex-col items-center justify-center relative overflow-hidden hover:-translate-y-1 transition-transform`}>
    {icon && <div className="absolute top-4 right-4 opacity-10">{icon}</div>}
    <p className={`text-5xl font-black ${textColor} mb-2`}><AnimatedNumber value={value} /></p>
    <p className={`text-xs uppercase font-bold tracking-widest opacity-60 ${textColor}`}>{title}</p>
  </div>
);

export default Home;