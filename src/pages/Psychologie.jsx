import React, { useState, useEffect } from 'react';
import { 
  Headphones, Phone, Star, AlertCircle, 
  Sparkles, Wind, Mic, User, Brain, CloudRain, ShieldCheck,
  MessageCircle, Play, Moon, Zap, FileText, Eye, Download, BookOpen
} from 'lucide-react';

const Psychologie = () => {
  const [therapeutes, setTherapeutes] = useState([]);
  const [ressources, setRessources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Récupération des ressources
        const resRessources = await fetch('http://localhost:5000/api/ressources');
        const dataRessources = await resRessources.json();
        
        if (dataRessources.success || dataRessources.succes) {
          const rawItems = dataRessources.data?.ressources || dataRessources.data || [];
          // On accepte audio, exercice (PDF) et article
          const filteredTools = Array.isArray(rawItems) 
            ? rawItems.filter(r => ['audio', 'exercice', 'article'].includes(r.type))
            : [];
          setRessources(filteredTools);
        }

        // 2. Récupération des thérapeutes
        const resTherapeutes = await fetch('http://localhost:5000/api/bien-etre');
        const dataTherapeutes = await resTherapeutes.json();
        
        if (dataTherapeutes.success || dataTherapeutes.succes) {
          const listT = dataTherapeutes.data?.therapeutes || dataTherapeutes.data || [];
          setTherapeutes(Array.isArray(listT) ? listT : []);
        }

      } catch (err) {
        console.error("Erreur VoixLibre:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- LOGIQUE ACTIONS ---

  const handleStartResource = (ressource) => {
    const targetUrl = ressource.url_media || ressource.lien;

    if (targetUrl) {
      // Pour les PDF, on force parfois l'ouverture propre ou le téléchargement
      // Mais window.open suffit généralement pour que le navigateur utilise son lecteur PDF
      window.open(targetUrl, '_blank');
    } else {
      alert(`Contenu indisponible : ${ressource.titre}.`);
    }
  };

  const handleWhatsApp = (t) => {
    const phone = t.telephone?.replace(/\s+/g, '') || "237600000000";
    const msg = encodeURIComponent(`Bonjour ${t.nom}, je souhaite prendre rendez-vous via VoixLibre.`);
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  // Map des icônes basée sur le TYPE de la ressource si l'icon_name est absent
  const getIcon = (ressource) => {
    if (ressource.type === 'audio') return <Headphones size={22} className="text-blue-600"/>;
    if (ressource.type === 'exercice') return <FileText size={22} className="text-emerald-600"/>;
    if (ressource.type === 'article') return <BookOpen size={22} className="text-amber-600"/>;
    return <Sparkles size={22} className="text-slate-600"/>;
  };

  return (
    <div className="min-h-screen bg-[#FDFEFF]">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold mb-6 uppercase">
              <Sparkles size={14} /> Votre bien-être est une priorité
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-[1.1]">
              Prenez soin de <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">votre esprit.</span>
            </h1>
            <p className="text-slate-600 text-lg mb-10 font-medium">
              Espace confidentiel pour retrouver l'équilibre. Accédez à nos outils d'auto-soin et au soutien de nos experts.
            </p>
          </div>
          <div className="hidden lg:block">
            <img 
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop" 
              className="rounded-[3rem] shadow-2xl w-full aspect-square object-cover -rotate-2 hover:rotate-0 transition-all duration-500"
              alt="Zen"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* --- SIDEBAR --- */}
        <aside className="lg:col-span-4 space-y-10">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl text-left">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center animate-pulse">
                <AlertCircle size={22} className="text-white" />
              </div>
              <h3 className="font-bold text-xl">Urgences</h3>
            </div>
            <EmergencyLink label="Police Secours" number="17" />
            <EmergencyLink label="Gendarmerie" number="1730" />
            <EmergencyLink label="SAMU" number="15" />
          </div>

          <div className="bg-emerald-50/50 p-10 rounded-[2.5rem] text-center border border-emerald-100/60">
             <h3 className="text-emerald-900 font-bold text-xl mb-6">Pause Respiration</h3>
             <BreathingCircle />
          </div>
        </aside>

        {/* --- CONTENU PRINCIPAL --- */}
        <main className="lg:col-span-8 space-y-20 text-left">
          
          <section>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Outils d'auto-soin</h2>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{ressources.length} disponibles</span>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1,2].map(i => <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-[2.5rem]"></div>)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ressources.map((r) => (
                  <ResourceCard 
                    key={r._id}
                    icon={getIcon(r)} 
                    title={r.titre} 
                    desc={r.description} 
                    type={r.type}
                    duree={r.duree}
                    onStart={() => handleStartResource(r)}
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Thérapeutes certifiés</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {therapeutes.map((t) => (
                <TherapistCard 
                  key={t._id}
                  t={t} 
                  onContact={() => handleWhatsApp(t)}
                />
              ))}
            </div>
          </section>

          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex items-center gap-6">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 shrink-0">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Confidentialité garantie</h4>
                <p className="text-slate-500 text-sm">Échanges sécurisés et anonymat respecté.</p>
              </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// --- COMPOSANTS INTERNES ---

const ResourceCard = ({ icon, title, desc, type, duree, onStart }) => {
  // Configurer le bouton en fonction du type
  const getButtonConfig = () => {
    switch(type) {
      case 'audio':
        return { label: "ÉCOUTER LA SÉANCE", icon: <Play size={14} fill="currentColor" />, color: "bg-blue-600" };
      case 'exercice':
        return { label: "VOIR LE PDF", icon: <Eye size={14} />, color: "bg-emerald-600" };
      case 'article':
        return { label: "LIRE L'ARTICLE", icon: <BookOpen size={14} />, color: "bg-amber-600" };
      default:
        return { label: "DÉCOUVRIR", icon: <Zap size={14} />, color: "bg-slate-900" };
    }
  };

  const btn = getButtonConfig();

  return (
    <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 group hover:border-slate-200 transition-all shadow-sm flex flex-col h-full text-left">
      <div className="flex justify-between items-start mb-5">
        <div className="bg-slate-50 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300">
          {icon}
        </div>
        <div className="flex flex-col items-end gap-1">
            <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                type === 'audio' ? 'bg-blue-50 text-blue-600' : 
                type === 'exercice' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
            }`}>
                {type === 'exercice' ? 'Document PDF' : type}
            </span>
            {duree && (
                <span className="text-[10px] font-bold text-slate-400">
                {duree}
                </span>
            )}
        </div>
      </div>
      
      <h4 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">{title}</h4>
      <p className="text-slate-500 text-xs leading-relaxed mb-8 flex-grow line-clamp-3 italic">"{desc}"</p>
      
      <button 
        onClick={onStart}
        className={`w-full flex items-center justify-center gap-3 py-4 text-white rounded-2xl font-bold text-xs transition-all active:scale-95 shadow-lg shadow-transparent hover:shadow-slate-200 ${btn.color}`}
      >
        {btn.icon}
        {btn.label}
      </button>
    </div>
  );
};

// ... (Garder TherapistCard, EmergencyLink et BreathingCircle identiques au code précédent)

const TherapistCard = ({ t, onContact }) => (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow text-left">
      <div className="flex items-center gap-4 mb-5">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden border border-slate-50 shadow-inner">
          <img 
              src={t.photo || `https://ui-avatars.com/api/?name=${t.nom || "Expert"}&background=random`} 
              alt={t.nom} 
              className="w-full h-full object-cover" 
              onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${t.nom || "Expert"}&background=random` }}
          />
        </div>
        <div>
          <h4 className="font-bold text-slate-900">{t.nom}</h4>
          <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest">{t.specialite || "Psychologue"}</p>
          <div className="flex items-center gap-1 text-amber-500 mt-0.5">
            <Star size={12} fill="currentColor" />
            <span className="text-[10px] font-bold text-slate-500">4.9</span>
          </div>
        </div>
      </div>
      <p className="text-slate-500 text-xs leading-relaxed mb-6 line-clamp-2 italic">
          "{t.bio || "À votre écoute pour un accompagnement bienveillant et professionnel."}"
      </p>
      <button 
          onClick={onContact}
          className="mt-auto flex items-center justify-center gap-2 py-3.5 bg-green-50 text-green-600 border border-green-100 rounded-xl font-bold text-xs hover:bg-green-600 hover:text-white transition-all active:scale-95"
      >
        <MessageCircle size={16} /> PRENDRE RENDEZ-VOUS
      </button>
    </div>
);

const EmergencyLink = ({ label, number }) => (
    <a href={`tel:${number}`} className="group bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex justify-between items-center transition-all cursor-pointer mb-3 decoration-none block text-left">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{label}</p>
        <p className="text-2xl font-black text-white">{number}</p>
      </div>
      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all">
        <Phone size={18} className="text-white" />
      </div>
    </a>
);

const BreathingCircle = () => {
    const [phase, setPhase] = useState('Inspirez...');
    useEffect(() => {
      const interval = setInterval(() => {
        setPhase(prev => prev === 'Inspirez...' ? 'Expirez...' : 'Inspirez...');
      }, 4000);
      return () => clearInterval(interval);
    }, []);
    return (
      <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center border-4 border-white shadow-lg transition-all duration-[4000ms] ease-in-out ${phase === 'Inspirez...' ? 'scale-110 bg-emerald-200' : 'scale-90 bg-emerald-100'}`}>
        <span className="text-emerald-900 font-bold text-xs">{phase}</span>
      </div>
    );
};

export default Psychologie;