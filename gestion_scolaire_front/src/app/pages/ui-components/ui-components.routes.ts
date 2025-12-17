import { Routes } from '@angular/router';
import { AuthGuard} from "../../guards/auth.guard";
import { RoleGuard } from '../../guards/role.guard';
import { LoginComponent } from '../authentication/login/login.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AddStudentComponent } from './add-student/add-student.component';
import { AddProfComponent } from './add-prof/add-prof.component';
import { AddAdminComponent } from './add-admin/add-admin.component';
import { AbsencesComponent } from './absences/absences.component';
import { DepartementDetailsComponent } from './departement-details/departement-details.component';
import { AddPostComponent } from './add-post/add-post.component';
import { DepartmentsManagmentComponent } from './departments-managment/departments-managment.component';
import { DepartmentsComponent } from './departments/departments.component';
import { AddModuleComponent } from './add-module/add-module.component';
import { ModulesComponent } from './modules/modules.component';
import { MajorManagmaentComponent } from './major-managmaent/major-managmaent.component';
import { AddMajorComponent } from './add-major/add-major.component';
import { MajorsComponent } from './majors/majors.component';
import { AnouncesComponent } from './anounces/anounces.component';
import {AppTablesComponent} from "./tables/tables.component";
import {AppFormsComponent} from "./forms/forms.component";
import {AppTooltipsComponent} from "./tooltips/tooltips.component";
import {AppBadgeComponent} from "./badge/badge.component";
import {AnonceCrudComponent} from "./announces-detaille/announces-detaille.component";
import {AppChipsComponent} from "./chips/chips.component";
import {AppListsComponent} from "./lists/lists.component";
import {AppMenuComponent} from "./menu/menu.component";
import {MesAbsencesComponent} from "./mes-absences/mes-absences.component";
import {AbsencesForProfComponent} from "./absences-for-prof/absences-for-prof.component";
import {NotesComponent} from "./notes/notes.component";
import {NotesForProfComponent} from "./notes-for-prof/notes-for-prof.component";
import {NoteForAdminComponent} from "./note-for-admin/note-for-admin.component";
import {NoteForStudentComponent} from "./note-for-student/note-for-student.component";



export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'forget-password', component: ForgetPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent },

      { path: 'badge', component: AppBadgeComponent },

      {
        path: 'add-student',
        component: AddStudentComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: { roles: ['ADMINISTRATOR'] },
      },
      {
        path: 'add-prof',
        component: AddProfComponent,
        canActivate: [AuthGuard,RoleGuard],
         data: { roles: ['ADMINISTRATOR'] },
      },
      {
        path: 'add-admin',
        component: AddAdminComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: { roles: ['ADMINISTRATOR'] },
      },
      {
        path: 'manage-notes',
        component: NotesComponent,
        canActivate: [AuthGuard,RoleGuard],
      data: { roles: ['PROFESSOR'] },
      },
      {
        path: 'notes-prof',
        component: NotesForProfComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: { roles: ['PROFESSOR'] },
      },
      {
        path: 'notes-adminstration',
        component: NoteForAdminComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: { roles: ['ADMINISTRATOR'] },
      },
      {
        path: 'mes-notes',
        component: NoteForStudentComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: { roles: ['STUDENT'] },
      },
      {
        path: 'absences',
        component: AbsencesComponent,
        canActivate: [AuthGuard,RoleGuard],
       data: { roles: ['PROFESSOR'] },
      },
      {
        path: 'departements/:id',
        component: DepartementDetailsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'add-post',
        component: AddPostComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMINISTRATOR'] },
      },
      {
        path: 'add-departement',
        component: DepartmentsManagmentComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: { roles: ['ADMINISTRATOR'] },
      },
      {
        path: 'departments',
        component: DepartmentsComponent,

      },
      {
        path: 'add-module',
        component: AddModuleComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: { roles: ['ADMINISTRATOR'] },
      },
      {
        path: 'absenceForProf',
        component: AbsencesForProfComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: { roles: ['PROFESSOR'] },
      },
      {
        path: 'modules',
        component: ModulesComponent,

      },
      {
        path: 'managment-majors',
        component: MajorManagmaentComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: { roles: ['ADMINISTRATOR'] },
      },
      {
        path: 'add-major',
        component: AddMajorComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: { roles: ['ADMINISTRATOR'] },
      },
      {
        path: 'my-absences',
        component: MesAbsencesComponent,
        canActivate: [AuthGuard,RoleGuard],
         data: { roles: ['STUDENT'] },
      },

      {
        path: 'majors',
        component: MajorsComponent,

      },
      {
        path: 'anounces',
        component: AnouncesComponent,

      },
      {
        path: 'announces-detaille/:id',
        component: AnonceCrudComponent,


      },
      {
        path: 'chips',
        component: AppChipsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'lists',
        component: AppListsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'menu',
        component: AppMenuComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'tooltips',
        component: AppTooltipsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'forms',
        component: AppFormsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'etudiants',
        component: AppTablesComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];
