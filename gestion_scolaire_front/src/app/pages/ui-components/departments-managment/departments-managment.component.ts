import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { UserService } from 'src/app/components/services/user.service';
import { Departement } from 'src/app/models/departement.model';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-departments-managment',
  standalone: true,
  templateUrl: './departments-managment.component.html',
  styleUrls: ['./departments-managment.component.scss'],
  imports: [
     CommonModule,
     HttpClientModule,
     ReactiveFormsModule,
     FormsModule,
     MatCardModule,
     MatFormFieldModule,
     MatInputModule,
     MatButtonModule,
     MatIconModule,
     MatOptionModule,
     MatSelectModule
   ],
})
export class DepartmentsManagmentComponent implements OnInit {
  form: FormGroup;
  selectedFile: File | null = null;
  posts: Departement[] = [];
  professors: any[] = [];
  backendUrl = 'http://localhost:8080';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {
    this.form = this.fb.group({
      departementName: ['', Validators.required],
      chef: [null, Validators.required],
    });
  }
  

  ngOnInit(): void {
   
    this.loadProfessors(); // ✅ tu avais oublié de l'appeler
  }

  onFileChange(event: any): void {
    const file = event.target.files?.[0];
    if (file) this.selectedFile = file;
  }

  loadProfessors(): void {
    this.userService.getAllProfessors().subscribe({
      next: (data) => {
        this.professors = data;
      },
      error: (err) => {
        console.error('Erreur chargement professeurs', err);
      }
    });
  }

  submit(): void {
    if (this.form.invalid) return;
  
    const formData = new FormData();
  
    // Ajouter les données du formulaire sous forme de JSON dans "post"
    const jsonData = JSON.stringify({
      departementName: this.form.value.departementName,
      chefId: this.form.value.chef
    });
    formData.append('post', new Blob([jsonData], { type: 'application/json' }));
  
    // Ajouter l’image si elle existe
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
  
    this.http.post<Departement>(`${this.backendUrl}/api/departments`, formData).subscribe({
      next: (post) => {
        this.posts.unshift(post);
        this.form.reset();
        this.selectedFile = null;
        this.router.navigate(['/ui-components/departments']);
      },
      error: (err) => {
        console.error('Erreur lors de la création du département', err);
      }
    });
  }
  
}
