import React, { useState } from 'react';
import { 
  Phone, ShieldCheck, HeartHandshake, FileText, 
  ChevronDown, ChevronUp, Trash2, Globe, 
  AlertTriangle, Users, MapPin, Zap, EyeOff
} from 'lucide-react';
const Aide = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-20">
      
      {/* --- HERO SECTION --- */}
      <section className="bg-blue-600 pt-20 pb-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Aide & Support Cameroun
          </h1>
          <p className="text-blue-100 text-lg font-medium max-w-2xl leading-relaxed">
            Vous n'êtes pas seul. VoixLibre est votre sanctuaire numérique pour obtenir du soutien, 
            signaler des incidents en toute sécurité et accéder aux ressources locales au Cameroun.
          </p>
        </div>
        {/* Motif de bouclier en arrière-plan */}
        <div className="absolute right-0 top-0 w-1/3 h-full bg-white/5 flex items-center justify-center">
            <HeartHandshake size={300} className="text-white/10" />
        </div>
      </section>

      {/* --- COMMENT ÇA MARCHE --- */}
      <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <h2 className="text-2xl font-black text-white md:text-slate-900 mb-8 ml-2">Comment ça marche</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProcessCard 
            step="1" icon={<FileText />} title="Témoignage" 
            desc="Remplissez notre formulaire sécurisé. Vous pouvez rester anonyme ou fournir vos coordonnées pour un suivi." 
          />
          <ProcessCard 
            step="2" icon={<ShieldCheck />} title="Cryptage" 
            desc="Vos données sont immédiatement cryptées de bout en bout. Seuls les experts habilités peuvent les lire." 
          />
          <ProcessCard 
            step="3" icon={<HeartHandshake />} title="Accompagnement" 
            desc="Nous vous mettons en relation avec des ONG locales partenaires ou des conseils juridiques adaptés." 
          />
        </div>
      </section>

      {/* --- NUMÉROS D'URGENCE & CARTE --- */}
      <section className="max-w-7xl mx-auto px-6 mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Côté Gauche : Numéros */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <h2 className="text-3xl font-black mb-2">Numéros d'Urgence</h2>
            <p className="text-slate-500 font-medium">Accessibles 24h/24 sur tout le territoire.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <EmergencyBox number="117" label="Police Secours" desc="Ligne nationale" color="bg-blue-600" />
            <EmergencyBox number="113" label="Gendarmerie" desc="Gendarmerie Royale" color="bg-blue-800" />
            <EmergencyBox number="119" label="SAMU" desc="Urgence Médicale" color="bg-emerald-600" />
            <EmergencyBox number="911" label="Ligne d'Écoute" desc="Soutien Psychologique" color="bg-amber-700" />
          </div>

          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
            <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2">
              <Users className="text-blue-600" size={20} /> ONG & Partenaires Locaux
            </h3>
            <div className="space-y-4">
              <PartnerRow name="ALVF (Extrême-Nord)" loc="Douala/Yaoundé" />
              <PartnerRow name="Réseau More Women in Politics" loc="National" />
              <PartnerRow name="Cameroon Women's Rights" loc="Buéa" />
            </div>
          </div>
        </div>

        {/* Côté Droit : Carte Cameroun */}
        <div className="lg:col-span-7 h-full min-h-[500px]">
          <div className="bg-slate-900 rounded-[3rem] h-full w-full relative overflow-hidden shadow-2xl group">
            <img 
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2000&auto=format&fit=crop" 
              alt="Cameroon Topography" 
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-[5s]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
              <div className="flex items-center gap-3 text-white">
                <MapPin size={20} className="text-blue-400" />
                <p className="font-bold text-sm">Couverture nationale incluant les zones rurales.</p>
              </div>
            </div>
            {/* Overlay décoratif Cameroun Shape (Simulé ici par un icône globe) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Globe className="text-white/5 w-64 h-64" />
            </div>
          </div>
        </div>
      </section>

      {/* --- SÉCURITÉ NUMÉRIQUE --- */}
      <section className="max-w-7xl mx-auto px-6 mt-24">
        <div className="bg-emerald-100 rounded-[3.5rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 border border-emerald-200">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-200/50 w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
              <Zap size={14} /> Sécurité Numérique
            </div>
            <h2 className="text-4xl font-black text-slate-900">Protégez vos traces</h2>
            <p className="text-emerald-900/70 font-medium leading-relaxed">
              Votre sécurité est notre priorité absolue. Si vous craignez que quelqu'un surveille votre appareil, suivez ces conseils essentiels.
            </p>
            <ul className="space-y-3">
              <SecurityTip text="Utilisez la Navigation Privée (Incognito) pour parcourir ce site." />
              <SecurityTip text="Utilisez le bouton 'Quitter Rapidement' en cas d'interruption." />
              <SecurityTip text="Effacez votre historique de navigation régulièrement." />
            </ul>
          </div>

          <div className="w-full md:w-auto bg-white p-8 rounded-[2.5rem] shadow-xl border border-emerald-100 text-center">
            <div className="bg-emerald-500 w-12 h-12 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
              <EyeOff size={24} />
            </div>
            <h4 className="font-black text-slate-900 mb-2">Accès Anonyme</h4>
            <p className="text-xs text-slate-500 font-medium mb-6 leading-relaxed">
              Nous ne stockons pas d'adresses IP. Vos rapports sont anonymisés par défaut.
            </p>
            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 transition-all active:scale-95">
              <Trash2 size={16} /> Effacer mes traces maintenant
            </button>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="max-w-4xl mx-auto px-6 mt-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900">Questions Fréquentes</h2>
          <p className="text-slate-500 font-medium mt-2">Tout ce que vous devez savoir sur notre processus de soutien.</p>
        </div>
        
        <div className="space-y-4">
          <FaqItem 
            question="Mes données sont-elles partagées avec la police ?"
            answer="Seulement si vous donnez votre consentement explicite. Autrement, nous fournissons uniquement des statistiques globales pour améliorer la sécurité publique."
          />
          <FaqItem 
            question="Est-ce un service gratuit ?"
            answer="Oui, VoixLibre est une plateforme citoyenne 100% gratuite. Nos partenaires ONG offrent également des consultations initiales gratuites."
          />
          <FaqItem 
            question="Puis-je signaler pour quelqu'un d'autre ?"
            answer="Oui. Vous pouvez utiliser le mode 'Tiers' pour signaler un incident dont vous avez été témoin, tout en préservant l'anonymat de la victime si nécessaire."
          />
        </div>
      </section>

    </div>
  );
};

