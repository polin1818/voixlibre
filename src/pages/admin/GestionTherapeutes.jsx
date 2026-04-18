import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client'; 
import { AdminLayout } from '../../layouts/AdminLayout';
import { TherapeuteCard } from '../../components/admin/TherapeuteCard';
import { UserPlus, X, Image as ImageIcon, Loader2, Plus } from 'lucide-react';

const GestionTherapeutes = () => {
  const [therapeutes, setTherapeutes] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const initialFormState = {
    nom: '',
    specialite: '',
    bio: '',
    telephone: '',
    categories: ['stress'],
    ville: 'Douala'
  };

  const [newTherapeute, setNewTherapeute] = useState(initialFormState);

  useEffect(() => {
    fetchTherapeutes();
  }, []);

  const fetchTherapeutes = async () => {
    try {
      setLoadingList(true);
      const res = await apiClient.get('/admin/therapeutes');
      if (res.data.success) {
        setTherapeutes(res.data.data.therapeutes || []);
      }
    } catch (err) {
      console.error("❌ Erreur chargement liste:", err);
    } finally {
      setLoadingList(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTherapeute(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation de base
    if (!newTherapeute.nom || !newTherapeute.specialite || !newTherapeute.bio) {
      alert("Veuillez remplir les champs obligatoires (Nom, Spécialité, Bio)");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      
      // 1. On ajoute les champs texte un par un
      formData.append('nom', newTherapeute.nom);
      formData.append('specialite', newTherapeute.specialite);
      formData.append('bio', newTherapeute.bio);
      formData.append('telephone', newTherapeute.telephone);
      formData.append('ville', newTherapeute.ville);
      
      // On envoie la catégorie sélectionnée (le backend attend un tableau ou une string)
      formData.append('categories', newTherapeute.categories[0]);

      // 2. On ajoute la photo EN DERNIER (important pour certains parseurs multipart)
      if (selectedFile) {
        formData.append('photo', selectedFile);
      }

      // Log de debug pour inspecter ce qui part
      console.log("📤 Envoi du FormData...");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const res = await apiClient.post('/admin/therapeutes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setShowAddForm(false);
        setNewTherapeute(initialFormState);
        setSelectedFile(null);
        setPreviewUrl(null);
        fetchTherapeutes();
      }
    } catch (err) {
      console.error("❌ Erreur lors de l'envoi:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer définitivement ce thérapeute ?")) return;
    try {
      const res = await apiClient.delete(`/admin/therapeutes/${id}`);
      if (res.data.success) fetchTherapeutes();
    } catch (err) {
      alert("Erreur de suppression");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await apiClient.patch(`/admin/therapeutes/${id}/toggle`);
      if (res.data.success) fetchTherapeutes();
    } catch (err) {
      alert("Erreur de changement de statut");
    }
  };

  return (
    <AdminLayout>
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Équipe Médicale</h1>
          <p className="text-slate-500 mt-1">Gérez les profils des praticiens de la plateforme</p>
        </div>

        <button 
          onClick={() => setShowAddForm(true)} 
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
          <Plus size={20}/> Ajouter un profil
        </button>
      </div>

      {/* MODAL FORMULAIRE */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl relative shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="p-8 pb-0 flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900">Nouveau Thérapeute</h2>
              <button onClick={() => setShowAddForm(false)} className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5 overflow-y-auto max-h-[75vh]">
              
              {/* PHOTO PREVIEW & UPLOAD */}
              <div className="group relative w-32 h-32 mx-auto mb-6">
                <div className="w-full h-full rounded-[2rem] border-4 border-slate-50 overflow-hidden bg-slate-100 flex items-center justify-center shadow-md">
                  {previewUrl ? (
                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <ImageIcon size={32} className="text-slate-300" />
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 bg-blue-600 p-3 rounded-2xl text-white cursor-pointer shadow-lg hover:bg-blue-700 transition-colors">
                  <Plus size={20} />
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-2">Nom complet</label>
                  <input name="nom" value={newTherapeute.nom} onChange={handleChange} placeholder="Dr. Prénom Nom" className="w-full p-4 bg-slate-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all" required />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-2">Spécialité</label>
                  <input name="specialite" value={newTherapeute.specialite} onChange={handleChange} placeholder="ex: Psychologue" className="w-full p-4 bg-slate-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all" required />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-2">Téléphone</label>
                  <input name="telephone" value={newTherapeute.telephone} onChange={handleChange} placeholder="+237 ..." className="w-full p-4 bg-slate-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-2">Bio / Expertise</label>
                <textarea name="bio" value={newTherapeute.bio} onChange={handleChange} placeholder="Présentation du praticien..." className="w-full p-4 bg-slate-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all min-h-[100px]" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-2">Catégorie</label>
                  <select 
                    value={newTherapeute.categories[0]} 
                    onChange={(e) => setNewTherapeute({...newTherapeute, categories:[e.target.value]})}
                    className="w-full p-4 bg-slate-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none cursor-pointer"
                  >
                    <option value="stress">Gestion du Stress</option>
                    <option value="anxiete">Anxiété & Phobies</option>
                    <option value="couple">Thérapie de Couple</option>
                    <option value="deuil">Accompagnement deuil</option>
                  </select>
                </div>
                <div>
                   <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-2">Ville</label>
                   <input name="ville" value={newTherapeute.ville} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all" />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-slate-900 text-white p-5 rounded-2xl font-bold shadow-xl hover:bg-blue-600 disabled:bg-slate-300 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Créer le profil"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LISTE DES CARTES */}
      {loadingList ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Chargement des profils...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {therapeutes.length > 0 ? (
            therapeutes.map(t => (
              <TherapeuteCard 
                key={t._id}
                therapeute={t}
                onDelete={() => handleDelete(t._id)}
                onToggleStatus={() => handleToggleStatus(t._id)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <UserPlus className="text-slate-300" />
              </div>
              <p className="text-slate-500 font-bold">Aucun thérapeute pour le moment</p>
            </div>
          )}
        </div>
      )}

    </AdminLayout>
  );
};

export default GestionTherapeutes;