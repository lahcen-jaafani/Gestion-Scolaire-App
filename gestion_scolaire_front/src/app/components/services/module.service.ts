
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Module } from 'src/app/models/Module.model';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/User.model';
import {GenericService} from "./generic.service";
import {Major} from "../../models/major.model";

@Injectable({
  providedIn: 'root'
})
export class ModuleService  extends GenericService<Major, number> {
  private baseUrle = 'http://localhost:8080/api/modules';
  constructor(http: HttpClient) {
    super(http, 'http://localhost:8080/api/modules'); // adapte à ton backend
  }

  private backendUrl = 'http://localhost:8080/api/modules'; // adjust if needed

  getModuleById(id: number): Observable<any> {
    return this.http.get<any>(`${this.backendUrl}/${id}`);
  }

  // Get modules for a professor by ID (only if role = PROFESSOR)
  getModulesByProfessorId(professorId: number): Observable<Module[]> {
    return this.http.get<Module[]>(`${this.backendUrl}/professors/${professorId}/modules`);
  }

  // Get modules by filière (major)
  getModulesByMajorId(majorId: number): Observable<Module[]> {
    return this.http.get<Module[]>(`${this.backendUrl}/majors/${majorId}/modules`);
  }
  getAllProfessors(): Observable<User[]> {
    return this.http.get<User[]>(`http://localhost:8080/api/users/professors`);
  }
  // (optional) Get all modules by role = PROFESSOR
  getAllModulesByProfessors(): Observable<Module[]> {
    return this.http.get<Module[]>(`${this.backendUrl}/professors/modules`);
  }

  getModulesByMajorAndProfessor(majorId: number, professorId: number): Observable<Module[]> {
    return this.http.get<Module[]>(`${this.backendUrl}/majors/${majorId}/professors/${professorId}/modules`);
  }
  getModulesByProfessor(profId: number) {
    return this.http.get<Module[]>(`${this.backendUrl}/modules/professor/${profId}`);
  }

  getModulesByMajor(majorId: number) {
    return this.http.get<Module[]>(`${this.backendUrl}/modules/major/${majorId}`);
  }
  getModulesByMajorProfessorSemesterAndYear(
    majorId: number,
    professorId: number,
    semester: string,
    academicYear: string
  ): Observable<any[]> {
    return this.http.get<any[]>(`${this.backendUrl}/majors/${majorId}/professors/${professorId}/modules`, {
      params: {
        semester,
        anneeUniversitaire: academicYear
      }
    });
  }
  addModule(moduleData: any) {
    return this.http.post(`${this.backendUrl}`, moduleData);
  }
  getModulesByMajorAndSemester(majorId: number, semester: string, anneeUniversitaire: string): Observable<Module[]> {
    return this.http.get<Module[]>(
      `${this.backendUrl}/${majorId}/modules?semester=${semester}&anneeUniversitaire=${anneeUniversitaire}`
    );
  }





}
