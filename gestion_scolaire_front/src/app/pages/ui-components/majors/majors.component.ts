import { Component } from '@angular/core';
import { GenericCrudComponent } from '../generic-crud-component/generic-crud-component.component';
import { Major } from 'src/app/models/major.model';
import { MajorService } from 'src/app/components/services/major.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import {map, switchMap} from "rxjs/operators";
import {forkJoin, of} from "rxjs";
import {ProfService} from "../../../components/services/Prof.service";

@Component({
  selector: 'app-majors',
  standalone: true,
  templateUrl: './majors.component.html',
  styleUrls: ['./majors.component.scss'],
   imports: [
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    MatIconModule,
    ],
})
export class MajorsComponent extends GenericCrudComponent<Major> {
  backendUrl = 'http://localhost:8080'; // Backend URL

  constructor(
    protected override service: MajorService,
    private http: HttpClient,private profService:ProfService,// ✅ Inject HttpClient here
  ) {
    super(service);
  }

  downloadPdf(id: number): void {
    this.http.get(`${this.backendUrl}/api/majors/download/${id}`, {
      responseType: 'blob'
    }).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `major-${id}.pdf`; // Optional: dynamic filename
      document.body.appendChild(a); // Required for Firefox
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Download error:', error);
    });
  }
  override loadItems(): void {
    this.service.getAll().pipe(
      switchMap(departments => {
        const withChef$ = departments.map(dept => {
          if (dept.chefId) {
            return this.profService.getUserById(dept.chefId).pipe(
              map(chef => ({
                ...dept,
                chef
              }))
            );
          } else {
            return of({ ...dept, chef: null });
          }
        });
        return forkJoin(withChef$);
      })
    ).subscribe(departmentsWithChef => {
      this.items = departmentsWithChef;
    });
  }
}
