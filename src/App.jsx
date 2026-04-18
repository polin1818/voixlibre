import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';

// --- IMPORTS DES PAGES ---
import Home from './pages/Home';
import Psychologie from './pages/Psychologie';
import Signalement from './pages/Signalement';
import SuiviDossier from './pages/SuiviDossier';
import Auth from './pages/Auth';
import Forum from './pages/Forum';
import Profil from './pages/Profil';
import Confidentialite from './pages/Confidentialite';
import Aide from './pages/Aide';
import Contact from './pages/Contact';
import SignalementsPublics from './pages/SignalementsPublics';

// --- PAGES ADMIN ---
import Dashboard from './pages/admin/Dashboard';
import GestionRessources from './pages/admin/GestionRessources';
import GestionTherapeutes from './pages/admin/GestionTherapeutes';
import UserManagement from './pages/admin/UserManagement';
import GestionIncidents from './pages/admin/GestionIncidents'; // <-- NOUVEL IMPORT

// Composant pour gérer l'affichage conditionnel
function AppContent() {
  const location = useLocation();
  
  // Vérifie si l'URL commence par /admin
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* N'affiche la Navbar que si on n'est PAS sur une page admin */}
      {!isAdminRoute && <Navbar />}
      
      <main className="flex-grow">
        <Routes>
          {/* Routes principales */}
          <Route path="/" element={<Home />} />
          <Route path="/signalement" element={<Signalement />} />
          <Route path="/suivi" element={<SuiviDossier />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/psychologie" element={<Psychologie />} />
          <Route path="/signalements" element={<SignalementsPublics />} />
          
          {/* Pages d'information et Support */}
          <Route path="/confidentialite" element={<Confidentialite />} />
          <Route path="/aide" element={<Aide />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Espace Utilisateur */}
          <Route path="/login" element={<Auth />} />
          <Route path="/profil" element={<Profil />} />

          {/* Routes Admin */}
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/ressources" element={<GestionRessources />} />
          <Route path="/admin/therapeutes" element={<GestionTherapeutes />} />
          <Route path="/admin/utilisateurs" element={<UserManagement />} />
          <Route path="/admin/incidents" element={<GestionIncidents />} /> {/* <-- NOUVELLE ROUTE */}
        </Routes>
      </main>

      {/* N'affiche le Footer que si on n'est PAS sur une page admin */}
      {!isAdminRoute && (
        <footer className="bg-white border-t border-slate-200 py-10 px-6 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-lg font-black text-blue-600 tracking-tight">VoixLibre Sanctuary</p>
              <p className="text-xs text-slate-400 font-medium mt-1">Plateforme citoyenne sécurisée et chiffrée.</p>
            </div>
            
            <div className="text-sm text-slate-500 font-bold">
              &copy; 2026 VoixLibre — Fièrement développé à Douala 🇨🇲
            </div>
            
            <div className="flex gap-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <Link to="/confidentialite" className="hover:text-blue-600 transition-colors">Confidentialité</Link>
              <Link to="/aide" className="hover:text-blue-600 transition-colors">Aide & Support</Link>
              <Link to="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

// Le composant App principal qui contient le Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;