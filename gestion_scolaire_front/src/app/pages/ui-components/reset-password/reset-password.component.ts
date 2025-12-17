import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MaterialModule} from "../../../material.module";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatCheckboxModule} from "@angular/material/checkbox";

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterModule,MatCardModule, MaterialModule,CommonModule, FormsModule, ReactiveFormsModule,MatCardModule,MatButtonModule,MatFormFieldModule,MatInputModule,MatIconModule,MatCheckboxModule],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';
  isSubmitting = false;

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
        alert('Reset token missing in the URL.');
      }
    });
  }

  get f() {
    return this.form.controls;
  }

  submit(): void {
    if (this.form.invalid || !this.token) {
      alert('Please fill out the form correctly and ensure the reset link is valid.');
      return;
    }

    this.isSubmitting = true;

    const resetData = {
      email: this.form.value.email,
      newPassword: this.form.value.newPassword,
      token: this.token
    };

    this.http.post('http://localhost:8080/auth/reset-password', resetData, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          alert('Your password has been reset successfully.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error(err);
          alert(err.error || 'Failed to reset password. Please try again.');
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
  }
}
