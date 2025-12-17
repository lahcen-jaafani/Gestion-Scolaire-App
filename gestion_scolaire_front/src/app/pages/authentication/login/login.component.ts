// src/app/pages/login/login.component.ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {CommonModule} from "@angular/common";
import {AuthService} from "../../../components/services/auth.service";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  hide = true;
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private http: HttpClient, private router: Router,private authService:AuthService) {}

  submit() {
    if (this.form.valid) {
      this.http.post<any>('http://localhost:8080/auth/login', this.form.value).subscribe({
        next: (res) => {
          if (res.user && res.user.firstName && res.user.lastName) {
            this.authService.setUser(res.user, res.token); // update auth service
            console.log('Utilisateur connecté :', res.user.firstName, res.user.lastName);
          } else {
            console.warn('User data is missing in the response:', res);
          }

          this.router.navigate(['/dashboard']);
        },
        error: (err) => alert('Login failed: ' + (err.error.message || 'Invalid credentials')),
      });
    }
  }
}
