export interface Member {
  id: string;
  name: string;
  phone: string;
  studyProgram: string; // Prodi
  classGrade: string;   // Kelas
  address: string;      // Alamat
  reason: string;       // Alasan Bergabung
  timestamp: number;
}

export interface FormData {
  name: string;
  phone: string;
  studyProgram: string;
  classGrade: string;
  address: string;
  reason: string;
}

export type SortField = 'timestamp' | 'name' | 'studyProgram';
export type SortOrder = 'asc' | 'desc';