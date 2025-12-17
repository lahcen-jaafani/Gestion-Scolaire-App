import {Component, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import { ModuleService } from "../../../components/services/module.service";
import { AbsenceService } from "../../../components/services/absence.service";
import { CommonModule, DatePipe, KeyValuePipe, registerLocaleData } from "@angular/common";
import localeFr from '@angular/common/locales/fr';
import { MatTableModule } from "@angular/material/table";
import { AuthService } from "../../../components/services/auth.service";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatToolbarModule } from "@angular/material/toolbar";
import { forkJoin, Subscription } from "rxjs";
import { MatIconModule } from "@angular/material/icon";
import { StudentService } from "../../../components/services/Student.service";
import { Student } from "../../../models/Student.model";
import {MajorService} from "../../../components/services/major.service";
import {MatFormField, MatLabel} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {EditAbsenceDialogComponent} from "../edit_abs/EditAbsenceDialogComponent";
// Enregistrer la locale française
registerLocaleData(localeFr, 'fr');

@Component({
  selector: 'app-absences-for-prof',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatDividerModule,
    MatToolbarModule,
    MatFormField,
    MatSelect,
    MatOption,
    MatLabel,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './absences-for-prof.component.html',
  styleUrls: ['./absences-for-prof.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr' } // Définir la locale par défaut
  ]
})
export class AbsencesForProfComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = [
    'date', 'timeSlot', 'justification', 'module', 'student', 'actions'
  ];
  absences: any[] = [];
  userFullName: string = '';
  isAuthenticated: boolean = false;
  absencesGroupedByDate: any[] = [];
  private userSubscription!: Subscription;
  private dataSubscriptions: Subscription[] = [];
  private moduleCache: Map<number, any> = new Map();
  private studentCache: Map<number, Student> = new Map();
  private majorCache: Map<number, any> = new Map();
  selectedMajor: number | null = null;
  selectedSemester: string | null = null;
  filteredAbsences: any[] = [];
  allMajors: any[] = [];
  constructor(
    private absenceService: AbsenceService,
    private moduleService: ModuleService,
    private studentService: StudentService,
    private authService: AuthService,
    private majorService: MajorService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}
  // Groupement des absences par date



