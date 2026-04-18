import React from "react";
// On remonte d'un niveau (..) puis on va dans components/admin
import { Sidebar } from "../components/admin/Sidebar"; 

export const AdminLayout = ({ children }) => (
  <div className="flex bg-[#F1F5F9] min-h-screen font-sans">
    <Sidebar />
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
        <div className="relative w-96 text-slate-400">
           {/* Barre de recherche factice pour le design */}
           <input type="text" placeholder="Rechercher..." className="w-full bg-slate-100 border-none rounded-xl px-4 py-2 text-sm" />
        </div>
        <div className="flex items-center gap-4">
           <button className="bg-blue-900 text-white px-6 py-2 rounded-full text-xs font-bold shadow-lg shadow-blue-100">
             Emergency Protocol
           </button>
           <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center font-bold text-blue-600">
              P
           </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  </div>
);