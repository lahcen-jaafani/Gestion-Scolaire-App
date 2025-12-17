import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Anounce } from 'src/app/models/Anounce.model';


@Injectable({
  providedIn: 'root'
})
export class AnounceService extends GenericService<Anounce, number> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:8080/api/posts'); // adapte à ton backend
  }
}
