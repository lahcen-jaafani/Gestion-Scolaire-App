import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ModuleService } from 'src/app/components/services/module.service';
import { UserService } from 'src/app/components/services/user.service';
import { MajorService } from 'src/app/components/services/major.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import {ProfService} from "../../../components/services/Prof.service";

@Component({
  selector: 'app-add-module',
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
  templateUrl: './add-module.component.html',
  styleUrls: ['./add-module.component.scss']
})
export class AddModuleComponent implements OnInit {
  moduleForm!: FormGroup;
  professors: any[] = [];
  majors: any[] = [];
  selectedSemester: string = 'Semestre 1';
  anneesUniversitaires: string[] = [];

  constructor(
    private fb: FormBuilder,
    private moduleService: ModuleService,
    private userService: UserService,
    private profService:ProfService,
    private majorService: MajorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.moduleForm = this.fb.group({
      nom: ['', Validators.required],
      professeurId: ['', Validators.required],
      majorId: ['', Validators.required],
      semester: ['', Validators.required],
      anneeUniversitaire: ['', Validators.required]  // ✅ nouveau champ
    });

    this.loadProfessors();
    this.loadMajors();
    this.generateAnneesUniversitaires();
  }

  loadProfessors(): void {
    this.profService.getAllProfessors().subscribe({
      next: (data) => {
        this.professors = data;
      },
      error: (err) => {
        console.error('Erreur chargement professeurs', err);
      }
    });
  }

  loadMajors(): void {
    this.majorService.getAll().subscribe({
      next: (data) => {
        this.majors = data;
      },
      error: (err) => {
        console.error('Erreur chargement filières', err);
      }
    });
  }

  // ✅ Génère des années universitaires automatiques comme 2024/2025
  generateAnneesUniversitaires(): void {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 5; i++) {
      const startYear = currentYear - i;
      const endYear = startYear + 1;
      this.anneesUniversitaires.push(`${startYear}-${endYear}`);
    }
  }

  submit(): void {
    if (this.moduleForm.valid) {
      this.moduleService.addModule(this.moduleForm.value).subscribe({
        next: (res) => {
          console.log('Module ajouté avec succès', res);
          this.moduleForm.reset();
          this.router.navigate(['/ui-components/modules']);
        },
        error: (err) => {
          console.error('Erreur ajout module', err);
        }
      });
    }
  }
}