// Groupement par module
  editAbsence(absence: any) {
    const dialogRef = this.dialog.open(EditAbsenceDialogComponent, {
      width: '400px',
      data: { ...absence } // on clone l'objet
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Enregistrer la modification via le service
        this.absenceService.updateAbsence(result).subscribe({
          next: () => {
            Object.assign(absence, result); // mettre à jour localement
            this.snackBar.open('Absence modifiée avec succès.', 'Fermer', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open('Erreur lors de la modification.', 'Fermer', { duration: 3000 });
          }
        });
      }
    });
  }
  getColumnHeader(column: string): string {
    const headers: {[key: string]: string} = {
      'date': 'Date',
      'timeSlot': 'Heure',
      'justification': 'Statut',
      'module': 'Module',
      'student': 'Étudiant',
      'actions': 'Actions'
    };
    return headers[column] || column;
  }
  deleteAbsence(absence: any) {
    const confirmDelete = confirm('Voulez-vous vraiment supprimer cette absence ?');
    if (confirmDelete) {
      this.absenceService.deleteAbsence(absence.id).subscribe({
        next: () => {
          this.absences = this.absences.filter(a => a.id !== absence.id);
          this.filteredAbsences = [...this.absences];
          this.groupAbsences();
          this.snackBar.open('Absence supprimée avec succès.', 'Fermer', { duration: 3000 });
        },
        error: () => {
          this.snackBar.open('Erreur lors de la suppression.', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.getCurrentUser$().subscribe({
      next: (user) => {
        if (user && user.id) {
          this.userFullName = `${user.firstName} ${user.lastName}`;
          this.isAuthenticated = true;
          this.loadAbsences(user.id);
        } else {
          this.resetState();
        }

      },
      error: (err) => {
        console.error('Error fetching user:', err);
        this.resetState();
      }
    });
    this.groupAbsences();
    this.loadAllMajors();
  }
  loadAllMajors() {
    this.majorService.getAll().subscribe({
      next: (majors) => {
        this.allMajors = majors;
      },
      error: (err) => console.error('Error loading majors:', err)
    });
  }

  // Obtient les filières uniques parmi les modules chargés
  getUniqueMajors() {
    const majors = new Map<number, any>();
    this.moduleCache.forEach(module => {
      if (module.majorId && !majors.has(module.majorId)) {
        const major = this.majorCache.get(module.majorId);
        if (major) {
          majors.set(major.id, major);
        }
      }
    });
    return Array.from(majors.values());
  }

  // Obtient les semestres uniques
  getUniqueSemesters() {
    const semesters = new Set<string>();
    this.moduleCache.forEach(module => {
      if (module.semester) {
        semesters.add(module.semester);
      }
    });
    return Array.from(semesters);
  }

  // Applique les filtres
  applyFilters() {
    this.filteredAbsences = this.absences.filter(absence => {
      const module = this.moduleCache.get(absence.moduleId);
      if (!module) return false;

      // Filtre par filière
      if (this.selectedMajor && module.majorId !== this.selectedMajor) {
        return false;
      }

      // Filtre par semestre
      if (this.selectedSemester && module.semester !== this.selectedSemester) {
        return false;
      }

      return true;
    });
  }

  // Réinitialise les filtres
  resetFilters() {
    this.selectedMajor = null;
    this.selectedSemester = null;
    this.filteredAbsences = [...this.absences];
  }

  // Mettez à jour loadAbsences pour initialiser filteredAbsences
  loadAbsences(userId: number) {
    const absenceSub = this.absenceService.getAbsencesByProfessor(userId).subscribe({
      next: (absences) => {
        this.absences = absences;
        this.filteredAbsences = [...absences]; // Initialisez filteredAbsences
        this.loadAdditionalData();
      },
      error: (err) => console.error('Error loading absences:', err)
    });
    this.dataSubscriptions.push(absenceSub);
  }

  // Méthodes pour les actions
  openAddAbsenceDialog() {
    // Implémentez l'ouverture du dialogue d'ajout
  }





  loadAdditionalData() {
    const moduleIds = [...new Set(this.absences.map(a => a.moduleId))];
    const moduleRequests = moduleIds.map(id => this.moduleService.getModuleById(id));

    const studentIds = [...new Set(this.absences.map(a => a.etudiantId))];
    const studentRequests = studentIds.map(id => this.studentService.getById(id));

    const dataSub = forkJoin([
      forkJoin(moduleRequests),
      forkJoin(studentRequests)
    ]).subscribe({
      next: ([modules, students]) => {
        // Cache modules
        modules.forEach(module => {
          if (module) {
            this.moduleCache.set(module.id, module);
            // Chargez les données de la filière pour chaque module
            this.loadMajorForModule(module.majorId, module.id);
          }
        });

        // Cache students
        students.forEach(student => {
          if (student) this.studentCache.set(student.id, student);
        });
      },
      error: (err) => console.error('Error loading additional data:', err)
    });

    this.dataSubscriptions.push(dataSub);
  }

// Nouvelle méthode pour charger les filières

// Nouvelle méthode pour charger les filières
  loadMajorForModule(majorId: number, moduleId: number) {
    if (!majorId || this.majorCache.has(majorId)) return;

    this.majorService.getById(majorId).subscribe({
      next: (major) => {
        this.majorCache.set(majorId, major);
        // Mettez à jour le cache du module avec le nom de la filière
        const module = this.moduleCache.get(moduleId);
        if (module) {
          module.majorName = major.name;
          this.moduleCache.set(moduleId, module);
        }
      },
      error: (err) => console.error('Error loading major:', err)
    });
  }

  getMajorName(moduleId: number): string {
    const module = this.moduleCache.get(moduleId);
    if (!module) return '—';

    // Si le nom de la filière est déjà dans le module
    if (module.majorName) return module.majorName;

    // Sinon, essayez de le récupérer du cache
    const major = this.majorCache.get(module.majorId);
    return major?.nom || '—';
  }
  getModuleName(moduleId: number): string {
    return this.moduleCache.get(moduleId)?.nom || '—';
  }

  getStudentName(studentId: number): string {
    const student = this.studentCache.get(studentId);
    return student ? `${student.firstName} ${student.lastName}` : '—';
  }

  getStudentCNE(studentId: number): string {
    return this.studentCache.get(studentId)?.cne || '—';
  }

  getSemester(moduleId: number): string {
    return this.moduleCache.get(moduleId)?.semester || '—';
  }
  private resetState(): void {
    this.userFullName = '';
    this.isAuthenticated = false;
    this.absences = [];
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
    this.dataSubscriptions.forEach(sub => sub.unsubscribe());
  }
  groupedAbsences: any = {};


  groupAbsences() {
    this.groupedAbsences = {};

    for (const absence of this.absences) {
      const dateKey = new Date(absence.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

      if (!this.groupedAbsences[dateKey]) {
        this.groupedAbsences[dateKey] = {};
      }
      const moduleName = this.getModuleName(absence.moduleId);
      if (!this.groupedAbsences[dateKey][moduleName]) {
        this.groupedAbsences[dateKey][moduleName] = [];
      }
      this.groupedAbsences[dateKey][moduleName].push(absence);
    }
  }
}
