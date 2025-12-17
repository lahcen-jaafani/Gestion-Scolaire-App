// src/app/models/user.model.ts
export interface Absence{
  moduleId: number;
  moduleName: string;
  id: number;
  timeSlot:string;
  majorId: number;
  semester: string;
  justification: string;
  date:Date;
  etudiantId:number;
  }
