import React, { useState } from 'react';
import { User, Phone, BookOpen, GraduationCap, MapPin, MessageSquare, Send, RefreshCw } from 'lucide-react';
import { InputField } from './InputField';
import { FormData } from '../types';

interface RegistrationFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting: boolean;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    studyProgram: '',
    classGrade: '',
    address: '',
    reason: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    // Reset form after successful submission
    setFormData({
      name: '',
      phone: '',
      studyProgram: '',
      classGrade: '',
      address: '',
      reason: ''
    });
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-emerald-50">
          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
            <User size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Formulir Pendaftaran</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <InputField
              label="Nama Lengkap"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Contoh: Ahmad Fauzi"
              icon={<User size={18} />}
              required
            />
            
            <InputField
              label="Nomor HP (WhatsApp)"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Contoh: 0812xxxxxxxx"
              icon={<Phone size={18} />}
              required
            />

            <InputField
              label="Program Studi (Prodi)"
              name="studyProgram"
              value={formData.studyProgram}
              onChange={handleChange}
              placeholder="Contoh: Teknik Informatika"
              icon={<GraduationCap size={18} />}
              required
            />

            <InputField
              label="Kelas"
              name="classGrade"
              value={formData.classGrade}
              onChange={handleChange}
              placeholder="Contoh: TI-1A"
              icon={<BookOpen size={18} />}
              required
            />
          </div>

          <InputField
            label="Alamat Domisili"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Alamat lengkap saat ini..."
            icon={<MapPin size={18} />}
            textarea
            required
          />

          <InputField
            label="Alasan Bergabung"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Jelaskan motivasi anda bergabung dengan IPAMA..."
            icon={<MessageSquare size={18} />}
            textarea
            required
          />

          <div className="mt-8 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => setFormData({ name: '', phone: '', studyProgram: '', classGrade: '', address: '', reason: '' })}
              className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-lg shadow-emerald-500/30
                transition-all duration-300 transform hover:-translate-y-1 hover:shadow-emerald-500/50
                ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500'}
              `}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="animate-spin" size={18} />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Kirim Data
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};