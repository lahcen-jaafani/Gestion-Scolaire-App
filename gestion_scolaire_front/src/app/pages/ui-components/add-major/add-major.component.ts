import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { Major } from 'src/app/models/major.model';
import { Departement } from 'src/app/models/departement.model';
import { MajorService } from 'src/app/components/services/major.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from 'src/app/components/services/user.service';

@Component({
  selector: 'app-add-major',
  standalone: true,
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
  templateUrl: './add-major.component.html',
  styleUrls: ['./add-major.component.scss']
})
export class AddMajorComponent implements OnInit {

  form: FormGroup;
  selectedFile!: File;
  majors: Major[] = [];
  departements: Departement[] = [];
  professors: any[] = [];
  backendUrl = 'http://localhost:8080/api/majors';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private majorService: MajorService,
    private router: Router,
   private userService:UserService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      contenu: ['', Validators.required],
      departementId: [null, Validators.required],
      chefId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadDepartements();
    this.loadProfessors();
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
  loadDepartements(): void {
    this.http.get<Departement[]>('http://localhost:8080/api/departments')
      .subscribe({
        next: data => this.departements = data,
        error: err => console.error('Erreur chargement départements:', err)
      });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  submit(): void {
    if (this.form.valid && this.selectedFile) {
      const { name, contenu, departementId, chefId } = this.form.value;
  
      this.majorService.createMajorWithPdf(name, contenu, this.selectedFile, departementId, chefId)
        .subscribe({
          next: () => {
            alert('Filière ajoutée avec succès');
            this.router.navigate(['/ui-components/majors']);
          },
          error: err => {
            alert('Échec de l\'ajout de la filière');
            console.error(err);
          }
        });
    } else {
      alert('Veuillez remplir tous les champs et sélectionner un fichier.');
    }
  }
  
}
