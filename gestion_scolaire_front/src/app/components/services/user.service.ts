// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { User } from 'src/app/models/User.model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({ providedIn: 'root' })
export class UserService extends GenericService<User, number> {
    private backendUrl = 'http://localhost:8080/api';
private apiUrl='http://localhost:8080/api/statistics'
    constructor(http: HttpClient) {
      super(http, 'http://localhost:8080/api/student');
    }
  getUserStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }
    getAllProfessors(): Observable<User[]> {
      return this.http.get<User[]>(`${this.backendUrl}/prof`);
    }
    getUserById(id: number): Observable<User> {
        return this.http.get<User>(`${this.backendUrl}/${id}`);
    }
    getAllStudents(): Observable<User[]> {
        return this.http.get<User[]>(`${this.backendUrl}/student`);
  }
  getStudentsByYearAndMajor(year: string, majorId: number, niveau: string): Observable<User[]> {
    return this.http.get<User[]>(`http://localhost:8080/api/student/by-year-major-niveau`, {
      params: { year, majorId: majorId.toString(), niveau }
    });
  }


  }
