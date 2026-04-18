import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Users, MessageSquare, 
  Settings, ShieldAlert, Headphones, Stethoscope 
} from 'lucide-react';

export const Sidebar = () => {
  const location = useLocation();

  const isPath = (path) => location.pathname === path;

  return (
    <div className="w-64 h-screen bg-[#F8FAFC] border-r border-slate-200 p-6 flex flex-col shrink-0">
      <div className="mb-10">
        <h1 className="text-xl font-bold text-blue-900">VoixLibre Admin</h1>
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Douala Hub</p>
      </div>

      <nav className="flex-1 space-y-2">
        <Link to="/admin">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active={isPath('/admin')} />
        </Link>
        
        {/* LIEN VERS LA GESTION DES INCIDENTS */}
        <Link to="/admin/incidents">
          <NavItem 
            icon={<FileText size={20}/>} 
            label="Gestion Incidents" 
            active={isPath('/admin/incidents')} 
          />
        </Link>

        {/* LIEN VERS LA GESTION DES UTILISATEURS */}
        <Link to="/admin/utilisateurs">
          <NavItem 
            icon={<Users size={20}/>} 
            label="Gestion Utilisateurs" 
            active={isPath('/admin/utilisateurs')} 
          />
        </Link>

        <NavItem icon={<MessageSquare size={20}/>} label="Forum Moderation" />
        
        <div className="pt-6 pb-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Bien-être</div>
        
        <Link to="/admin/ressources">
          <NavItem icon={<Headphones size={20}/>} label="Ressources Audio" active={isPath('/admin/ressources')} />
        </Link>
        
        <Link to="/admin/therapeutes">
          <NavItem icon={<Stethoscope size={20}/>} label="Thérapeutes" active={isPath('/admin/therapeutes')} />
        </Link>
      </nav>

      <div className="mt-auto space-y-1">
        <NavItem icon={<Settings size={20}/>} label="Settings" />
        <NavItem icon={<ShieldAlert size={20}/>} label="Security Logs" />
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
    active 
      ? 'bg-white shadow-md text-blue-600 border border-slate-100' 
      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
  }`}>
    {icon}
    <span className="font-bold text-sm">{label}</span>
  </div>
);