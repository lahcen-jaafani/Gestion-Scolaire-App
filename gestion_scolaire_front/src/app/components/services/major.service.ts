import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { GenericService } from './generic.service';
import { Anounce } from 'src/app/models/Anounce.model';
import { Major } from 'src/app/models/major.model';
import {catchError, Observable, throwError} from 'rxjs';
import {studentsCount} from "../../models/pap.model";

@Injectable({
  providedIn: 'root'
})
export class MajorService extends GenericService<Major, number> {
  private baseUrle = 'http://localhost:8080/api/majors';
  constructor(http: HttpClient) {
    super(http, 'http://localhost:8080/api/majors'); // adapte à ton backend
  }
  createMajorWithPdf(
    name: string,
    contenu: string,
    file: File,
    departementId: number,
    chefId: number
  ) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('contenu', contenu);
    formData.append('departementId', departementId.toString());
    formData.append('chefId', chefId.toString()); // ✅ include chefId
    formData.append('file', file);

    return this.http.post<Major>('http://localhost:8080/api/majors/upload', formData);
  }


  // Create a major with full MajorDto object and PDF
  uploadMajorWithPdf(major: Major, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('major', new Blob([JSON.stringify(major)], { type: 'application/json' }));
    formData.append('pdf', file);
    return this.http.post(`${this.baseUrle}/with-pdf`, formData, { responseType: 'text' });
  }
  getMajorsWithStudentCount(year: string): Observable<studentsCount[]> {
    return this.http.get<studentsCount[]>(`${this.baseUrle}/student-count?year=${year}`);
  }
  getMajorsByDepartement(departementId: number): Observable<Major[]> {
    return this.http.get<Major[]>(`${this.baseUrle}/by-departement/${departementId}`);
  }
  getByProfessor(professorId: number): Observable<Major[]> {
    return this.http.get<Major[]>(`${this.baseUrle}/professor/${professorId}`).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred';
        if (error.status === 404) {
          errorMessage = 'Professor not found';
        } else if (error.status === 500) {
          errorMessage = 'Server error occurred';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }
  // Download PDF
  downloadPdf(id: number): void {
    this.http.get(`http://localhost:8080/api/majors/download/${id}`, {
      responseType: 'blob'
    }).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'filiere.pdf'; // you can set the filename dynamically if needed
      a.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Download error:', error);
    });
  }

}
