import React, { useState } from 'react';
import { 
  Send, Phone, MapPin, Mail, ShieldCheck, 
  ChevronRight, AlertCircle, MessageSquare, 
  Lock, Globe, Info
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: 'Signalement',
    message: ''
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20">
      
      {/* --- HEADER --- */}
      <header className="max-w-7xl mx-auto px-6 pt-16 mb-12">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">Contactez-nous</h1>
        <h2 className="text-2xl font-bold text-blue-600 mt-2">Nous sommes à votre écoute</h2>
        <p className="text-slate-500 font-medium mt-4 max-w-2xl leading-relaxed">
          Besoin de parler, de signaler ou d'obtenir du soutien ? Notre équipe est là pour vous, en toute discrétion. 
          Votre sécurité et votre anonymat sont nos priorités absolues.
        </p>
        
        {/* Badge Chiffrement */}
        <div className="mt-8 inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200">
          <ShieldCheck size={14} /> Chiffrement de bout en bout actif
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* --- COLONNE GAUCHE : FORMULAIRE (7 COL) --- */}
        <div className="lg:col-span-7">
          <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-100">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Nom (Optionnel / Alias)</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Anonyme237"
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email (Champ chiffré)</label>
                  <input 
                    type="email" 
                    placeholder="votre@email.cm"
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Sujet de votre message</label>
                <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700 appearance-none">
                  <option>Signalement</option>
                  <option>Demande d'aide psychologique</option>
                  <option>Information juridique</option>
                  <option>Autre</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Votre Message</label>
                <textarea 
                  rows="6"
                  placeholder="Racontez-nous ce qui se passe..."
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all resize-none"
                ></textarea>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-100 active:scale-95">
                <Send size={18} /> Envoyer de manière sécurisée
              </button>
              
              <p className="text-[10px] text-center text-slate-400 font-bold uppercase leading-relaxed px-4">
                En cliquant sur envoyer, vos données sont immédiatement cryptées selon les protocoles de sécurité AES-256.
              </p>
            </form>
          </div>
        </div>

        {/* --- COLONNE DROITE : INFOS & URGENCES (5 COL) --- */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Numéros d'urgence */}
          <div className="bg-[#2D5699] p-8 rounded-[3rem] text-white shadow-xl shadow-blue-100">
            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
              <AlertCircle size={24} /> Numéros d'Urgence
            </h3>
            <div className="space-y-4">
              <EmergencyLink number="117" label="Police" />
              <EmergencyLink number="113" label="Gendarmerie" />
              <EmergencyLink number="119" label="SAMU" />
            </div>
          </div>

          {/* Bureaux Locaux */}
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
              <MapPin className="text-blue-600" size={24} /> Nos Bureaux Locaux
            </h3>
            <div className="space-y-6">
              <OfficeItem 
                city="Yaoundé - Bastos" 
                address="Rue de l'indépendance, Zone 4" 
              />
              <OfficeItem 
                city="Douala - Bonanjo" 
                address="Plateau administratif, Face Palais Justice" 
              />
            </div>
          </div>

          {/* Assistance Numérique */}
          <div className="bg-emerald-100 p-8 rounded-[3rem] border border-emerald-200 flex items-center justify-between group cursor-pointer hover:bg-emerald-200 transition-colors">
            <div>
              <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1">Assistance Numérique</p>
              <p className="text-lg font-black text-emerald-900">contact@voixlibre.cm</p>
            </div>
            <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
              <Mail size={24} />
            </div>
          </div>

        </div>
      </div>

      {/* --- SECTION FAQ / FOOTER INFOS --- */}
      <section className="max-w-7xl mx-auto px-6 mt-24">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-black">Questions Fréquentes</h2>
          <button className="text-blue-600 font-black text-xs uppercase tracking-widest flex items-center gap-2 group">
            Voir toute la FAQ <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard 
            icon={<Lock className="text-blue-500" />} 
            title="Politique de Confidentialité" 
            desc="Comment nous protégeons vos données personnelles et votre identité." 
          />
          <InfoCard 
            icon={<Globe className="text-emerald-500" />} 
            title="Comment ça marche ?" 
            desc="Le parcours d'un signalement, de l'envoi au traitement par nos experts." 
          />
          <InfoCard 
            icon={<Landmark className="text-amber-500" />} 
            title="Cadre Légal au Cameroun" 
            desc="Vos droits et les lois en vigueur concernant la protection des victimes." 
          />
        </div>
      </section>
    </div>
  );
};

// --- SOUS-COMPOSANTS ---

const EmergencyLink = ({ number, label }) => (
  <div className="flex justify-between items-center bg-white/10 p-5 rounded-2xl hover:bg-white/20 transition-colors cursor-pointer border border-white/5">
    <span className="font-bold text-sm uppercase tracking-wider">{label}</span>
    <span className="text-2xl font-black">{number}</span>
  </div>
);

const OfficeItem = ({ city, address }) => (
  <div className="flex gap-4 items-start">
    <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
      <MapPin size={20} />
    </div>
    <div>
      <h4 className="font-black text-slate-900 text-sm">{city}</h4>
      <p className="text-xs text-slate-400 font-medium leading-tight mt-1">{address}</p>
    </div>
  </div>
);

const InfoCard = ({ icon, title, desc }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
    <div className="mb-6 p-4 bg-slate-50 w-fit rounded-2xl group-hover:scale-110 transition-transform">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <h4 className="font-black text-slate-900 mb-3">{title}</h4>
    <p className="text-xs text-slate-500 leading-relaxed font-medium">{desc}</p>
  </div>
);

const Landmark = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7 12 2"/></svg>
);

export default Contact;