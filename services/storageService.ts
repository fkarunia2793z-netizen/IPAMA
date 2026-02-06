import { Member, FormData } from '../types';

const STORAGE_KEY = 'ipama_members_data';
const CONFIG_KEY = 'ipama_api_url';
// URL Spreadsheet yang Anda berikan telah dipasang sebagai default
const DEFAULT_API_URL = 'https://script.google.com/macros/s/AKfycbyvZuRlJFKnkjEvpsv5tIkAjWG0fiya8TC5kTBMIa3op5MNnzC4ov4b8wyMcjMzg8OWyw/exec';

export const storageService = {
  // Config Management
  setApiUrl: (url: string) => {
    localStorage.setItem(CONFIG_KEY, url);
  },

  getApiUrl: () => {
    // Menggunakan URL default jika tidak ada konfigurasi manual di localStorage
    return localStorage.getItem(CONFIG_KEY) || DEFAULT_API_URL;
  },

  // Data Operations
  getMembers: async (): Promise<Member[]> => {
    const apiUrl = storageService.getApiUrl();
    
    if (apiUrl) {
      // Fetch from Google Sheet
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        // Check if data is array (valid response) or error object
        if (Array.isArray(data)) {
          return data.sort((a, b) => b.timestamp - a.timestamp);
        }
        return [];
      } catch (error) {
        console.error("API Error:", error);
        throw error;
      }
    } else {
      // Local Storage Fallback
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    }
  },

  addMember: async (data: FormData): Promise<Member> => {
    const newMember: Member = {
      id: crypto.randomUUID(),
      ...data,
      timestamp: Date.now(),
    };

    const apiUrl = storageService.getApiUrl();

    if (apiUrl) {
      // Post to Google Sheet
      // IMPORTANT: Content-Type must be text/plain to avoid CORS Preflight (OPTIONS request)
      // Google Apps Script Web Apps do not handle OPTIONS requests automatically.
      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({ action: 'add', data: newMember })
      });
    } else {
      // Local Storage
      const members = await storageService.getMembersFallback();
      const updatedMembers = [...members, newMember];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMembers));
    }
    
    return newMember;
  },

  deleteMember: async (id: string): Promise<void> => {
    const apiUrl = storageService.getApiUrl();

    if (apiUrl) {
      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({ action: 'delete', id: id })
      });
    } else {
      const members = await storageService.getMembersFallback();
      const filtered = members.filter(m => m.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
  },

  // Helper for local storage reading
  getMembersFallback: async (): Promise<Member[]> => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  exportToCSV: (members: Member[]) => {
    const headers = ['No', 'Nama Lengkap', 'No HP', 'Prodi', 'Kelas', 'Alamat', 'Alasan Bergabung', 'Waktu Daftar'];
    const rows = members.map((m, index) => [
      index + 1,
      `"${m.name}"`,
      `"${m.phone}"`,
      `"${m.studyProgram}"`,
      `"${m.classGrade}"`,
      `"${m.address.replace(/"/g, '""')}"`,
      `"${m.reason.replace(/"/g, '""')}"`,
      `"${new Date(m.timestamp).toLocaleString('id-ID')}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    // Ubah nama file download menjadi Anggota
    link.setAttribute('download', `IPAMA_Anggota_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};