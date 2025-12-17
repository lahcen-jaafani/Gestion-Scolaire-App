// src/app/services/generic.service.ts
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class GenericService<T, ID> {
  constructor(protected http: HttpClient, private baseUrl: string) {}

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.baseUrl);
  }

  getById(id: ID): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${id}`);
  }

  create(data: T): Observable<T> {
    return this.http.post<T>(this.baseUrl, data);
  }

  update(id: ID, data: T): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: ID): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
