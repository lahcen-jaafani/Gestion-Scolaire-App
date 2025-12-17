import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { MajorService } from 'src/app/components/services/major.service';
import Swal from 'sweetalert2';
import { NotesService } from "../../../components/services/note.service";
import { AuthService } from "../../../components/services/auth.service";
import { Subscription } from "rxjs";
import {User} from "../../../models/User.model";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
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
export class NotesComponent implements OnInit, OnDestroy {
  modules: any[] = [];
  majors: any[] = [];
  etudiants: any[] = [];
  years: string[] = [];
  semesters: string[] = ['Semestre 1', 'Semestre 2', 'Semestre 3', 'Semestre 4', 'Semestre 5', 'Semestre 6'];
  niveaux: string[] = ['1ère année', '2ème année', '3ème année'];
  selectedNiveau: string = '';
  selectedYear: string = '';
  selectedSemester: string = '';
  selectedMajorId: number | null = null;
  selectedModuleId: number | null = null;
  currentProfId: number | null = null;
  sessionTypes: string[] = ['NORMAL', 'RATTRAPAGE'];
  selectedEvaluationType: string = 'CC1';
  selectedSessionType: string = 'NORMAL';
  notesMap: {
    [etudiantId: number]: {
      cc1: number | null,
      cc2: number | null,
      nr: number | null,  // Note de rattrapage
      moyenne: number | null,
      observation: string | null
    }
  } = {};
  updateDisplayedColumns(): void {
    this.displayedColumns = ['nom', 'prenom', 'cne'];

    if (this.selectedSessionType === 'NORMAL') {
      this.displayedColumns.push('cc1', 'cc2', 'moyenne', 'observation');
    } else {
      this.displayedColumns.push('nr', 'moyenne', 'observation'); // Changé de 'cc' à 'nr'
    }
  }

  // Colonnes affichées dynamiquement
  displayedColumns: string[] = ['nom', 'prenom', 'cne'];
  userFullName: string = '';
  isAuthenticated: boolean = false;
  private userSubscription!: Subscription;

