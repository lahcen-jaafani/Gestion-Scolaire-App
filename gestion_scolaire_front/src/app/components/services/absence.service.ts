import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Anounce } from 'src/app/models/Anounce.model';
import {Observable} from "rxjs";
import {Absence} from "../../models/Absence.model";


@Injectable({
  providedIn: 'root'
})
export class AbsenceService extends GenericService<Absence, number> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:8080/api/absences'); // adapte à ton backend

  }

  private baseUrle = 'http://localhost:8080/api/absences';
  private apiUrl = 'http://localhost:8080/api/absences/my';

  saveMultiple(absences: any[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrle}/save-multiple`, absences);
  }

  getAbsencesByEtudiantId(etudiantId: number | null) {
    return this.http.get<any[]>(`http://localhost:8080/api/absences/etudiant/${etudiantId}`);
  }
  getAbsencesByProfessor(profId: number): Observable<Absence[]> {
    return this.http.get<Absence[]>(`${this.baseUrle}/by-professor/${profId}`);
  }
  updateAbsence(absence: any) {
    return this.http.put(`http://localhost:8080/api/absences/${absence.id}`, absence);
  }

  deleteAbsence(id: number) {
    return this.http.delete(`http://localhost:8080/api/absences/${id}`);
  }
}
