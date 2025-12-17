export interface StudentNote {
  studentId: number;
  firstName: string;
  lastName: string;
  cne: string;
  noteId: number;
  cc1?: number;
  cc2?: number;
  moyenne?: number;
  observation?: string;
  sessionType: string;
}
