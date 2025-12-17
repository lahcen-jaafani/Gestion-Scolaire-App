import {Component, OnInit} from '@angular/core';
import {StudentWithNotes} from "../../../models/StudentWithNotes.model";
import {StudentService} from "../../../components/services/Student.service";
import {MajorService} from "../../../components/services/major.service";
import {ModuleService} from "../../../components/services/module.service";
import {MatDialog} from "@angular/material/dialog";
import Swal from "sweetalert2";
import {Note} from "../../../models/Note.model";
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {MatTable, MatTableModule} from "@angular/material/table";
import {CommonModule, NgClass, NgForOf, NgIf} from "@angular/common";
import {MatFormField, MatLabel} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {FormsModule} from "@angular/forms";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-note-for-admin',
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
  templateUrl: './note-for-admin.component.html',
  styleUrl: './note-for-admin.component.scss'
})
export class NoteForAdminComponent implements OnInit{
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

  displayedColumns: string[] = [
    'lastName', 'firstName', 'cne',
    'cc1', 'cc2', 'nr', 'moyenne',
    'observation'
  ];

  constructor(
    private studentService: StudentService,
    private majorService: MajorService,
    private moduleService: ModuleService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.generateAcademicYears();
    this.loadMajors();
  }


  generateAcademicYears(): void {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 5 }, (_, i) => {
      const start = currentYear - i;
      return `${start}-${start + 1}`;
    });
    this.selectedYear = this.years[0];
  }
  getObservationClass(observation: string | undefined): string {
    if (!observation) return '';

    if (observation.includes('Validé')) {
      return 'bg-green-100 text-green-800';
    } else if (observation.includes('Rattrapage')) {
      return 'bg-yellow-100 text-yellow-800';
    } else if (observation.includes('Non validé')) {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-gray-100 text-gray-800';
  }
  loadMajors(): void {
    this.majorService.getAll().subscribe({
      next: (data) => this.majors = data,
      error: (err) => console.error('Error loading majors', err)
    });
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
    if (!this.selectedMajorId || !this.selectedSemester || !this.selectedYear) {
      Swal.fire('Info', 'Please select major, semester and year', 'info');
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
        Swal.fire('Error', 'Failed to load students', 'error');
        this.isLoading = false;
      }
    });
  }

  getNoteForStudent(student: StudentWithNotes): Note | null {
    return student.notes.length > 0 ? student.notes[0] : null;
  }

  onMajorChange(): void {
    this.selectedModuleId = null;
    this.modules = [];
    this.loadModules();
  }

  onSemesterOrYearChange(): void {
    this.loadModules();
  }
}
