import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Angular Material modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import Swal from "sweetalert2";
import {MajorService} from "../../../components/services/major.service";

@Component({
  selector: 'app-add-student',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCard
  ],
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss']
})
export class AddStudentComponent implements OnInit {
  form!: FormGroup;
  majors: any[] = [];
  years: string[] = [];
  selectedSemester: string = 'Semestre 1';
  niveaux: string[] = ['1ère année', '2ème année', '3ème année'];
  selectedNiveau: string = '';
  selectedMajorId: number | null = null;


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private majorService:MajorService

  ) {}

  ngOnInit(): void {
    this.loadMajors();
    this.generateAnneesUniversitaires();

    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      cne: ['', Validators.required],
      semester: ['', Validators.required],
      niveauScolaire: ['', Validators.required],
      anneeUniversitaire: ['', Validators.required],
      majorId: [null, Validators.required],
      role: ['STUDENT', Validators.required]

    });
  }
  loadMajors(): void {
    this.majorService.getAll().subscribe(data => this.majors = data);
  }
  submit(): void {
    if (this.form.invalid) return;

    const values = this.form.getRawValue();
    const password = values.lastName.toLowerCase() + '@usms';

    const student = {
      ...values,
      password,
      role: 'STUDENT'
    };

    this.http.post('http://localhost:8080/api/student', student).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Étudiant ajouté avec succès !',
          showConfirmButton: false,
          timer: 2000
        });

        this.router.navigate(['/ui-components/students']);
        this.form.reset();
        this.form.patchValue({ role: 'STUDENT' });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: "Une erreur s'est produite lors de l'ajout de l'étudiant.",
          footer: err?.error?.message || ''
        });
        console.error('Erreur lors de l’ajout de l’étudiant', err);
      }
    });
  }


  private generateAnneesUniversitaires(): void {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i <= 4; i++) {
      const start = currentYear - i;
      const end = start + 1;
      this.years.push(`${start}-${end}`);
    }
  }
}
