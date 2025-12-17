// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { GenericService } from './generic.service';
import { User } from 'src/app/models/User.model';
import { Observable } from 'rxjs/internal/Observable';
import {Student} from "../../models/Student.model";
import {catchError, of} from "rxjs";
import {StudentNote} from "../../models/StudentNote.model";
import {StudentWithNotes} from "../../models/StudentWithNotes.model";

@Injectable({ providedIn: 'root' })
export class StudentService extends GenericService<Student, number> {
    private backendUrl = 'http://localhost:8080/api/student';

    constructor(http: HttpClient) {
      super(http, 'http://localhost:8080/api/student');
    }

  getStudentsByModule(moduleId: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.backendUrl}/module/${moduleId}`);
  }

  getStudentsByYearAndMajor(year: string, majorId: number, niveau: string): Observable<Student[]> {
    return this.http.get<Student[]>(`http://localhost:8080/api/student/by-year-major-niveau`, {
      params: { year, majorId: majorId.toString(), niveau }
    });
  }
  getStudentsByMajorAndSemester(majorId: number, semester: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.backendUrl}/by-major-semester`, {
      params: {
        majorId: majorId.toString(),
        semester: semester
      }
    }).pipe(
      catchError(error => {
        console.error('Error fetching students:', error);
        return of([]); // Retourne un tableau vide en cas d'erreur
      })
    );

  }
  getStudentsWithNotesByCriteria(
    majorId: number,
    semester: string,
    anneeUniversitaire: string,
    moduleId?: number,
    sessionType?: string
  ): Observable<StudentWithNotes[]> {
    const params: any = {
      majorId: majorId.toString(),
      semester,
      anneeUniversitaire
    };

    if (moduleId) params.moduleId = moduleId.toString();
    if (sessionType) params.sessionType = sessionType;

    return this.http.get<StudentWithNotes[]>(`${this.backendUrl}/with-notes`, { params });
  }
  getStudentsWithNotesByCriteria2(
    majorId?: number,
    semester?: string,
    anneeUniversitaire?: string,
    moduleId?: number,
    sessionType?: string,
    etudiantId?: number
  ): Observable<StudentWithNotes[]> {
    let params = new HttpParams();

    if (majorId) params = params.append('majorId', majorId.toString());
    if (semester) params = params.append('semester', semester);
    if (anneeUniversitaire) params = params.append('anneeUniversitaire', anneeUniversitaire);
    if (moduleId) params = params.append('moduleId', moduleId.toString());
    if (sessionType) params = params.append('sessionType', sessionType);
    if (etudiantId) params = params.append('etudiantId', etudiantId.toString());

    return this.http.get<StudentWithNotes[]>(`${this.backendUrl}/with-note`, { params });
  }



  getNotesWithStudents(
    majorId: number,
    semester: string,
    anneeUniversitaire: string,
    moduleId: number,
    sessionType: string
  ): Observable<any[]> {
    const params = new HttpParams()
      .set('majorId', majorId.toString())
      .set('semester', semester)
      .set('anneeUniversitaire', anneeUniversitaire)
      .set('moduleId', moduleId.toString())
      .set('sessionType', sessionType);

    return this.http.get<any[]>(`${this.backendUrl}/with-notes`, { params });
  }

  }
