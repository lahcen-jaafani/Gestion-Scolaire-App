import { Component } from '@angular/core';
import { MajorService } from 'src/app/components/services/major.service';
import { GenericCrudComponent } from '../generic-crud-component/generic-crud-component.component';
import { Major } from 'src/app/models/major.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';



import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-major-managmaent',
  imports: [
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    RouterModule,
    MatMenuModule,
    FormsModule,
    MatSelectModule,
    
    
  ],
  templateUrl: './major-managmaent.component.html',
  styleUrl: './major-managmaent.component.scss'
})
export class MajorManagmaentComponent extends GenericCrudComponent<Major> {
  backendUrl = 'http://localhost:8080';  // définis ici l'url backend
  displayedColumns: string[] = ['id', 'name', 'contenu', 'actions'];
  constructor(protected override service: MajorService) {
    super(service);
  }
}
