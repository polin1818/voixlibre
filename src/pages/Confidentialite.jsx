import React from 'react';
import { 
  ShieldCheck, Lock, Server, Database, 
  EyeOff, Globe, ShieldAlert, CheckCircle2, 
  ArrowRight, Landmark, Cpu 
} from 'lucide-react';

const Confidentialite = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-20">
      
      {/* --- HERO SECTION --- */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 md:pt-24 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full">
            Engagement de Sanctuaire
          </span>
          <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tighter">
            Confidentialité et <br />
            <span className="text-emerald-600 italic font-serif">Souveraineté.</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
            Chez VoixLibre, nous croyons que le silence n'est jamais une solution, 
            mais que la parole ne doit jamais mettre en danger. Notre architecture 
            est conçue comme un sanctuaire numérique pour le Cameroun.
          </p>
        </div>

        <div className="flex-1 relative group">
          <div className="bg-slate-900 rounded-[3rem] p-4 shadow-2xl transform group-hover:rotate-1 transition-transform duration-500">
            <img 
              src="https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=2000&auto=format&fit=crop" 
              alt="Secure Server" 
              className="rounded-[2.5rem] opacity-60 h-[400px] w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="bg-blue-600/20 backdrop-blur-md p-8 rounded-full border border-white/20">
                  <Lock className="w-16 h-16 text-white" />
               </div>
            </div>
          </div>
          {/* Badge flottant */}
          <div className="absolute -bottom-6 -left-6 bg-yellow-400 p-6 rounded-3xl shadow-xl max-w-[200px] border-4 border-white">
            <ShieldCheck className="text-slate-900 mb-2" size={24} />
            <p className="text-[10px] font-black leading-tight uppercase">Chiffrement de bout en bout activé par défaut.</p>
          </div>
        </div>
      </section>

      {/* --- 1. NOTRE ENGAGEMENT --- */}
      <section className="max-w-7xl mx-auto px-6 mt-32">
        <div className="flex justify-between items-end mb-12 border-b border-slate-100 pb-8">
          <div>
            <h2 className="text-2xl font-black flex items-center gap-3">
              <span className="text-blue-600">1.</span> Notre Engagement
            </h2>
          </div>
          <p className="hidden md:block text-[10px] font-bold text-slate-400 max-w-xs text-right uppercase tracking-wider">
            La vie privée n'est pas un luxe, c'est un droit fondamental ancré dans nos valeurs camerounaises.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
            <h3 className="text-2xl font-black mb-4">La Vie Privée comme Droit</h3>
            <p className="text-slate-500 font-medium leading-relaxed mb-8">
              Nous alignons nos protocoles sur les normes les plus strictes de protection des données personnelles, 
              tout en respectant le cadre législatif du MINPOSTEL au Cameroun. Chaque interaction sur VoixLibre 
              est traitée avec la dignité qu'exige la sécurité humaine.
            </p>
            <div className="flex gap-3">
              <Badge text="Normes MINPOSTEL" />
              <Badge text="Éthique Numérique" />
            </div>
          </div>
          <div className="bg-emerald-900 p-10 rounded-[3rem] text-white relative overflow-hidden">
            <HeartPulse className="absolute -right-8 -top-8 w-32 h-32 opacity-10" />
            <h3 className="text-2xl font-black mb-4">Sanctuaire</h3>
            <p className="text-emerald-100/80 text-sm leading-relaxed">
              Un espace où la vulnérabilité est protégée par une architecture robuste. Aucun œil tiers, aucune intrusion.
            </p>
            <div className="mt-12 inline-flex items-center gap-2 font-bold text-xs uppercase tracking-widest bg-white/10 p-3 rounded-xl">
              <CheckCircle2 size={16} /> Protection Active
            </div>
          </div>
        </div>
      </section>

      {/* --- 2 & 3. DONNÉES & SÉCURITÉ LOCALE --- */}
      <section className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Vos Données */}
        <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-blue-600 p-3 rounded-2xl text-white"><Database size={20} /></div>
            <h2 className="text-xl font-black">2. Vos Données</h2>
          </div>
          <ul className="space-y-8">
            <FeatureItem 
              icon={<Lock size={18} />} 
              title="Chiffrement de bout en bout" 
              desc="Seuls vous et le destinataire final pouvez lire les messages. Même VoixLibre n'a pas accès."
            />
            <FeatureItem 
              icon={<Globe size={18} />} 
              title="Souveraineté Camerounaise" 
              desc="Nos serveurs sont localisés stratégiquement pour garantir que les données restent sous protection locale."
            />
          </ul>
        </div>

        {/* Sécurité Locale */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-amber-500 p-3 rounded-2xl text-white"><MapPin size={20} /></div>
            <h2 className="text-xl font-black">3. Sécurité Locale</h2>
          </div>
          <p className="text-sm text-slate-500 mb-8 font-medium">
            Dans le contexte camerounais, signaler des violences nécessite une prudence extrême. 
            Nous intégrons des mesures de protection spécifiques :
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="p-5 bg-slate-50 rounded-2xl border-l-4 border-amber-500">
                <p className="text-[10px] font-black uppercase text-amber-600 mb-1">Anonymat Total</p>
                <p className="text-[11px] font-bold text-slate-700 leading-tight">Option de signalement sans compte.</p>
             </div>
             <div className="p-5 bg-slate-50 rounded-2xl border-l-4 border-emerald-500">
                <p className="text-[10px] font-black uppercase text-emerald-600 mb-1">Effacement Auto</p>
                <p className="text-[11px] font-bold text-slate-700 leading-tight">Logs supprimés toutes les 24 heures.</p>
             </div>
          </div>
        </div>
      </section>

      {/* --- 4. VOS DROITS --- */}
      <section className="max-w-7xl mx-auto px-6 mt-12">
        <div className="bg-blue-600 p-12 rounded-[4rem] text-white flex flex-col lg:flex-row gap-12 items-center shadow-2xl shadow-blue-200">
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl font-black">4. Vos Droits, Votre Pouvoir</h2>
            <p className="text-blue-100 font-medium">Vous conservez la pleine propriété de vos informations. À tout moment, vous pouvez :</p>
            <ul className="space-y-3">
              {['Accéder à l’intégralité de vos données stockées', 'Demander la rectification immédiate d’une information', 'Exiger la suppression définitive et irréversible'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold">
                  <div className="w-1.5 h-1.5 bg-blue-300 rounded-full" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full lg:w-auto bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 text-center">
            <p className="text-sm font-black mb-4">Besoin de plus de clarté ?</p>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all w-full">
              Consulter la FAQ Sécurité
            </button>
            <p className="text-[9px] mt-4 opacity-60 font-bold uppercase tracking-tighter">Contacter le Délégué à la Protection (DPO)</p>
          </div>
        </div>
      </section>

      {/* --- STATS FINALES --- */}
      <section className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard value="99.9%" label="Uptime de sécurité" icon={<ShieldCheck className="text-emerald-500" />} />
        <StatCard value="256-bit" label="Grade Militaire AES" icon={<Lock className="text-blue-500" />} />
        <StatCard value="0" label="Données Vendues" icon={<ShieldAlert className="text-amber-500" />} />
      </section>

    </div>
  );
};

// --- SOUS-COMPOSANTS ---

const Badge = ({ text }) => (
  <span className="px-4 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
    {text}
  </span>
);

const FeatureItem = ({ icon, title, desc }) => (
  <li className="flex gap-5 items-start">
    <div className="text-blue-600 mt-1">{icon}</div>
    <div>
      <h4 className="font-black text-slate-900 text-sm mb-1">{title}</h4>
      <p className="text-xs text-slate-500 leading-relaxed font-medium">{desc}</p>
    </div>
  </li>
);

const StatCard = ({ value, label, icon }) => (
  <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-xl transition-all duration-300">
    <div className="mb-4 bg-white p-4 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <p className="text-3xl font-black text-slate-900">{value}</p>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{label}</p>
  </div>
);

const HeartPulse = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>
);

const MapPin = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);

export default Confidentialite;