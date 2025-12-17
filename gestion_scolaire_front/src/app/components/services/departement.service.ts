// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { User } from 'src/app/models/User.model';
import { Observable } from 'rxjs/internal/Observable';
import { Departement } from 'src/app/models/departement.model';

@Injectable({ providedIn: 'root' })
export class DepartementService extends GenericService<Departement, number> {


    constructor(http: HttpClient) {
      super(http, 'http://localhost:8080/api/departments');
    }

  }
