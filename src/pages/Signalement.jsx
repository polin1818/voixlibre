import React, { useState, useRef, useEffect } from 'react'; 
import apiClient from '../api/client';
import { 
  Send, CheckCircle, Upload, X, Video, MapPin, 
  AlertTriangle, ShieldCheck, Phone, Info, Loader2 
} from 'lucide-react';

const CATEGORIES = [
  { value: 'violence_physique', label: 'Violence Physique' },
  { value: 'violence_conjugale', label: 'Violence Conjugale' },
  { value: 'harcelement', label: 'Harcèlement' },
  { value: 'cyber_harcelement', label: 'Cyber-harcèlement' },
  { value: 'abus_enfant', label: 'Abus enfant' },
  { value: 'agression_sexuelle', label: 'Agression sexuelle' },
  { value: 'corruption', label: 'Corruption' },
  { value: 'kidnapping', label: 'Kidnapping' },
  { value: 'autre', label: 'Autre' },
];

const Signalement = () => {
  const [formData, setFormData] = useState({
    categorie: '',
    description: '',
    adresse: '',
    quartier: '',
    ville: 'Douala',
    dateincident: new Date().toISOString().split('T')[0],
    priorite: 'moyenne',
    telephone: '',
    accepterAppel: false,
    latitude: 4.05,
    longitude: 9.7
  });

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [codeSuivi, setCodeSuivi] = useState(null);
  const [erreur, setErreur] = useState('');
  const fileInputRef = useRef(null);

  // Nettoyage des URLs de prévisualisation
  useEffect(() => {
    return () => previews.forEach(p => URL.revokeObjectURL(p.url));
  }, [previews]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Gestion du téléphone format Cameroun
  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, ''); // Garde uniquement les chiffres
    if (val.startsWith('237')) val = val.substring(3);
    if (val.length > 9) val = val.substring(0, 9);
    setFormData(prev => ({ ...prev, telephone: val }));
  };

  const handleFileChange = (e) => {
    setErreur('');
    const selectedFiles = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 5) return setErreur("Maximum 5 fichiers.");

    const newPreviews = selectedFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      isImage: file.type.startsWith('image'),
    }));

    setFiles(prev => [...prev, ...selectedFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    URL.revokeObjectURL(previews[index].url);
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const recupererLocalisation = () => {
    if (!navigator.geolocation) return setErreur("Géolocalisation non supportée.");
    
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          setFormData(prev => ({
            ...prev,
            latitude,
            longitude,
            adresse: data.display_name || '',
            ville: data.address.city || data.address.town || 'Douala',
            quartier: data.address.suburb || data.address.neighbourhood || ''
          }));
        } catch (err) {
          setFormData(prev => ({ ...prev, latitude, longitude }));
        } finally { setLoading(false); }
      },
      () => { setErreur("Accès localisation refusé."); setLoading(false); }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.description.length < 50) return setErreur("La description est trop courte (min. 50 caractères).");
    
    setLoading(true);
    setErreur('');

    try {
      const data = new FormData();
      
      const localisationObj = {
        adresse: formData.adresse,
        quartier: formData.quartier,
        ville: formData.ville,
        coordonnees: {
          type: 'Point',
          coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)]
        }
      };

      data.append('categorie', formData.categorie);
      data.append('description', formData.description);
      data.append('priorite', formData.priorite);
      data.append('dateincident', formData.dateincident);
      data.append('localisation', JSON.stringify(localisationObj));
      
      if (formData.telephone) {
        data.append('contact', JSON.stringify({
          telephone: `+237${formData.telephone}`,
          accepterAppel: formData.accepterAppel
        }));
      }

      // CORRECTION : On s'assure que 'preuves' est bien le nom attendu par upload.array('preuves')
      files.forEach(file => {
        data.append('preuves', file); 
      });

      // CORRECTION : Ajout explicite des headers pour le multipart
      const res = await apiClient.post('/signalements', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setCodeSuivi(res.data.data.codesuivi);
    } catch (err) {
      setErreur(err.response?.data?.message || "Échec de l'envoi.");
    } finally {
      setLoading(false);
    }
  };

  if (codeSuivi) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-10 bg-white rounded-[3rem] shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Signalement Enregistré</h2>
        <p className="text-slate-500 font-medium mt-2">Conservez précieusement ce code pour suivre l'évolution de votre dossier.</p>
        
        <div className="mt-8 p-6 bg-slate-900 rounded-3xl shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10 text-white"><ShieldCheck size={80}/></div>
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-2">Code de suivi unique</p>
          <p className="text-3xl font-mono font-black text-white tracking-widest">{codeSuivi}</p>
        </div>

        <button 
          onClick={() => window.location.reload()} 
          className="mt-10 w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
        >
          Effectuer un autre signalement
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Signaler un incident</h1>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-2 flex items-center gap-2">
          <ShieldCheck size={14} className="text-blue-600"/> Anonymat et Sécurité Garantis
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Colonne Gauche : Détails */}
        <div className="space-y-6">
          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Info size={14}/> Nature de l'incident
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Catégorie</label>
                <select 
                  name="categorie" required
                  value={formData.categorie} onChange={handleInputChange}
                  className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">Sélectionner...</option>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Description détaillée (min 50 chars)</label>
                <textarea 
                  name="description" required
                  value={formData.description} onChange={handleInputChange}
                  placeholder="Décrivez précisément les faits, les personnes impliquées..."
                  className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 h-40 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Date des faits</label>
                  <input 
                    type="date" name="dateincident"
                    value={formData.dateincident} onChange={handleInputChange}
                    className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Urgence</label>
                  <select 
                    name="priorite"
                    value={formData.priorite} onChange={handleInputChange}
                    className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="basse">Basse</option>
                    <option value="moyenne">Moyenne</option>
                    <option value="haute">Haute</option>
                    <option value="critique">Critique</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Phone size={14}/> Contact (Optionnel)
            </h2>
            <div className="flex items-center bg-slate-50 rounded-2xl px-4">
              <span className="text-sm font-black text-slate-400 border-r border-slate-200 pr-3">+237</span>
              <input 
                type="tel" placeholder="6xx xxx xxx"
                value={formData.telephone} onChange={handlePhoneChange}
                className="w-full bg-transparent border-none p-4 text-sm font-bold outline-none"
              />
            </div>
            <label className="mt-4 flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" name="accepterAppel"
                checked={formData.accepterAppel} onChange={handleInputChange}
                className="w-5 h-5 rounded-lg border-slate-200 text-blue-600 focus:ring-blue-500/20"
              />
              <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700">J'accepte d'être contacté par un agent</span>
            </label>
          </section>
        </div>

        {/* Colonne Droite : Lieu & Preuves */}
        <div className="space-y-6">
          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={14}/> Localisation
              </h2>
              <button 
                type="button" onClick={recupererLocalisation}
                className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-1"
              >
                <MapPin size={12}/> Auto-détecter
              </button>
            </div>
            
            <div className="space-y-4">
              <input 
                type="text" name="adresse" placeholder="Adresse ou repère"
                value={formData.adresse} onChange={handleInputChange}
                className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" name="quartier" placeholder="Quartier"
                  value={formData.quartier} onChange={handleInputChange}
                  className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <input 
                  type="text" name="ville" placeholder="Ville"
                  value={formData.ville} onChange={handleInputChange}
                  className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Upload size={14}/> Preuves (Photos/Vidéos)
            </h2>
            
            <div 
              onClick={() => fileInputRef.current.click()}
              className="border-4 border-dashed border-slate-50 rounded-[2rem] p-8 text-center cursor-pointer hover:bg-slate-50 hover:border-blue-100 transition-all group"
            >
              <Upload className="mx-auto mb-3 text-slate-300 group-hover:text-blue-400" size={32} />
              <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">Glissez vos fichiers ou cliquez ici</p>
              <p className="text-[10px] text-slate-300 mt-1 uppercase">Max 5 fichiers (10MB chacun)</p>
            </div>
            <input type="file" multiple ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*,video/*" />

            <div className="grid grid-cols-3 gap-3 mt-6">
              {previews.map((p, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden shadow-sm group">
                  {p.isImage ? (
                    <img src={p.url} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white"><Video size={20}/></div>
                  )}
                  <button 
                    type="button" onClick={() => removeFile(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X size={12}/>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {erreur && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold flex items-center gap-3 border border-red-100">
              <AlertTriangle size={18}/> {erreur}
            </div>
          )}

          <button 
            type="submit" disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" size={20}/> : <><Send size={18}/> Envoyer le signalement</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signalement;