// --- SOUS-COMPOSANTS ---

const ProcessCard = ({ step, icon, title, desc }) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 group hover:translate-y-[-5px] transition-all duration-300">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-blue-600 font-black">
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">{step}. {title}</p>
    </div>
    <p className="text-sm text-slate-500 leading-relaxed font-medium">{desc}</p>
  </div>
);

const EmergencyBox = ({ number, label, desc, color }) => (
  <div className={`${color} p-6 rounded-3xl text-white shadow-lg`}>
    <div className="flex justify-between items-start mb-4">
      <p className="text-3xl font-black">{number}</p>
      <Phone size={16} className="opacity-50" />
    </div>
    <p className="text-xs font-black uppercase tracking-wider">{label}</p>
    <p className="text-[9px] font-bold opacity-60 uppercase">{desc}</p>
  </div>
);

const PartnerRow = ({ name, loc }) => (
  <div className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
    <p className="text-xs font-bold text-slate-700">{name}</p>
    <p className="text-[10px] font-black text-blue-600 uppercase">{loc}</p>
  </div>
);

const SecurityTip = ({ text }) => (
  <li className="flex items-start gap-3 text-sm font-bold text-emerald-900">
    <div className="mt-1"><CheckCircle2 size={16} className="text-emerald-600" /></div>
    {text}
  </li>
);

const CheckCircle2 = ({ size, className }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
);

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-3xl overflow-hidden bg-slate-50 transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex justify-between items-center hover:bg-slate-100 transition-colors"
      >
        <span className="font-black text-slate-900 text-sm md:text-base">{question}</span>
        {isOpen ? <ChevronUp size={20} className="text-blue-600" /> : <ChevronDown size={20} className="text-slate-400" />}
      </button>
      {isOpen && (
        <div className="px-6 pb-6 text-sm font-medium text-slate-500 leading-relaxed animate-in slide-in-from-top-2 duration-300">
          {answer}
        </div>
      )}
    </div>
  );
};

export default Aide;