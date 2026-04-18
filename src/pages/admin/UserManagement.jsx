import React, { useState, useEffect } from 'react';
import { 
  Search, Users, ShieldCheck, UserX, 
  Filter, Download, MoreVertical, 
  ArrowUpRight, Edit2, Trash2, UserMinus, X
} from 'lucide-react';

// --- IMPORTS DES COMPOSANTS LOCAUX ---
import { AdminLayout } from '../../layouts/AdminLayout';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    const closeMenu = () => setActiveMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/admin/utilisateurs', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.succes || data.success) {
        setUsers(data.data || []);
      }
    } catch (err) {
      console.error("Erreur Fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, user) => {
    setActiveMenu(null);
    
    if (action === 'delete') {
      if (!window.confirm(`Supprimer définitivement ${user.pseudo} ?`)) return;
      try {
        const res = await fetch(`http://localhost:5000/api/admin/utilisateurs/${user._id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) fetchUsers();
      } catch (err) { alert("Erreur lors de la suppression"); }
    }

    if (action === 'suspend') {
      const confirmMsg = user.actif ? "Suspendre ce compte ?" : "Réactiver ce compte ?";
      if (!window.confirm(confirmMsg)) return;
      try {
        const res = await fetch(`http://localhost:5000/api/admin/utilisateurs/${user._id}/suspend`, {
          method: 'PATCH',
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ actif: !user.actif })
        });
        
        if (res.ok) {
          fetchUsers();
        } else {
          const errData = await res.json();
          alert(errData.message || "Erreur lors de la modification");
        }
      } catch (err) { 
        alert("Erreur réseau ou serveur"); 
      }
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/admin/utilisateurs/${editingUser._id}`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pseudo: editingUser.pseudo,
          role: editingUser.role
        })
      });
      if (res.ok) {
        setEditingUser(null);
        fetchUsers();
      }
    } catch (err) { alert("Erreur lors de la mise à jour"); }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.pseudo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === '' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const total = users.length || 1;
  const adminPct = Math.round((users.filter(u => u.role === 'admin').length / total) * 100);
  const memberPct = Math.round((users.filter(u => u.role === 'membre').length / total) * 100);

  return (
    <AdminLayout>
      <div className="max-w-[1600px] mx-auto text-left font-sans">
        
        {/* En-tête de section */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Gestion des Utilisateurs</h1>
          <p className="text-slate-500">Contrôle d'accès et audit de la communauté VoixLibre</p>
        </div>

        {/* Statistiques Rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Users" value={users.length} subValue="+12% ce mois" icon={<Users size={20}/>} color="blue" />
          <StatCard title="Admins" value={users.filter(u => u.role === 'admin').length} subValue="Staff autorisé" icon={<ShieldCheck size={20}/>} color="purple" />
          <StatCard title="Membres" value={users.filter(u => u.role === 'membre').length} subValue="Communauté active" icon={<Users size={20}/>} color="emerald" />
          <StatCard title="Suspendus" value={users.filter(u => !u.actif).length} subValue="Comptes inactifs" icon={<UserX size={20}/>} color="red" />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Tableau Principal */}
          <div className="flex-grow bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-visible">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">Registre des Utilisateurs</h2>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">
                  <Filter size={16}/> Filtrer
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                  <Download size={16}/> Export
                </button>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  placeholder="Rechercher par pseudo..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-[11px] uppercase tracking-widest font-black">
                    <th className="px-6 py-4">Identifiant</th>
                    <th className="px-6 py-4">Rôle</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    [1,2,3,4].map(i => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan="4" className="px-6 py-8 bg-white">
                          <div className="h-10 bg-slate-100 rounded-xl w-full"></div>
                        </td>
                      </tr>
                    ))
                  ) : filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shadow-sm ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                            {user.pseudo?.substring(0,2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-700 text-sm">{user.pseudo}</p>
                            <p className="text-[10px] text-slate-400 font-bold tracking-tight">ID: {user._id?.substring(0,8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-600 border border-purple-200' : 'bg-blue-100 text-blue-600 border border-blue-200'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest">
                          <div className={`w-2 h-2 rounded-full ${!user.actif ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`}></div>
                          <span className={!user.actif ? 'text-red-600' : 'text-emerald-600'}>
                            {!user.actif ? 'Suspendu' : 'Actif'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation();
                            setActiveMenu(activeMenu === user._id ? null : user._id); 
                          }}
                          className="p-2 text-slate-400 hover:bg-white hover:text-slate-900 hover:shadow-sm border border-transparent hover:border-slate-200 rounded-xl transition-all"
                        >
                          <MoreVertical size={18}/>
                        </button>

                        {activeMenu === user._id && (
                          <div 
                            className="absolute right-6 top-12 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 py-2 animate-in fade-in zoom-in duration-150"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button onClick={() => setEditingUser(user)} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                              <Edit2 size={14}/> Modifier le profil
                            </button>
                            <button onClick={() => handleAction('suspend', user)} className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-colors ${user.actif ? 'text-orange-600 hover:bg-orange-50' : 'text-emerald-600 hover:bg-emerald-50'}`}>
                              <UserMinus size={14}/> {user.actif ? 'Suspendre' : 'Réactiver'}
                            </button>
                            <div className="h-px bg-slate-100 my-1 mx-2"></div>
                            <button onClick={() => handleAction('delete', user)} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors">
                              <Trash2 size={14}/> Supprimer
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar de stats */}
          <div className="w-full lg:w-80 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Distribution</h3>
              <div className="space-y-6">
                <ProgressItem label="Membres" percent={memberPct} color="bg-blue-500" />
                <ProgressItem label="Admins" percent={adminPct} color="bg-purple-500" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Journal d'audit</h3>
              <div className="space-y-5">
                <LogItem dot="bg-blue-500" text="Session admin démarrée" time="Maintenant" />
                <LogItem dot="bg-emerald-500" text="Base synchronisée" time="Il y a 2 min" />
                <LogItem dot="bg-purple-500" text="Logs système purgés" time="Il y a 1h" />
              </div>
            </div>
          </div>
        </div>

        {/* Modal de Modification */}
        {editingUser && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4" onClick={() => setEditingUser(null)}>
            <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in duration-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="p-8 flex justify-between items-center border-b border-slate-50">
                <div>
                    <h2 className="text-xl font-black text-slate-800">Édition Profil</h2>
                    <p className="text-xs font-bold text-slate-400">ID: {editingUser._id}</p>
                </div>
                <button onClick={() => setEditingUser(null)} className="p-3 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={20}/></button>
              </div>
              <form onSubmit={handleUpdateUser} className="p-8 space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Pseudo Utilisateur</label>
                  <input 
                    className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all"
                    value={editingUser.pseudo}
                    onChange={(e) => setEditingUser({...editingUser, pseudo: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Niveau d'Accès (Rôle)</label>
                  <select 
                    className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white rounded-2xl outline-none font-bold text-slate-700 appearance-none transition-all"
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                  >
                    <option value="membre">Membre (Utilisateur Standard)</option>
                    <option value="admin">Administrateur (Accès Total)</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all active:translate-y-0 uppercase tracking-widest text-xs">
                  Valider les changements
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

// --- SOUS-COMPOSANTS ---

const StatCard = ({ title, value, subValue, icon, color }) => {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    emerald: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    orange: "bg-orange-50 text-orange-600"
  };

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 group hover:border-blue-500/30 transition-all">
      <div className={`p-4 rounded-2xl ${colorMap[color] || "bg-slate-50 text-slate-600"} transition-transform group-hover:scale-110`}>{icon}</div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1 leading-none">{title}</p>
        <p className="text-2xl font-black text-slate-800 leading-none tracking-tight">{value}</p>
        <p className="text-[10px] font-bold text-slate-400 mt-2 flex items-center gap-1">
          <ArrowUpRight size={10} className="text-emerald-500"/> {subValue}
        </p>
      </div>
    </div>
  );
};

const ProgressItem = ({ label, percent, color }) => (
  <div>
    <div className="flex justify-between text-[10px] font-black mb-2 uppercase tracking-widest">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-800 font-black">{percent}%</span>
    </div>
    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
      <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${percent}%` }}></div>
    </div>
  </div>
);

const LogItem = ({ dot, text, time }) => (
  <div className="flex gap-4 items-start group">
    <div className={`w-2 h-2 rounded-full ${dot} mt-1.5 shrink-0 shadow-sm group-hover:scale-150 transition-transform`}></div>
    <div>
      <p className="text-[11px] font-bold text-slate-600 leading-tight mb-1">{text}</p>
      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{time}</p>
    </div>
  </div>
);

export default UserManagement;