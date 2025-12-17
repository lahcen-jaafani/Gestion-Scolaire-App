import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';

import { GenericCrudComponent } from '../generic-crud-component/generic-crud-component.component';
import { AnounceService } from 'src/app/components/services/anounce.service';
import { Anounce } from 'src/app/models/Anounce.model';
import { AuthService } from "../../../components/services/auth.service";

@Component({
  selector: 'app-anounces',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    RouterModule,
    MatMenuModule,


  ],
  templateUrl: './anounces.component.html',
  styleUrls: ['./anounces.component.scss'],
})
export class AnouncesComponent extends GenericCrudComponent<Anounce> {
  backendUrl = 'http://localhost:8080';

  actualites: Anounce[] = [];
  evenements: Anounce[] = [];

  constructor(protected override service: AnounceService, protected authService:AuthService) {
    super(service);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.loadItems();
  }

  override loadItems(): void {
    this.service.getAll().subscribe(data => {
      this.items = data;
      this.actualites = data.filter(item => item.type === 'ACTUALITE');
      this.evenements = data.filter(item => item.type === 'EVENEMENT');
    });
  }
}
