import { Component } from '@angular/core';
import { MajorService } from 'src/app/components/services/major.service';
import { Major } from 'src/app/models/major.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { HttpClient, HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-departement-details',
   imports: [
      CommonModule,
      HttpClientModule,
      MatCardModule,
      MatIconModule,
      MatButtonModule,
      MatTooltipModule,
      RouterModule,
     MatMenuModule,
     MatExpansionModule,
      
    ],
  templateUrl: './departement-details.component.html',
  styleUrl: './departement-details.component.scss'
})
export class DepartementDetailsComponent {
  majors: Major[] = [];
  backendUrl = 'http://localhost:8080';

  constructor(
    private route: ActivatedRoute,
    private majorService: MajorService,
    private http: HttpClient ,
  ) {}
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        const departementId = +id; // convert to number
        this.loadMajorsForDepartement(departementId);
      }
    });
  }
  loadMajorsForDepartement(departementId: number) {
    this.majorService.getMajorsByDepartement(departementId).subscribe(data => {
      this.majors = data;
    });
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
}
