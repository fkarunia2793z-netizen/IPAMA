import React from 'react';
import { Download, Trash2, Search, Users, Calendar } from 'lucide-react';
import { Member } from '../types';

interface MemberListProps {
  members: Member[];
  isAdmin: boolean;
  onDelete: (id: string) => void;
  onExport: () => void;
  isLoading: boolean;
}

export const MemberList: React.FC<MemberListProps> = ({ 
  members, 
  isAdmin, 
  onDelete, 
  onExport,
  isLoading
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.studyProgram.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => b.timestamp - a.timestamp);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-emerald-50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Daftar Anggota</h2>
            <p className="text-slate-500 text-sm">{members.length} Anggota Terdaftar</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Cari nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-64"
            />
          </div>
          
          {isAdmin && (
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-500/20"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-emerald-50/50 text-slate-600 text-sm uppercase tracking-wider">
              <th className="p-4 font-semibold border-b border-emerald-100">No</th>
              <th className="p-4 font-semibold border-b border-emerald-100">Nama</th>
              <th className="p-4 font-semibold border-b border-emerald-100">Prodi / Kelas</th>
              <th className="p-4 font-semibold border-b border-emerald-100 hidden md:table-cell">Waktu Daftar</th>
              {isAdmin && (
                <>
                  <th className="p-4 font-semibold border-b border-emerald-100">Kontak</th>
                  <th className="p-4 font-semibold border-b border-emerald-100">Alamat & Alasan</th>
                  <th className="p-4 font-semibold border-b border-emerald-100 text-right">Aksi</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50 text-sm text-slate-700">
            {isLoading ? (
              <tr>
                <td colSpan={isAdmin ? 7 : 4} className="p-8 text-center text-slate-500">
                  <div className="flex justify-center items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-75" />
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-150" />
                  </div>
                </td>
              </tr>
            ) : filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 7 : 4} className="p-8 text-center text-slate-500">
                  Belum ada data anggota yang ditemukan.
                </td>
              </tr>
            ) : (
              filteredMembers.map((member, index) => (
                <tr key={member.id} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="p-4 font-medium text-slate-400">{index + 1}</td>
                  <td className="p-4 font-semibold text-slate-800">{member.name}</td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-medium">{member.studyProgram}</span>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full w-fit mt-1">
                        {member.classGrade}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {formatDate(member.timestamp)}
                    </div>
                  </td>
                  
                  {isAdmin && (
                    <>
                      <td className="p-4 font-mono text-xs">{member.phone}</td>
                      <td className="p-4 max-w-xs">
                         <div className="truncate text-xs mb-1" title={member.address}>🏠 {member.address}</div>
                         <div className="truncate text-xs italic text-slate-500" title={member.reason}>"{member.reason}"</div>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => onDelete(member.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Data"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};