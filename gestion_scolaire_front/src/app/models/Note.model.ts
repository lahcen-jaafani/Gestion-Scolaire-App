// src/app/models/user.model.ts
import {Student} from "./Student.model";

export interface Note {
  id: number;
  etudiantId: number;
  moduleId: number;
  cc1?: number;
  cc2?: number;
  nr?: number;
  moyenne?: number;
  observation?: string;
  sessionType: string;
  professeurId: number;
  noteFinale?: number | string;
  etudiant?: {
    firstName: string;
    lastName: string;
    cne: string;
  };
}