  constructor(
    private userService: UserService,
    private majorService: MajorService,
    private moduleService: ModuleService,
    private noteService: NotesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.getCurrentUser$().subscribe({
      next: (user: User | null) => {
        if (user && user.id) {
          this.userFullName = `${user.firstName} ${user.lastName}`;
          this.isAuthenticated = true;
          this.currentProfId = user.id;
          this.loadMajorsForProfessor();
          this.generateAcademicYears();
          this.updateDisplayedColumns();
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

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  // Met à jour les colonnes affichées en fonction du type de session

  onSessionTypeChange(): void {
    this.updateDisplayedColumns();
    this.initializeNotesMap();
  }

  private handleUnauthenticatedUser(): void {
    this.userFullName = '';
    this.isAuthenticated = false;
    this.currentProfId = null;
    this.majors = [];
    this.modules = [];
    this.etudiants = [];

    Swal.fire({
      title: 'Accès non autorisé',
      text: 'Vous devez être connecté pour accéder à cette page.',
      icon: 'error',
      confirmButtonText: 'OK'
    }).then(() => {
      // Redirect to login page if needed
    });
  }

  loadMajorsForProfessor(): void {
    if (!this.currentProfId) return;

    this.majorService.getByProfessor(this.currentProfId).subscribe({
      next: (data) => this.majors = data,
      error: (err) => {
        console.error('Error loading majors', err);
        Swal.fire('Erreur', 'Impossible de charger les filières', 'error');
      }
    });
  }

  loadModulesForProfessor(): void {
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

  filterStudents(): void {
    if (!this.selectedYear || !this.selectedMajorId || !this.selectedNiveau) {
      Swal.fire('Info', 'Veuillez sélectionner une année, une filière et un niveau', 'info');
      return;
    }

    this.userService.getStudentsByYearAndMajor(this.selectedYear, this.selectedMajorId, this.selectedNiveau).subscribe({
      next: (data) => {
        this.etudiants = data;
        this.initializeNotesMap();
      },
      error: (err) => {
        console.error('Error loading students', err);
        Swal.fire('Erreur', 'Impossible de charger les étudiants', 'error');
      }
    });
  }

  private initializeNotesMap(): void {
    this.notesMap = {};
    this.etudiants.forEach(e => {
      this.notesMap[e.id] = {
        cc1: null,
        cc2: null,
        nr: null,
        moyenne: null,
        observation: null
      };
    });
  }

  calculateMoyenne(studentId: number): void {
    const notes = this.notesMap[studentId];

    if (this.selectedSessionType === 'NORMAL') {
      if (notes.cc1 !== null && notes.cc2 !== null) {
        notes.moyenne = (notes.cc1 + notes.cc2) / 2;
      }
    } else { // RATTRAPAGE
      if (notes.nr !== null) {
        notes.moyenne = notes.nr;
      }
    }
    this.updateObservation(studentId);
  }

  updateObservation(studentId: number): void {
    const notes = this.notesMap[studentId];
    if (notes.moyenne === null) {
      notes.observation = null;
      return;
    }

    if (this.selectedSessionType === 'NORMAL') {
      if (notes.moyenne < 5) {
        notes.observation = 'Non validé';
      } else if (notes.moyenne < 10) {
        notes.observation = 'Rattrapage';
      } else {
        notes.observation = 'Validé';
      }
    } else { // RATTRAPAGE
      if (notes.moyenne >= 10) {
        notes.observation = 'Validé (Rattrapage)';
      } else {
        notes.observation = 'Non validé (Rattrapage)';
      }
    }
  }

  validateNote(studentId: number, type: 'cc1' | 'cc2' | 'nr'): void {
    const note = this.notesMap[studentId][type];
    if (note !== null && (note < 0 || note > 20)) {
      Swal.fire('Erreur', 'La note doit être comprise entre 0 et 20', 'error');
      this.notesMap[studentId][type] = null;
    } else {
      this.calculateMoyenne(studentId);
    }
  }

  saveNotes(): void {
    if (!this.selectedModuleId || !this.currentProfId) {
      Swal.fire('Erreur', 'Veuillez sélectionner un module', 'error');
      return;
    }

    // Calculer les moyennes pour tous avant enregistrement
    this.etudiants.forEach(e => this.calculateMoyenne(e.id));

    const notesToSave = this.prepareNotesToSave();

    if (notesToSave.length === 0) {
      this.showNoNotesWarning();
      return;
    }

    this.noteService.saveMultipleNotes(notesToSave, this.currentProfId).subscribe({
      next: () => {
        this.showSuccessMessage();
        // Recharger les données si nécessaire
      },
      error: (err) => {
        console.error('Error saving notes:', err);
        Swal.fire('Erreur', err.error.message || 'Échec lors de l\'enregistrement', 'error');
      }
    });
  }

  private prepareNotesToSave(): any[] {
    return this.etudiants
      .filter(e => {
        if (this.selectedSessionType === 'NORMAL') {
          return this.notesMap[e.id].cc1 !== null || this.notesMap[e.id].cc2 !== null;
        } else {
          return this.notesMap[e.id].nr !== null;
        }
      })
      .map(e => {
        const notes = this.notesMap[e.id];
        return {
          etudiantId: e.id,
          moduleId: this.selectedModuleId,
          professeurId: this.currentProfId,
          cc1: this.selectedSessionType === 'NORMAL' ? notes.cc1 : null,
          cc2: this.selectedSessionType === 'NORMAL' ? notes.cc2 : null,
          nr: this.selectedSessionType === 'RATTRAPAGE' ? notes.nr : null,
          moyenne: notes.moyenne, // Doit être calculée avant
          observation: notes.observation, // Doit être calculée avant
          examtype: 'CC',
          sessionType: this.selectedSessionType
        };
      });
  }
  private showNoNotesWarning(): void {
    Swal.fire({
      title: 'Aucune note à enregistrer',
      text: 'Veuillez saisir des notes avant de les enregistrer.',
      icon: 'info',
      confirmButtonText: 'OK',
      confirmButtonColor: '#4f46e5'
    });
  }

  private showSuccessMessage(): void {
    Swal.fire('Succès', 'Les notes ont été enregistrées.', 'success');
  }

  private showErrorMessage(): void {
    Swal.fire('Erreur', 'Échec lors de l\'enregistrement.', 'error');
  }

  generateAcademicYears(): void {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i <= 4; i++) {
      const start = currentYear - i;
      const end = start + 1;
      this.years.push(`${start}-${end}`);
    }
  }
  getSelectedModuleName(): string {
    if (!this.selectedModuleId) return '';
    const module = this.modules.find(m => m.id === this.selectedModuleId);
    return module ? module.nom : '';
  }
  onMajorChange(): void {
    this.selectedModuleId = null;
    this.modules = [];
    if (this.selectedMajorId && this.selectedSemester && this.selectedYear) {
      this.loadModulesForProfessor();
    }
  }
  getObservationClass(observation: string | null): string {
    if (!observation) return '';

    if (observation.includes('Validé')) {
      return 'text-green-600';
    } else if (observation.includes('Non validé')) {
      return 'text-red-600';
    } else if (observation.includes('Rattrapage')) {
      return 'text-yellow-600';
    }
    return '';
  }
  onSemesterOrYearChange(): void {
    if (this.selectedMajorId && this.selectedSemester && this.selectedYear) {
      this.loadModulesForProfessor();
    }
  }
}
