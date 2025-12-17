// announces-detaille.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';

import { GenericCrudComponent } from '../generic-crud-component/generic-crud-component.component';
import { AnounceService } from 'src/app/components/services/anounce.service';
import { Anounce } from 'src/app/models/Anounce.model';

@Component({
  selector: 'app-anonce-crud',
  standalone: true,
  templateUrl: './announces-detaille.component.html',
  styleUrls: ['./announces-detaille.component.scss'],
  imports: [
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    RouterModule,
    MatDividerModule
  ],
})
export class AnonceCrudComponent extends GenericCrudComponent<Anounce> implements OnInit {
  backendUrl = 'http://localhost:8080';

  constructor(
    protected override service: AnounceService,
    private route: ActivatedRoute
  ) {
    super(service);
  }

  override ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.viewItem(+id); // '+' to convert to number
    }
  }
}
