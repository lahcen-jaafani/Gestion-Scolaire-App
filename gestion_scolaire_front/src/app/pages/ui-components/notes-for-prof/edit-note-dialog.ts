import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-edit-note-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogContent,
    MatDialogActions,
    MatOptionModule,
    MatIconModule
  ],
  template: `
    <div class="p-6 bg-white rounded-lg shadow-xl">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
          <mat-icon class="text-indigo-600">edit</mat-icon>
          Modification de note - {{data.studentName}}
        </h2>
        <button mat-icon-button (click)="onCancel()" class="text-gray-500 hover:text-gray-700">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content class="!p-0">
        <form #noteForm="ngForm" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Note CC1</mat-label>
              <input matInput type="number" [(ngModel)]="data.note.cc1" name="cc1" required min="0" max="20" step="0.1">
              <mat-icon matSuffix class="text-gray-400">score</mat-icon>
              <mat-hint>Entre 0 et 20</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Note CC2</mat-label>
              <input matInput type="number" [(ngModel)]="data.note.cc2" name="cc2" required min="0" max="20" step="0.1">
              <mat-icon matSuffix class="text-gray-400">score</mat-icon>
              <mat-hint>Entre 0 et 20</mat-hint>
            </mat-form-field>
          </div>

          <div *ngIf="data.isRetake" class="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Note de rattrapage</mat-label>
              <input matInput type="number" [(ngModel)]="data.note.nr" name="nr" min="0" max="20" step="0.1">
              <mat-icon matSuffix class="text-yellow-500">warning</mat-icon>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Observation</mat-label>
            <mat-select [(ngModel)]="data.note.observation" name="observation">
              <mat-option value="Validé">
                <div class="flex items-center gap-2 text-green-600">
                  <mat-icon>check_circle</mat-icon>
                  <span>Validé</span>
                </div>
              </mat-option>
              <mat-option value="Non validé">
                <div class="flex items-center gap-2 text-red-600">
                  <mat-icon>cancel</mat-icon>
                  <span>Non validé</span>
                </div>
              </mat-option>
              <mat-option value="Rattrapage">
                <div class="flex items-center gap-2 text-yellow-600">
                  <mat-icon>autorenew</mat-icon>
                  <span>Rattrapage</span>
                </div>
              </mat-option>
              <mat-option value="Autre">
                <div class="flex items-center gap-2 text-gray-600">
                  <mat-icon>more_horiz</mat-icon>
                  <span>Autre</span>
                </div>
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field *ngIf="data.note.observation === 'Autre'" appearance="outline" class="w-full">
            <mat-label>Commentaire</mat-label>
            <textarea matInput [(ngModel)]="data.note.comment" name="comment" rows="2"></textarea>
          </mat-form-field>

          <div class="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <div class="flex items-center justify-between">
              <span class="font-medium text-blue-800">Moyenne calculée:</span>
              <span class="text-lg font-bold text-blue-600">{{ calculateAverage() | number:'1.1-2' }}</span>
            </div>
          </div>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end" class="!p-0 mt-6">
        <button mat-button (click)="onCancel()" class="mr-2">Annuler</button>
        <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!noteForm.valid" class="px-6">
          <mat-icon>save</mat-icon>
          Enregistrer
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .mat-mdc-form-field {
      width: 100%;
    }
    .mat-mdc-select-value {
      display: flex;
      align-items: center;
    }
  `]
})
export class EditNoteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditNoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      note: any,
      isRetake: boolean,
      studentName: string
    }
  ) {}

  calculateAverage(): number {
    const cc1 = parseFloat(this.data.note.cc1) || 0;
    const cc2 = parseFloat(this.data.note.cc2) || 0;
    return (cc1 + cc2) / 2;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const updatedNote = {
      ...this.data.note,
      moyenne: this.calculateAverage(),
      nr: this.data.isRetake ? (parseFloat(this.data.note.nr) || null) : null
    };
    this.dialogRef.close(updatedNote);
  }
}
