import React, { useState, useEffect } from 'react';
import { X, Lock, AlertCircle, Database, Save, Check, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { storageService } from '../services/storageService';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (password: string) => boolean;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [apiUrl, setApiUrl] = useState('');
  const [saved, setSaved] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (sessionStorage.getItem('ipama_admin') === 'true') {
        setIsAuthenticated(true);
        setApiUrl(storageService.getApiUrl() || '');
      } else {
        setIsAuthenticated(false);
        setPassword('');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(password)) {
      setIsAuthenticated(true);
      setError(false);
      setApiUrl(storageService.getApiUrl() || '');
    } else {
      setError(true);
    }
  };

  const handleSaveConfig = () => {
    storageService.setApiUrl(apiUrl);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all scale-100">
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center sticky top-0 z-10">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Lock className="text-emerald-600" size={20} />
            {isAuthenticated ? 'Pengaturan Database' : 'Admin Access'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        {!isAuthenticated ? (
          <form onSubmit={handleSubmit} className="p-6">
            <p className="text-sm text-slate-600 mb-4">
              Masukkan password administrator untuk mengelola data.
            </p>
            
            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Password..."
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                autoFocus
              />
              {error && (
                <div className="flex items-center gap-1.5 mt-2 text-red-500 text-xs font-medium">
                  <AlertCircle size={14} />
                  Password salah!
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all"
              >
                Masuk
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6">
            <div className="mb-4">
               <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                 <Database size={16} className="text-emerald-600"/>
                 Google Apps Script URL
               </label>
               <p className="text-xs text-slate-500 mb-2">
                 Paste URL Web App dari Google Apps Script di sini.
               </p>
               <textarea
                 value={apiUrl}
                 onChange={(e) => setApiUrl(e.target.value)}
                 placeholder="https://script.google.com/macros/s/.../exec"
                 className="w-full h-20 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-mono"
               />
            </div>

            <button
              onClick={handleSaveConfig}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all mb-4
                ${saved 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20'}
              `}
            >
              {saved ? (
                <>
                  <Check size={18} />
                  Tersimpan!
                </>
              ) : (
                <>
                  <Save size={18} />
                  Simpan Konfigurasi
                </>
              )}
            </button>
            
            <div className="border-t border-slate-100 pt-4">
              <button 
                onClick={() => setShowGuide(!showGuide)}
                className="flex items-center justify-between w-full text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle size={16} />
                  Cara Menghubungkan Spreadsheet
                </span>
                {showGuide ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showGuide && (
                <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs text-slate-600 space-y-2 leading-relaxed">
                  <p>1. Buat Google Sheet baru, beri nama tab <strong>"Anggota"</strong> (Bukan "Sheet1" atau "Members").</p>
                  <p>2. Buat header baris 1: <code>id, name, phone, studyProgram, classGrade, address, reason, timestamp</code>.</p>
                  <p>3. Klik <strong>Extensions</strong> &gt; <strong>Apps Script</strong>.</p>
                  <p>4. Paste kode dari file <code>README.md</code>.</p>
                  <p>5. Klik <strong>Deploy</strong> &gt; <strong>New deployment</strong> &gt; Type: <strong>Web app</strong>.</p>
                  <p>6. Set <em>Who has access</em> ke <strong>"Anyone"</strong> (Penting!).</p>
                  <p>7. Copy URL yang dihasilkan dan paste di kolom di atas.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};