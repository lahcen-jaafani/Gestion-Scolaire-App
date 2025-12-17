// src/app/models/user.model.ts
import {Note} from "./Note.model";

export interface Student {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  anneeUniversitaire:string;
    role: string;
  niveauScolaire:string;
    cne:string;
  majorId:number;
  nom?: string;
  prenom?: string;

  notes?: Note[];
  }
