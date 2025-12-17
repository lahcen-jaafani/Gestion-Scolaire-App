import { Component } from '@angular/core';
import { DepartementService } from 'src/app/components/services/departement.service';
import { Departement } from 'src/app/models/departement.model';
import { GenericCrudComponent } from '../generic-crud-component/generic-crud-component.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { UserService } from 'src/app/components/services/user.service';
import { switchMap, map } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import {ProfService} from "../../../components/services/Prof.service";
import {AuthService} from "../../../components/services/auth.service";

@Component({
  selector: 'app-departments',
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
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss'
})
export class DepartmentsComponent extends GenericCrudComponent<Departement> {
  backendUrl = 'http://localhost:8080';

  constructor(
    protected override service: DepartementService,
    private userService: UserService,private profService: ProfService,protected authService:AuthService
  ) {
    super(service);
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
