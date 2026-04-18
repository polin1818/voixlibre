import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, AlertCircle, LogOut, Home, 
  MessageSquare, User, Menu, X, Search,
  HeartPulse // Pour le côté bien-être/psy
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const panicMode = () => {
    // Redirection immédiate vers une page neutre (Google ou Météo)
    window.location.href = 'https://www.google.com';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Vérifie si la route est active pour le style
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 shrink-0">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-100 transition-transform hover:scale-105 active:scale-95">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black text-slate-900 leading-tight tracking-tight">
                VoixLibre
              </span>
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest leading-none">
                Sanctuary
              </span>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            <NavLink to="/" text="Accueil" active={isActive('/')} />
            <NavLink to="/signalement" text="Signaler" active={isActive('/signalement')} />
            <NavLink to="/suivi" text="Suivi Dossier" active={isActive('/suivi')} />
            <NavLink to="/forum" text="Forum" active={isActive('/forum')} />
            <NavLink to="/psychologie" text="Bien-être" active={isActive('/psychologie')} />
          </div>

          {/* Actions & Profil */}
          <div className="flex items-center space-x-3">
            
            {/* Bouton Panique / Emergency */}
            <button 
              onClick={panicMode}
              className="hidden sm:flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-tighter hover:bg-red-600 hover:text-white transition-all"
            >
              <HeartPulse size={16} />
              Quitter vite
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <Link 
                  to="/profil" 
                  className="flex items-center gap-2 p-1.5 pr-4 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-md"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-black text-xs">
                    {user.pseudo?.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="text-xs font-black hidden lg:block tracking-wide">
                    {user.pseudo}
                  </span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-600 p-2 transition-colors"
                  title="Déconnexion"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
              >
                Connexion
              </Link>
            )}

            {/* Menu Mobile Button */}
            <button 
              className="md:hidden p-2 text-slate-600 bg-slate-50 rounded-xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-6 space-y-3 animate-in slide-in-from-top duration-300 shadow-2xl">
          <MobileNavLink to="/" text="Accueil" onClick={() => setIsMenuOpen(false)} />
          <MobileNavLink to="/signalement" text="Signaler un incident" onClick={() => setIsMenuOpen(false)} />
          <MobileNavLink to="/suivi" text="Suivre mon dossier" onClick={() => setIsMenuOpen(false)} />
          <MobileNavLink to="/forum" text="Forum entraide" onClick={() => setIsMenuOpen(false)} />
          <MobileNavLink to="/psychologie" text="Espace bien-être" onClick={() => setIsMenuOpen(false)} />
          
          <button 
            onClick={panicMode}
            className="w-full bg-red-600 text-white p-4 rounded-2xl font-black text-sm uppercase"
          >
            QUITTER IMMÉDIATEMENT (URGENCE)
          </button>
        </div>
      )}
    </nav>
  );
};

// Sous-composant Desktop
const NavLink = ({ to, text, active }) => (
  <Link 
    to={to} 
    className={`px-5 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
      active 
      ? 'bg-white text-blue-600 shadow-sm' 
      : 'text-slate-500 hover:text-slate-900'
    }`}
  >
    {text}
  </Link>
);

// Sous-composant Mobile
const MobileNavLink = ({ to, text, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className="block p-4 text-slate-900 font-black text-sm border-b border-slate-50 hover:bg-slate-50 rounded-2xl transition-colors"
  >
    {text}
  </Link>
);

export default Navbar;