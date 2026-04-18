import React, { useState, useEffect } from 'react';
import { UserCard } from './UserCard'; // Assure-toi du chemin
import { Users, UserPlus, Search, RefreshCw, AlertCircle } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // 1. Récupérer les utilisateurs depuis l'API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/utilisateurs?search=${searchTerm}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error("Erreur chargement utilisateurs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // Optionnel: décoder le token pour connaître le pseudo de l'admin actuel
    // const decoded = jwt_decode(token); setCurrentUser(decoded.pseudo);
  }, []);

  // 2. Gérer la mise à jour (Rôle ou Statut Actif)
  const handleUpdate = async (userId, updateData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/utilisateurs/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        // Mise à jour locale pour éviter de recharger toute la liste
        setUsers(users.map(u => u._id === userId ? { ...u, ...updateData } : u));
      }
    } catch (error) {
      alert("Erreur lors de la mise à jour");
    }
  };

  // 3. Gérer la suppression
  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/utilisateurs/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setUsers(users.filter(u => u._id !== userId));
      }
    } catch (error) {
      alert("Erreur lors de la suppression");
    }
  };

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      {/* Header & Stats Rapides */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Users className="text-blue-600" size={32} />
            Gestion des Utilisateurs
          </h1>
          <p className="text-slate-500 font-medium">Contrôlez les accès et les rôles de la plateforme</p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2 px-4">
                <span className="text-2xl font-black text-blue-600">{users.length}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Membres</span>
            </div>
            <button 
              onClick={fetchUsers}
              className="p-3 bg-white hover:bg-slate-50 text-slate-600 rounded-2xl shadow-sm border border-slate-100 transition-all"
            >
                <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
        </div>
      </div>

      {/* Barre de Recherche */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text"
          placeholder="Rechercher par pseudo..."
          className="w-full pl-12 pr-4 py-4 bg-white rounded-[2rem] border-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all font-bold text-slate-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
        />
      </div>

      {/* Grille des Utilisateurs */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-50">
          {[1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-200 animate-pulse rounded-[2.5rem]"></div>)}
        </div>
      ) : users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(user => (
            <UserCard 
              key={user._id} 
              user={user}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              currentUserPseudo="Admin" // À remplacer par le pseudo dynamique de l'admin
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
            <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-bold text-lg">Aucun utilisateur trouvé</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;