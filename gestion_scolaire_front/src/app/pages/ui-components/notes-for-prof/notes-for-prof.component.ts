import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from "@angular/material/card";
import { MatIcon } from '@angular/material/icon';
import { StudentWithNotes } from "../../../models/StudentWithNotes.model";
import { StudentService } from "../../../components/services/Student.service";
import { MajorService } from "../../../components/services/major.service";
import { ModuleService } from "../../../components/services/module.service";
import { Note } from "../../../models/Note.model";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatOption, MatSelect } from "@angular/material/select";
import { FormsModule } from "@angular/forms";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatTable } from "@angular/material/table";
import { CommonModule } from "@angular/common";
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Subscription } from "rxjs";
import { AuthService } from "../../../components/services/auth.service";
import { User } from "../../../models/User.model";
import { EditNoteDialogComponent } from "./edit-note-dialog";
import { NotesService } from "../../../components/services/note.service";

@Component({
  selector: 'app-notes-for-prof',
  templateUrl: './notes-for-prof.component.html',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatIcon,
    MatCardHeader,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    FormsModule,
    MatProgressSpinner,
    MatTable,
    MatCardSubtitle,
    MatCardTitle,
    CommonModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule
  ],
  styleUrls: ['./notes-for-prof.component.scss']
})
export class NotesForProfComponent implements OnInit {
  students: StudentWithNotes[] = [];
  modules: any[] = [];
  majors: any[] = [];
  sessionTypes: string[] = ['NORMAL', 'RATTRAPAGE'];
  selectedSessionType: string = 'NORMAL';
  years: string[] = [];
  semesters: string[] = ['Semestre 1', 'Semestre 2', 'Semestre 3', 'Semestre 4', 'Semestre 5', 'Semestre 6'];
  selectedYear: string = '';
  selectedSemester: string = '';
  selectedMajorId: number | null = null;
  selectedModuleId: number | null = null;
  isLoading: boolean = false;
  userFullName: string = '';
  currentProfId: number | null = null;
  isAuthenticated: boolean = false;
  private userSubscription!: Subscription;
  displayedColumns: string[] = [
    'lastName', 'firstName', 'cne',
    'cc1', 'cc2', 'nr', 'moyenne',
    'observation', 'actions'
  ];
  selectedNiveau: string = '';

  constructor(
    private studentService: StudentService,
    private majorService: MajorService,
    private moduleService: ModuleService,
    private dialog: MatDialog,
    private authService: AuthService,
    private noteService: NotesService,
  ) {}

  ngOnInit(): void {
    this.generateAcademicYears();
    this.userSubscription = this.authService.getCurrentUser$().subscribe({
      next: (user: User | null) => {
        if (user?.id) {
          this.userFullName = `${user.firstName} ${user.lastName}`;
          this.isAuthenticated = true;
          this.currentProfId = user.id;
          this.loadMajorsForProfessor();
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

  onSemesterOrYearChange(): void {
    if (this.selectedMajorId && this.selectedSemester && this.selectedYear) {
      this.loadModulesForProfessor();
    }
  }

  generateAcademicYears(): void {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 5 }, (_, i) => {
      const start = currentYear - i;
      return `${start}-${start + 1}`;
    });
    this.selectedYear = this.years[0];
  }

  onMajorChange(): void {
    this.selectedModuleId = null;
    this.modules = [];
    this.students = [];
    if (this.selectedMajorId && this.selectedSemester && this.selectedYear) {
      this.loadModulesForProfessor();
    }
  }

  fetchStudentsWithNotes(): void {
    if (!this.selectedMajorId || !this.selectedSemester || !this.selectedYear) {
      Swal.fire('Info', 'Veuillez sélectionner une filière, un semestre et une année', 'info');
      return;
    }

    this.isLoading = true;
    this.students = [];

    this.studentService.getStudentsWithNotesByCriteria(
      this.selectedMajorId,
      this.selectedSemester,
      this.selectedYear,
      this.selectedModuleId || undefined,
      this.selectedSessionType
    ).subscribe({
      next: (students) => {
        this.students = students;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching students', err);
        Swal.fire('Error', 'Échec du chargement des étudiants', 'error');
        this.isLoading = false;
      }
    });
  }

  getNoteForStudent(student: StudentWithNotes): Note | null {
    return student.notes.length > 0 ? student.notes[0] : null;
  }

  openEditDialog(student: StudentWithNotes): void {
    const note = this.getNoteForStudent(student);
    if (!note) {
      Swal.fire('Erreur', 'Aucune note trouvée pour cet étudiant', 'error');
      return;
    }

    const dialogRef = this.dialog.open(EditNoteDialogComponent, {
      width: '500px',
      data: {
        note: { ...note },
        isRetake: this.selectedSessionType === 'RATTRAPAGE',
        studentName: `${student.firstName} ${student.lastName}`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updatedNote = {
          ...result,
          studentId: student.id,
          moduleId: this.selectedModuleId,
          sessionType: this.selectedSessionType
        };
        this.updateNote(updatedNote);
      }
    });
  }

  updateNote(updatedNote: Note): void {
    this.noteService.updateNote(updatedNote.id, updatedNote).subscribe({
      next: () => {
        Swal.fire('Succès', 'Note mise à jour avec succès', 'success');
        this.fetchStudentsWithNotes();
      },
      error: (err) => {
        console.error('Error updating note:', err);
        Swal.fire(
          'Erreur',
          `Échec de la mise à jour: ${err.error?.message || err.message}`,
          'error'
        );
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
