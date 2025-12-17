import {Note} from "./Note.model";

export interface StudentWithNotes {
  id: number;
  firstName: string;
  lastName: string;
  cne: string;
  semester: string;
  anneeUniversitaire: string;
  niveauScolaire: string;
  majorId: number;
  majorName: string;
  notes: Note[];
}
