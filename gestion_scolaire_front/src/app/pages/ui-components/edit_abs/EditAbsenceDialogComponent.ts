import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-edit-absence-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatSelectModule
  ],
  template: `
    <div class="p-4 min-w-[320px] max-w-[500px]">
      <h2 class="text-xl font-semibold text-indigo-700 flex items-center gap-2 mb-4">
        <mat-icon>edit_calendar</mat-icon>
        Modifier une absence
      </h2>

      <div class="space-y-4">
        <!-- Heure -->
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Heure</mat-label>
          <input matInput [(ngModel)]="data.timeSlot" placeholder="Ex: De 08h à 10h" />
        </mat-form-field>

        <!-- Justification -->
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Justification</mat-label>
          <mat-select [(ngModel)]="data.justification">
            <mat-option value="">Non justifiée</mat-option>
            <mat-option value="justifié">Justifiée</mat-option>
            <mat-option value="non justifié">Non justifiée</mat-option>
            <mat-option value="certificat médical">Certificat médical</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="flex justify-end gap-3 mt-6">
        <button mat-stroked-button (click)="dialogRef.close()">
          Annuler
        </button>
        <button mat-flat-button color="primary" (click)="save()">
          <mat-icon class="mr-1">save</mat-icon>
          Enregistrer
        </button>
      </div>
    </div>
  `
})
export class EditAbsenceDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditAbsenceDialogComponent>
  ) {}

  save() {
    this.dialogRef.close(this.data);
  }
}
