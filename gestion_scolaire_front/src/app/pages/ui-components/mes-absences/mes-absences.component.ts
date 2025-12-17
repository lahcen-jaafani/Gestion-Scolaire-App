import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbsenceService } from "../../../components/services/absence.service";
import { ModuleService } from "../../../components/services/module.service";

import { AuthService } from "../../../components/services/auth.service";
import { Subscription, forkJoin } from "rxjs";
import { CommonModule, DatePipe } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatToolbarModule } from "@angular/material/toolbar";
import {ProfService} from "../../../components/services/Prof.service";

@Component({
  selector: 'app-mes-absences',
  standalone: true,
  templateUrl: './mes-absences.component.html',
  styleUrls: ['./mes-absences.component.scss'],
  imports: [
    CommonModule,
    DatePipe,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatDividerModule,
    MatToolbarModule
  ]
})
export class MesAbsencesComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['date', 'module', 'semester','timeSlot', 'annee', 'justification'];
  absences: any[] = [];
  userFullName: string = '';
  isAuthenticated: boolean = false;
  private userSubscription!: Subscription;

  moduleCache: Map<number, any> = new Map(); // moduleId -> module
  profCache: Map<number, any> = new Map();   // profId -> prof

  constructor(
    private absenceService: AbsenceService,
    private moduleService: ModuleService,
    private profService: ProfService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.getCurrentUser$().subscribe(user => {
      if (user && user.id) {
        this.userFullName = `${user.firstName} ${user.lastName}`;
        this.isAuthenticated = true;
        this.loadAbsences(user.id);
      } else {
        this.userFullName = '';
        this.isAuthenticated = false;
        this.absences = [];
      }
    });
  }

  loadAbsences(userId: number) {
    this.absenceService.getAbsencesByEtudiantId(userId).subscribe(absences => {
      this.absences = absences;
      this.loadModuleAndProfData();
    });
  }

  loadModuleAndProfData() {
    const moduleIds = [...new Set(this.absences.map(a => a.moduleId))];
    const moduleRequests = moduleIds.map(id => this.moduleService.getModuleById(id));

    forkJoin(moduleRequests).subscribe(modules => {
      modules.forEach(module => this.moduleCache.set(module.id, module));

      // Get unique prof ids
      const profIds = [...new Set(modules.map(m => m.professeurId))];
      const profRequests = profIds.map(id => this.profService.getById(id));

      forkJoin(profRequests).subscribe(profs => {
        // @ts-ignore
        profs.forEach(prof => this.profCache.set(prof.id, prof));
      });
    });
  }

  getModuleName(moduleId: number): string {
    return this.moduleCache.get(moduleId)?.nom || '—';
  }
  getJustificationClass(justification: string): string {
    if (!justification) return 'text-gray-400 italic';
    const lower = justification.toLowerCase();
    if (lower.includes('médical')) return 'text-green-600';
    if (lower.includes('familial')) return 'text-blue-600';
    return 'text-amber-600';
  }

  getJustificationIcon(justification: string): string {
    if (!justification) return 'help_outline';
    const lower = justification.toLowerCase();
    if (lower.includes('médical')) return 'medical_services';
    if (lower.includes('familial')) return 'family_restroom';
    return 'info';
  }

  getSemester(moduleId: number): string {
    return this.moduleCache.get(moduleId)?.semester || '—';
  }
  gettime(moduleId: number): string {
    return this.moduleCache.get(moduleId)?.timeSlot;
  }

  getYear(moduleId: number): string {
    return this.moduleCache.get(moduleId)?.anneeUniversitaire || '—';
  }


  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }
}
