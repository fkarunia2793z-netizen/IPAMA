import React from 'react';
import { Shield, ShieldCheck, Users } from 'lucide-react';

interface HeaderProps {
  isAdmin: boolean;
  onAdminToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isAdmin, onAdminToggle }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/30 shadow-lg">
          <Users className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">
            Pendaftaran IPAMA
          </h1>
          <p className="text-emerald-100 text-sm font-medium opacity-90">
            Formulir Registrasi Anggota Baru
          </p>
        </div>
      </div>
      
      <button
        onClick={onAdminToggle}
        className={`
          flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 shadow-lg
          ${isAdmin 
            ? 'bg-emerald-500 text-white hover:bg-emerald-600 ring-2 ring-emerald-300 ring-offset-2 ring-offset-teal-800' 
            : 'bg-white/10 text-white border border-white/30 hover:bg-white/20 backdrop-blur-md'}
        `}
      >
        {isAdmin ? <ShieldCheck size={18} /> : <Shield size={18} />}
        {isAdmin ? 'Admin Mode' : 'Login Admin'}
      </button>
    </div>
  );
};