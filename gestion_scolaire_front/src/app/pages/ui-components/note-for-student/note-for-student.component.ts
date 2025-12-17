import { Component } from '@angular/core';
import {StudentWithNotes} from "../../../models/StudentWithNotes.model";
import {Subscription} from "rxjs";
import {StudentService} from "../../../components/services/Student.service";
import {MajorService} from "../../../components/services/major.service";
import {ModuleService} from "../../../components/services/module.service";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../../../components/services/auth.service";
import {NotesService} from "../../../components/services/note.service";
import {User} from "../../../models/User.model";
import Swal from "sweetalert2";
import {Note} from "../../../models/Note.model";
import {EditNoteDialogComponent} from "../notes-for-prof/edit-note-dialog";
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatFormField, MatLabel} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatTable, MatTableModule} from "@angular/material/table";
import {CommonModule} from "@angular/common";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatButton} from "@angular/material/button";


@Component({
  selector: 'app-note-for-student',
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
    MatTableModule,
    MatButton
  ],
  templateUrl: './note-for-student.component.html',
  styleUrl: './note-for-student.component.scss'
})
export class NoteForStudentComponent {
  students: StudentWithNotes[] = [];
  modules: any[] = [];
  majors: any[] = [];
  selectedNiveau: string = '';
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
  currentetdId:number| null= null;
  isAuthenticated: boolean = false;
  private userSubscription!: Subscription;
  private notes: any[];

  niveaux: string[] = ['1ère année', '2ème année', '3ème année'];
  displayedColumns: string[] = [
    'lastName', 'firstName', 'cne',
    'cc1', 'cc2', 'nr', 'moyenne',
    'observation',
  ];

  constructor(
    private studentService: StudentService,
    private majorService: MajorService,
    private moduleService: ModuleService,
    private dialog: MatDialog,
    private authService:AuthService,
    private noteService:NotesService,
  ) {}

  ngOnInit(): void {
    this.generateAcademicYears();
    this.loadMajors();
    this.userSubscription = this.authService.getCurrentUser$().subscribe({
      next: (user: User | null) => {
        if (user?.id) {
          this.userFullName = `${user.firstName} ${user.lastName}`;
          this.isAuthenticated = true;
          this.currentetdId = user.id;
          this.selectedMajorId=user.majorId;
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



  onSemesterOrYearChange(): void {
    if (this.selectedMajorId && this.selectedSemester && this.selectedYear) {
      this.loadModules();
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

  loadMajors(): void {
    this.majorService.getAll().subscribe({
      next: (data) => this.majors = data,
      error: (err) => console.error('Error loading majors', err)
    });
  }

  onMajorChange(): void {
    this.selectedModuleId = null;
    this.modules = [];
    this.students = [];
    this.notes = [];
    if (this.selectedMajorId && this.selectedSemester && this.selectedYear) {
      this.loadModules();
    }
  }
  loadModules(): void {
    if (!this.selectedMajorId || !this.selectedSemester || !this.selectedYear) return;

    this.moduleService.getModulesByMajorAndSemester(
      this.selectedMajorId,
      this.selectedSemester,
      this.selectedYear
    ).subscribe({
      next: (data) => this.modules = data,
      error: (err) => console.error('Error loading modules', err)
    });
  }

  fetchStudentsWithNotes(): void {
    if (!this.selectedModuleId || !this.selectedSemester || !this.selectedYear) {
      Swal.fire('Info', 'Please select major, semester and year', 'info');
      return;
    }

    this.isLoading = true;
    this.students = [];

    this.studentService.getStudentsWithNotesByCriteria2(
      this.selectedMajorId!,
      this.selectedSemester,
      this.selectedYear,
      this.selectedModuleId || undefined,
      this.selectedSessionType,
      this.currentetdId!,
    ).subscribe({
      next: (students) => {
        this.students = students;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching students', err);
        Swal.fire('Error', 'Failed to load students', 'error');
        this.isLoading = false;
      }
    });
  }

  getNoteForStudent(student: StudentWithNotes): Note | null {
    return student.notes.length > 0 ? student.notes[0] : null;
  }

  openEditDialog(note: Note): void {
    const dialogRef = this.dialog.open(EditNoteDialogComponent, {
      width: '500px',
      data: {
        note: { ...note },
        isRetake: this.selectedSessionType === 'RATTRAPAGE'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateNote(result);
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
        console.error('Error updating note', err);
        Swal.fire('Erreur', 'Échec de la mise à jour de la note', 'error');
      }
    });
  }




  nom: string;
}
