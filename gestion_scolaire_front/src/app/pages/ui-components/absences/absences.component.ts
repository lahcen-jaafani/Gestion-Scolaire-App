import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';

import { UserService } from '../../../components/services/user.service';
import { ModuleService } from '../../../components/services/module.service';
import { AbsenceService } from '../../../components/services/absence.service';
import { MajorService } from 'src/app/components/services/major.service';
import Swal from 'sweetalert2';
import {User} from "../../../models/User.model";
import {Subscription} from "rxjs";
import {AuthService} from "../../../components/services/auth.service";

@Component({
  selector: 'app-absences',
  templateUrl: './absences.component.html',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatDividerModule,
    MatOptionModule,
    MatIconModule,
    MatSelectModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    RouterModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatNativeDateModule
  ]
})
export class AbsencesComponent implements OnInit {
  modules: any[] = [];
  majors: any[] = [];
  selectedTimeSlot: string = '';
  etudiants: any[] = [];
  years: string[] = [];
  niveaux: string[] = ['1ère année', '2ème année', '3ème année'];
  selectedNiveau: string = '';
  selectedYear: string = '';
  selectedMajorId: number | null = null;
  selectedModuleId: number | null = null;
  selectedDate: Date | null = null;

  selectedSemester: string = '';
  isLoading: boolean = false;
  userFullName: string = '';
  currentProfId: number | null = null;
  isAuthenticated: boolean = false;
  private userSubscription!: Subscription;

  absentMap: { [etudiantId: number]: boolean } = {};

  displayedColumns: string[] = ['nom', 'prenom','cne', 'absent'];
  semesters: string[] = ['Semestre 1', 'Semestre 2', 'Semestre 3', 'Semestre 4', 'Semestre 5', 'Semestre 6'];
  private students: any[];
  constructor(
    private userService: UserService,
    private majorService: MajorService,
    private moduleService: ModuleService,
    private absenceService: AbsenceService,private authService:AuthService
  ) {}
  loadMajors(): void {
    if (!this.currentProfId) return;

    this.majorService.getByProfessor(this.currentProfId).subscribe({
      next: (data) => this.majors = data,
      error: (err) => {
        console.error('Error loading majors', err);
        Swal.fire('Erreur', 'Impossible de charger les filières', 'error');
      }
    });
  }
  onSemesterOrYearChange(): void {
    if (this.selectedMajorId && this.selectedSemester && this.selectedYear) {
      this.loadModules();
    }
  }
  onMajorChange(): void {
    this.selectedModuleId = null;
    this.modules = [];
    this.students = [];

    if (this.selectedMajorId && this.selectedSemester && this.selectedYear) {
      this.loadModules();
    }
  }
  loadModules(): void {
    if (!this.selectedMajorId || !this.currentProfId || !this.selectedSemester || !this.selectedYear) {
      return;
    }

    this.moduleService.getModulesByMajorProfessorSemesterAndYear(
      this.selectedMajorId,
      this.currentProfId,
      this.selectedSemester,
      this.selectedYear
    ).subscribe({
      next: (data) => this.modules = data,
      error: (err) => {
        console.error('Error loading modules', err);
        Swal.fire('Erreur', 'Impossible de charger les modules', 'error');
      }
    });
  }



  ngOnInit(): void {

    this.loadMajors();
    this.userSubscription = this.authService.getCurrentUser$().subscribe({
      next: (user: User | null) => {
        if (user?.id) {
          this.userFullName = `${user.firstName} ${user.lastName}`;
          this.isAuthenticated = true;
          this.currentProfId = user.id;

          this.loadMajors();
          this.loadModules();
          this.generateAnneesUniversitaires();
        } else {
          this.handleUnauthenticatedUser();
        }
      },
      error: (err) => {
        console.error('Error getting user:', err);
        this.handleUnauthenticatedUser();
      }
    });

  }
  private handleUnauthenticatedUser(): void {
    this.userFullName = '';
    this.isAuthenticated = false;
    this.currentProfId = null;
    Swal.fire('Accès non autorisé', 'Vous devez être connecté pour accéder à cette page.', 'error');
  }




  filterStudents(): void {
    if (!this.selectedYear || !this.selectedMajorId || !this.selectedNiveau) return;

    this.userService.getStudentsByYearAndMajor(this.selectedYear, this.selectedMajorId, this.selectedNiveau).subscribe(data => {
      this.etudiants = data;
      this.absentMap = {};
      for (let e of this.etudiants) this.absentMap[e.id] = false;
    });
  }
  get filteredModules(): any[] {
    if (!this.selectedMajorId) return [];
    return this.modules.filter(module => module.majorId === this.selectedMajorId);
  }

  saveAbsences(): void {
    if (!this.selectedModuleId || !this.selectedDate || !this.selectedTimeSlot) {
      Swal.fire('Erreur', 'Veuillez sélectionner un module et une date et un créneau horaire. ', 'error');
      return;
    }

    const dateStr = this.selectedDate.toISOString().split('T')[0];
    const absents = Object.keys(this.absentMap).filter(id => this.absentMap[+id]);

    if (absents.length === 0) {
      Swal.fire({
        title: 'Tous les étudiants sont présents',
        text: 'Aucune absence n\'a été enregistrée car tous les étudiants sont marqués comme présents.',
        icon: 'info',
        confirmButtonText: 'OK',
        confirmButtonColor: '#4f46e5'
      });
      return;
    }

    const absenceRequests = absents.map(studentId => ({
      etudiantId: +studentId,
      moduleId: this.selectedModuleId,
      professeurId: this.currentProfId,
      date: dateStr,
      timeSlot: this.selectedTimeSlot,
    }));

    this.absenceService.saveMultiple(absenceRequests).subscribe({
      next: () => {
        Swal.fire('Succès', 'Les absences ont été enregistrées.', 'success');
        this.absentMap = {};
      },
      error: () => Swal.fire('Erreur', 'Échec lors de l’enregistrement.', 'error')
    });
  }

  generateAnneesUniversitaires(): void {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i <= 4; i++) {
      const start = currentYear - i;
      const end = start + 1;
      this.years.push(`${start}-${end}`);
    }}
}
