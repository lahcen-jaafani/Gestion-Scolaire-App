import { Component } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MaterialModule} from "../../../material.module";
import {HttpClient} from "@angular/common/http";
import {Router, RouterLink, RouterModule} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatCheckboxModule} from "@angular/material/checkbox";

@Component({
  selector: 'app-forget-password',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule,MatCardModule,MatButtonModule,MatFormFieldModule,MatInputModule,MatIconModule,MatCheckboxModule,RouterLink],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {
  constructor(private http: HttpClient) {}
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  submit() {
    this.http.post('http://localhost:8080/auth/forgot-password', this.form.value, { responseType: 'text' }).subscribe({
      next: () => alert('Check your email for reset link'),
      error: () => alert('Error sending reset email')
    });
  }



}
