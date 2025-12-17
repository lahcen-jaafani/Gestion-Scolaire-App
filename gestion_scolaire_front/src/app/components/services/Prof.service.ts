// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { User } from 'src/app/models/User.model';
import { Observable } from 'rxjs/internal/Observable';
import {Prof} from "../../models/Prof.model";

@Injectable({ providedIn: 'root' })
export class ProfService extends GenericService<Prof, number> {
    private backendUrl = 'http://localhost:8080/api/prof';

    constructor(http: HttpClient) {
      super(http, 'http://localhost:8080/api/prof');
    }


    getUserById(id: number): Observable<User> {
        return this.http.get<User>(`${this.backendUrl}/${id}`);
    }
  getAllProfessors(): Observable<Prof[]> {
    return this.http.get<Prof[]>(`${this.backendUrl}`);
  }



  }
