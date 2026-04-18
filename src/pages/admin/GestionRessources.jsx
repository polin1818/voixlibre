import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client'; 
import { AdminLayout } from '../../layouts/AdminLayout';
import { RessourceCard } from '../../components/admin/RessourceCard';
import { Music, X, Upload, Loader2, Plus, FileText, Video, LayoutGrid } from 'lucide-react';

const GestionRessources = () => {
  const [ressources, setRessources] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  // --- ÉTATS POUR LES STATISTIQUES ---
  const [stats, setStats] = useState({
    total: 0,
    audios: 0,
    pdfs: 0,
    articles: 0
  });

  const initialFormState = {
    titre: '',
    description: '',
    type: 'audio',
    categorie: 'Meditation',
    duree: '',
    icon_name: 'Headphones'
  };

  const [newRessource, setNewRessource] = useState(initialFormState);

  useEffect(() => {
    fetchRessources();
  }, []);

  // --- MISE À JOUR AUTOMATIQUE DES STATS ---
  useEffect(() => {
    if (ressources) {
      setStats({
        total: ressources.length,
        audios: ressources.filter(r => r.type === 'audio').length,
        pdfs: ressources.filter(r => r.type === 'exercice').length,
        articles: ressources.filter(r => r.type === 'article').length
      });
    }
  }, [ressources]);

  const fetchRessources = async () => {
    try {
      setLoadingList(true);
      const res = await apiClient.get('/ressources');
      if (res.data.success) {
        setRessources(res.data.data.ressources || []);
      }
    } catch (err) {
      console.error("❌ Erreur chargement:", err);
    } finally {
      setLoadingList(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRessource(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Le fichier média est requis");

    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(newRessource).forEach(key => formData.append(key, newRessource[key]));
      formData.append('url_media', selectedFile);

      const res = await apiClient.post('/ressources', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setShowAddForm(false);
        setNewRessource(initialFormState);
        setSelectedFile(null);
        fetchRessources();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette ressource ?")) return;
    try {
      await apiClient.delete(`/ressources/${id}`);
      fetchRessources();
    } catch (err) {
      alert("Erreur de suppression");
    }
  };

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Bibliothèque</h1>
          <p className="text-slate-500 mt-1">Gérez les contenus multimédias de la plateforme</p>
        </div>

        <button 
          onClick={() => setShowAddForm(true)} 
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
          <Plus size={20}/> Ajouter une ressource
        </button>
      </div>

      {/* SECTION STATISTIQUES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard title="Total" count={stats.total} icon={<LayoutGrid className="text-blue-600" size={20}/>} color="bg-blue-50" />
        <StatCard title="Audios" count={stats.audios} icon={<Music className="text-purple-600" size={20}/>} color="bg-purple-50" />
        <StatCard title="Guides PDF" count={stats.pdfs} icon={<FileText className="text-emerald-600" size={20}/>} color="bg-emerald-50" />
        <StatCard title="Articles" count={stats.articles} icon={<Video className="text-orange-600" size={20}/>} color="bg-orange-50" />
      </div>

      {/* MODAL FORMULAIRE */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4 text-left">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl relative shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 pb-0 flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900">Nouvelle Ressource</h2>
              <button onClick={() => setShowAddForm(false)} className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-2">Titre</label>
                <input name="titre" value={newRessource.titre} onChange={handleChange} placeholder="Ex: Méditation du soir" className="w-full p-4 bg-slate-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-medium" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-2">Type</label>
                  <select name="type" value={newRessource.type} onChange={handleChange} className="w-full p-4 bg-slate-50 rounded-2xl outline-none cursor-pointer font-bold">
                    <option value="audio">Audio (MP3)</option>
                    <option value="exercice">Exercice (PDF)</option>
                    <option value="article">Article</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-2">Durée</label>
                  <input name="duree" value={newRessource.duree} onChange={handleChange} placeholder="Ex: 10 min" className="w-full p-4 bg-slate-50 rounded-2xl outline-none" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-2">Catégorie</label>
                <select name="categorie" value={newRessource.categorie} onChange={handleChange} className="w-full p-4 bg-slate-50 rounded-2xl outline-none cursor-pointer font-bold">
                  <option value="Meditation">Méditation</option>
                  <option value="Sommeil">Sommeil</option>
                  <option value="Respiration">Respiration</option>
                  <option value="Stress">Gestion du Stress</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-2">Description</label>
                <textarea name="description" value={newRessource.description} onChange={handleChange} placeholder="Brève présentation..." className="w-full p-4 bg-slate-50 rounded-2xl outline-none min-h-[80px]" required />
              </div>

              <div className="relative group">
                <label className="block cursor-pointer py-6 border-2 border-dashed border-slate-200 rounded-[2rem] text-center hover:bg-blue-50 hover:border-blue-300 transition-all">
                  <Upload className="mx-auto text-slate-400 mb-2" />
                  <span className="text-xs font-bold text-slate-500 block truncate px-4">
                    {selectedFile ? selectedFile.name : "Sélectionner le fichier (Audio/PDF)"}
                  </span>
                  <input type="file" onChange={handleFileChange} className="hidden" accept="audio/*,application/pdf" />
                </label>
              </div>

              <button disabled={loading} className="w-full bg-slate-900 text-white p-5 rounded-2xl font-bold shadow-xl hover:bg-blue-600 disabled:bg-slate-300 transition-all flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : "Publier la ressource"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LISTE DES RESSOURCES */}
      {loadingList ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Récupération des fichiers...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20 text-left">
          {ressources.length > 0 ? (
            ressources.map(r => (
              <RessourceCard 
                key={r._id} 
                ressource={r} 
                onDelete={() => handleDelete(r._id)} 
              />
            ))
          ) : (
            <div className="col-span-full text-center py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <Music className="text-slate-200 mx-auto mb-4" size={48} />
              <p className="text-slate-500 font-bold">La bibliothèque est vide</p>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

const StatCard = ({ title, count, icon, color }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 text-left">
    <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center`}>
      {icon}
    </div>
    <div>
      <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider">{title}</p>
      <h4 className="text-2xl font-black text-slate-900 leading-none mt-1">{count}</h4>
    </div>
  </div>
);

export default GestionRessources;