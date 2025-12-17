import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MajorService } from 'src/app/components/services/major.service';
import { Major } from 'src/app/models/major.model';
import { GenericCrudComponent } from 'src/app/pages/ui-components/generic-crud-component/generic-crud-component.component';
import {AuthService} from "../../../components/services/auth.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-topstrip',
    imports: [TablerIconsModule, MatButtonModule, MatMenuModule,CommonModule,MatFormFieldModule,
        MatSelectModule,
        MatOptionModule, CommonModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        RouterModule,
        MatMenuModule],
    templateUrl: './topstrip.component.html',
})
export class AppTopstripComponent extends GenericCrudComponent<Major> {
  backendUrl = 'http://localhost:8080';
  // définis ici l'url backend
  navigateToMajor(item: any): void {
    this.router.navigate(['/ui-components/majors', item.id]);
  }
  userFullName: string = '';
  isAuthenticated: boolean = false;
  private userSubscription: Subscription;
  constructor(protected override service: MajorService,private router: Router,private authService:AuthService) {
    super(service);
  }
  override ngOnInit(): void {
    this.userSubscription = this.authService.getCurrentUser$().subscribe(user => {
      if (user && user.firstName && user.lastName) {
        this.userFullName = `${user.firstName} ${user.lastName}`;
        this.isAuthenticated = true;
      } else {
        this.userFullName = '';
        this.isAuthenticated = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  logout(): void {
    this.authService.clearUser();
    this.router.navigate(['/ui-components/login']);
  }

  loadUser(): void {
    const user = this.authService.getCurrentUser();
    if (user && user.firstName && user.lastName) {
      this.userFullName = `${user.firstName} ${user.lastName}`;
      this.isAuthenticated = true;
    } else {
      this.userFullName = '';
      this.isAuthenticated = false;
    }
  }




}
