import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RegistrationForm } from './components/RegistrationForm';
import { MemberList } from './components/MemberList';
import { AdminModal } from './components/AdminModal';
import { storageService } from './services/storageService';
import { Member, FormData } from './types';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Initial Load
  useEffect(() => {
    loadMembers();
    // Check session
    const adminSession = sessionStorage.getItem('ipama_admin');
    if (adminSession === 'true') setIsAdmin(true);
  }, []);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const data = await storageService.getMembers();
      setMembers(data);
    } catch (error) {
      console.error('Failed to load members', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = (password: string) => {
    // Hardcoded password as per previous logic (secure enough for client-side demo)
    if (password === 'barudakwell') {
      setIsAdmin(true);
      sessionStorage.setItem('ipama_admin', 'true');
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    if (confirm('Logout dari mode Admin?')) {
      setIsAdmin(false);
      sessionStorage.removeItem('ipama_admin');
    }
  };

  const handleSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      await storageService.addMember(data);
      await loadMembers(); // Refresh list
      alert('Pendaftaran Berhasil! Terima kasih telah bergabung dengan IPAMA.');
    } catch (error) {
      alert('Terjadi kesalahan saat menyimpan data.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus data ini?')) {
      try {
        await storageService.deleteMember(id);
        setMembers(members.filter(m => m.id !== id));
      } catch (error) {
        alert('Gagal menghapus data.');
      }
    }
  };

  const handleExport = () => {
    storageService.exportToCSV(members);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-slate-900 pb-20">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Header 
          isAdmin={isAdmin} 
          onAdminToggle={() => isAdmin ? handleAdminLogout() : setShowAdminModal(true)} 
        />

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-5 space-y-6">
            <RegistrationForm onSubmit={handleSubmit} isSubmitting={submitting} />
            
            {/* Quick Stat Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-white">
              <h3 className="text-lg font-medium mb-1 opacity-80">Total Anggota IPAMA</h3>
              <p className="text-4xl font-bold">{members.length}</p>
              <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 transition-all duration-1000" 
                  style={{ width: `${Math.min(members.length, 100)}%` }} 
                />
              </div>
              <p className="text-xs mt-2 opacity-60">
                {members.length > 0 
                  ? `Pendaftar terakhir: ${new Date(Math.max(...members.map(m => m.timestamp))).toLocaleDateString()}` 
                  : 'Belum ada anggota'}
              </p>
            </div>
          </div>

          {/* List/Table Section */}
          <div className="lg:col-span-7">
            <MemberList 
              members={members} 
              isAdmin={isAdmin} 
              onDelete={handleDelete}
              onExport={handleExport}
              isLoading={loading}
            />
          </div>
        </div>
      </div>

      <AdminModal 
        isOpen={showAdminModal} 
        onClose={() => setShowAdminModal(false)} 
        onLogin={handleAdminLogin} 
      />
    </div>
  );
}

export default App;