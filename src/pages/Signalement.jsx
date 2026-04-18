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
  { value: 'menace_mort', label: 'Menace mort' },
  { value: 'discrimination', label: 'Discrimination' },
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

  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.startsWith('237')) val = val.slice(3);
    if (val.length > 9) val = val.slice(0, 9);
    setFormData(prev => ({ ...prev, telephone: val }));
  };

  const handleFileChange = (e) => {
    setErreur('');
    const selectedFiles = Array.from(e.target.files);

    if (files.length + selectedFiles.length > 5) {
      setErreur("Maximum 5 fichiers autorisés.");
      return;
    }

    const newPreviews = selectedFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      isImage: file.type.startsWith('image')
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
    if (!navigator.geolocation) {
      setErreur("Géolocalisation non supportée.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();

          setFormData(prev => ({
            ...prev,
            latitude,
            longitude,
            adresse: data.display_name || '',
            ville: data.address?.city || data.address?.town || 'Douala',
            quartier: data.address?.suburb || ''
          }));
        } catch {
          setFormData(prev => ({ ...prev, latitude, longitude }));
        } finally {
          setLoading(false);
        }
      },
      () => {
        setErreur("Accès à la localisation refusé.");
        setLoading(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.categorie || !formData.description) {
      return setErreur("Tous les champs obligatoires doivent être remplis.");
    }

    if (formData.description.trim().length < 50) {
      return setErreur("Description minimum 50 caractères.");
    }

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
          coordinates: [formData.longitude, formData.latitude]
        }
      };

      data.append('categorie', formData.categorie);
      data.append('description', formData.description);
      data.append('priorite', formData.priorite);
      data.append('dateincident', formData.dateincident);
      data.append('localisation', JSON.stringify(localisationObj));

      files.forEach(file => {
        data.append('preuves', file);
      });

      const res = await apiClient.post('/signalements', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const code =
        res?.data?.data?.codesuivi ||
        res?.data?.codesuivi ||
        res?.data?.signalement?.codesuivi;

      if (!code) {
        throw new Error("Code de suivi introuvable dans la réponse API");
      }

      setCodeSuivi(code);
      setFiles([]);
      setPreviews([]);
      setFormData({
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

    } catch (err) {
      setErreur(
        err.response?.data?.message ||
        err.message ||
        "Erreur serveur lors de l'envoi"
      );
    } finally {
      setLoading(false);
    }
  };

  if (codeSuivi) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-10 bg-white rounded-3xl shadow text-center">
        <CheckCircle className="mx-auto text-green-500" size={60} />

        <h2 className="text-xl font-bold mt-4">Signalement envoyé</h2>

        <p className="mt-2 text-gray-500">
          Conservez votre code :
        </p>

        <div className="mt-6 p-4 bg-black text-white rounded-xl font-mono text-xl">
          {codeSuivi}
        </div>

        <button
          onClick={() => setCodeSuivi(null)}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-xl"
        >
          Nouveau signalement
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Signaler un incident</h1>

      {erreur && (
        <div className="mb-4 bg-red-100 text-red-600 p-3 rounded">
          {erreur}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">

        <div className="space-y-4">

          <select
            name="categorie"
            value={formData.categorie}
            onChange={handleInputChange}
            className="w-full p-3 border rounded"
            required
          >
            <option value="">Choisir catégorie</option>
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description (min 50 caractères)"
            className="w-full p-3 border rounded h-40"
            required
          />

          <button
            type="button"
            onClick={recupererLocalisation}
            className="flex items-center gap-2 text-blue-600"
          >
            <MapPin size={18} /> Localiser
          </button>

        </div>

        <div className="space-y-4">

          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-3 rounded"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Envoyer"}
          </button>

        </div>

      </form>
    </div>
  );
};

export default Signalement;