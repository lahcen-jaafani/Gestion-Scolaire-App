import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { GenericService } from './generic.service';
import { Anounce } from 'src/app/models/Anounce.model';
import { Major } from 'src/app/models/major.model';
import { Observable } from 'rxjs';
import {Note} from "../../models/Note.model";
import {Module} from "../../models/Module.model";

@Injectable({
  providedIn: 'root'
})
export class NotesService extends GenericService<Note, number> {
  private baseUrle = 'http://localhost:8080/api/notes';
  constructor(http: HttpClient) {
    super(http, 'http://localhost:8080/api/notes'); // adapte à ton backend
  }
  getNotesByModule(moduleId: number): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.baseUrle}/module/${moduleId}`);
  }
  getNotesByProfessorAndMajorAndSemester(
    professorId: number,
    majorId: number,
    semester: string,
    sessionType: string
  ): Observable<Note[]> {
    const params = new HttpParams()
      .set('professorId', professorId.toString())
      .set('majorId', majorId.toString())
      .set('semester', semester)
      .set('sessionType', sessionType);

    return this.http.get<Note[]>(`${this.baseUrle}/by-professor-major-semester`, { params });
  }
  getNotesByModuleAndSessionType(moduleId: number | null, sessionType: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrle}/module/${moduleId}/session/${sessionType}`
    );
  }
  getNotesWithStudents(moduleId: number, sessionType: string): Observable<Note[]> {
    return this.http.get<Note[]>(
      `${this.baseUrle}/module/${moduleId}/session/${sessionType}`
    );
  }
  updateNote(noteId: number, noteData: any): Observable<any> {
    return this.http.put(`${this.baseUrle}/${noteId}`, noteData);
  }

  saveMultipleNotes(notes: any[], professorId: number): Observable<any> {
    return this.http.post(`${this.baseUrle}/batch`, notes, {
      headers: {
        'X-Professeurs-Id': professorId.toString()
      }
    });
  }
  getModulesByMajorAndProfessor(majorId: number, professorId: number): Observable<Module[]> {
    return this.http.get<Module[]>(`${this.baseUrle}/majors/${majorId}/professors/${professorId}/modules`);
  }

  getModulesByProfessor(professorId: number): Observable<Module[]> {
    return this.http.get<Module[]>(`${this.baseUrle}/professeur/${professorId}`);
  }

  getModulesByMajorAndSemester(majorId: number, semester: string, academicYear: string): Observable<Module[]> {
    return this.http.get<Module[]>(`${this.baseUrle}/${majorId}/modules`, {
      params: {
        semester,
        anneeUniversitaire: academicYear
      }
    });
  }
}
