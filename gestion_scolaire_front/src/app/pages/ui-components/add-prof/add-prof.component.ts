import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommonModule} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCard} from "@angular/material/card";
import Swal from "sweetalert2";

@Component({
  selector: 'app-add-prof',
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
  templateUrl: './add-prof.component.html',
  styleUrl: './add-prof.component.scss'
})
export class AddProfComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar
) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['PROFESSOR', Validators.required]
    });
  }


  submit(): void {
    if (this.form.invalid) return;

    const formValue = {
      ...this.form.getRawValue(),
    };

    this.http.post('http://localhost:8080/api/prof', formValue).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Professeur ajouté avec succès!',
          confirmButtonColor: '#4caf50'
        });
        this.form.reset({ role: 'PROFESSOR' });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Erreur lors de l’ajout de prof.',
          confirmButtonColor: '#f44336'
        });
        console.error(err);
      }
    });
  }

}

