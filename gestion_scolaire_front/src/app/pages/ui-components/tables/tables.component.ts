import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { User } from 'src/app/models/User.model';
import { UserService } from 'src/app/components/services/user.service';
import Swal from 'sweetalert2';
import { MajorService } from 'src/app/components/services/major.service';
import { Major } from 'src/app/models/major.model';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatDividerModule} from "@angular/material/divider";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {StudentService} from "../../../components/services/Student.service";


@Component({
  selector: 'app-tables',
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

  ],
  templateUrl: './tables.component.html',
})
export class AppTablesComponent implements OnInit {
  displayedColumns: string[] = [
    'cne',
    'firstName',
    'lastName',
    'email',
    'annee_universitaire',
    'phoneNumber',
    'actions',
  ];
  showResults: boolean = false; // tableau caché au départ
  dataSource: any[] = [];
  niveaux: string[] = ['1ère année', '2ème année', '3ème année'];
  selectedNiveau: string = '';
  selectedMajorId: number | null = null;
  years: string[] = []
  majors: Major[] = [];
  filterBtnShadow = false;
  selectedYear: string = '';
  excelBtnShadow = false;



  constructor(private userService: UserService,private majorService:MajorService,private studentService:StudentService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadMajors();
    this.generateAnneesUniversitaires();

  }
  generateAnneesUniversitaires(): void {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i <= 4; i++) {
      const start = currentYear - i;
      const end = start + 1;
      this.years.push(`${start}-${end}`);
    }
  }

  loadUsers(): void {
    this.userService.getAllStudents().subscribe({
      next: (users) => (this.dataSource = users),
      error: (err) => console.error('Erreur lors du chargement des étudiants', err),
    });
  }


  exportExcel(): void {
    if (!this.dataSource || this.dataSource.length === 0) {
      alert('Aucune donnée à exporter');
      return;
    }

    // Préparer les données à exporter
    const worksheetData = this.dataSource.map(student => ({
      Nom: student.firstName,
      Prénom: student.lastName,
      Email: student.email,
      CNE: student.cne,
      Filière: student.major?.name || '',
      'Année Universitaire': student.anneeUniversitaire,
      Téléphone: student.phoneNumber
    }));

    // Créer une feuille Excel
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(worksheetData);

    // Créer un classeur
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Étudiants': worksheet },
      SheetNames: ['Étudiants']
    };

    // Générer le buffer Excel
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Sauvegarder le fichier Excel
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'liste_etudiants.xlsx');
  }


  loadMajors(): void {
    this.majorService.getAll().subscribe({
      next: (majors) => (this.majors = majors),
      error: (err) => console.error('Erreur lors du chargement des filières', err),
    });
  }

  filterStudents(): void {
    if (!this.selectedYear || !this.selectedMajorId || !this.selectedNiveau) return;

    this.studentService.getStudentsByYearAndMajor(this.selectedYear, this.selectedMajorId, this.selectedNiveau).subscribe({
      next: (data) => {
        this.dataSource = data;
        this.showResults = true; // afficher le tableau après filtrage
      },
      error: (err) => {
        console.error('Erreur lors du filtrage', err);
        this.dataSource = [];
        this.showResults = true; // même en erreur, montrer le bloc vide
      }
    });
  }
  onDelete(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.delete(id).subscribe({
          next: () => {
            this.loadUsers();
            Swal.fire('Supprimé !', 'Utilisateur supprimé avec succès.', 'success');
          },
          error: () => Swal.fire('Erreur !', 'La suppression a échoué.', 'error'),
        });
      }
    });
  }

  onEdit(user: User): void {
    Swal.fire({
      title: 'Modifier l’utilisateur',
      html: `
        <input id="swal-input1" class="swal2-input" value="${user.firstName}" placeholder="Prénom">
        <input id="swal-input2" class="swal2-input" value="${user.lastName}" placeholder="Nom">
        <input id="swal-input3" class="swal2-input" value="${user.email}" placeholder="Email">
        <input id="swal-input4" class="swal2-input" value="${user.phoneNumber}" placeholder="Téléphone">
        <input id="swal-input5" class="swal2-input" value="${user.cne}" placeholder="CNE">
        <input id="swal-input6" class="swal2-input" value="${user.annee_universitaire}" placeholder="Année Universitaire">
      `,
      showCancelButton: true,
      confirmButtonText: 'Enregistrer',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        const updatedUser: User = {
          ...user,
          firstName: (document.getElementById('swal-input1') as HTMLInputElement).value,
          lastName: (document.getElementById('swal-input2') as HTMLInputElement).value,
          email: (document.getElementById('swal-input3') as HTMLInputElement).value,
          phoneNumber: (document.getElementById('swal-input4') as HTMLInputElement).value,
          cne: (document.getElementById('swal-input5') as HTMLInputElement).value,
          annee_universitaire: (document.getElementById('swal-input6') as HTMLInputElement).value,
        };
        return updatedUser;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.userService.update(user.id, result.value).subscribe({
          next: () => {
            this.loadUsers();
            Swal.fire('Mis à jour !', 'Utilisateur modifié.', 'success');
          },
          error: () => Swal.fire('Erreur !', 'La mise à jour a échoué.', 'error'),
        });
      }
    });
  }
}
