import { Component, OnInit } from '@angular/core';
import { Module } from 'src/app/models/Module.model';
import { ModuleService } from 'src/app/components/services/module.service';
import { User } from 'src/app/models/User.model';
import { UserService } from 'src/app/components/services/user.service';
import { MajorService } from 'src/app/components/services/major.service';
import { Major } from 'src/app/models/major.model';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import {MatDividerModule} from "@angular/material/divider";

@Component({
  selector: 'app-modules',
  standalone: true,
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss'],
  imports: [
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    MatOptionModule,
    MatIconModule,
    MatSelectModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    RouterModule,
    MatDividerModule
  ],
})
export class ModulesComponent implements OnInit {
  professors: User[] = [];
  majors: Major[] = [];
  selectedMajorId: number | null = null;
  selectedSemester: string = '';
  selectedAnneeUniversitaire: string = '';
  modulesByProfessor: { [key: number]: Module[] } = {};
  semesters: string[] = ['Semestre 1', 'Semestre 2', 'Semestre 3', 'Semestre 4', 'Semestre 5', 'Semestre 6'];
  annees: string[] = [];

  constructor(
    private moduleService: ModuleService,
    private userService: UserService,
    private majorService: MajorService
  ) { }
  generateAnneesUniversitaires(): void {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i <= 4; i++) {
      const start = currentYear - i;
      const end = start + 1;
      this.annees.push(`${start}-${end}`);
    }
  }


  ngOnInit(): void {
    this.loadProfessors();
    this.generateAnneesUniversitaires();
    this.loadMajors();
  }

  loadProfessors(): void {
    this.userService.getAllProfessors().subscribe(data => {
      this.professors = data;
    });
  }

  hasModules(profId: number): boolean {
    return !!this.modulesByProfessor?.[profId]?.length;
  }
  hasAnyModules(): boolean {
    return Object.values(this.modulesByProfessor || {}).some(modules => modules && modules.length > 0);
  }

  loadMajors(): void {
    this.majorService.getAll().subscribe(data => {
      this.majors = data;
    });
  }

  getMajorIcon(majorName: string): string {
    const icons: {[key: string]: string} = {
      'Informatique': 'computer',
      'Génie Civil': 'engineering',
      'Commerce': 'business_center',
      'Santé': 'medical_services',
      'Design': 'design_services'
    };
    return icons[majorName] || 'school';
  }

  getModuleColor(moduleName: string): string {
    const colors = ['module-color-1', 'module-color-2', 'module-color-3', 'module-color-4', 'module-color-5'];
    const hash = moduleName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }
  onMajorOrSemesterChange(): void {
    if (this.selectedMajorId && this.selectedSemester && this.selectedAnneeUniversitaire) {
      console.log('Calling API with:', this.selectedMajorId, this.selectedSemester, this.selectedAnneeUniversitaire);

      this.moduleService.getModulesByMajorAndSemester(
        this.selectedMajorId,
        this.selectedSemester,
        this.selectedAnneeUniversitaire
      ).subscribe({
        next: (modules) => {
          console.log('Modules received:', modules); // ✅ DEBUG OUTPUT
          this.modulesByProfessor = {};
          for (let module of modules) {
            const profId = module.professeurId;
            if (!this.modulesByProfessor[profId]) {
              this.modulesByProfessor[profId] = [];
            }
            this.modulesByProfessor[profId].push(module);
          }
        },
        error: (err) => {
          console.error('API Error:', err); // ❌ If backend errors out
        }
      });
    }
  }

}
