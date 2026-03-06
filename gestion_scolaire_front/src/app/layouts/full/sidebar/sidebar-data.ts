import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Accueil',
  },
  {
    displayName: 'Accueil',
    iconName: 'home',
    route: '/ui-components/anounces',
  },
  {
    displayName: 'Tableau de Bord',
    iconName: 'layout-dashboard',
    route: '/dashboard',
  },


  {
    displayName: 'Départements',
    iconName: 'building',
    route: '/ui-components/departments',
  },

  {
    displayName: 'Saisie des notes',
    iconName: 'edit',
    route: '/ui-components/manage-notes',
    roles: ['PROFESSOR']
  },
  {
    displayName: 'Mes notes',
    iconName: 'file-text',
    route: '/ui-components/mes-notes',
    roles: ['STUDENT']
  }, {
    displayName: 'gestion notes',
    iconName: 'table',
    route: '/ui-components/notes-prof',
    roles: ['PROFESSOR']
  },
  {
    displayName: 'Notes des étudiants',
    iconName: 'list-details',
    route: '/ui-components/notes-adminstration',
    roles: ['ADMINISTRATOR']
  },
  {
    displayName: 'Filières',
    iconName: 'school',
    route: '/ui-components/majors'

  },
  {
    displayName: 'Modules',
    iconName: 'book',
    route: '/ui-components/modules',
  },

  {
    displayName: 'Marquer Absences',
    iconName: 'user-off',
    route: '/ui-components/absences',
    roles: ['PROFESSOR']
  },
  {
    displayName: 'Gestion des Absences',
    iconName: 'user-off',
    route: 'ui-components/absenceForProf',
    roles: ['PROFESSOR']

  },
  {
    displayName: 'Mes Absences',
    iconName: 'user-off',
    route: '/ui-components/my-absences',
    roles: ['STUDENT']
  },



  {
    displayName: 'Ajouter Étudiant',
    iconName: 'users-plus', // Icône pour un étudiant
    route: '/ui-components/add-student',
    roles: ['ADMINISTRATOR']
  },
  {
    displayName: 'Ajouter Professeur',
    iconName: 'users-plus', // Icône pour un professeur
    route: '/ui-components/add-prof',
    roles: ['ADMINISTRATOR']
  },
  {
    displayName: 'Ajouter Administrateur',
    iconName: 'users-plus', // Icône pour un admin
    route: '/ui-components/add-admin',
    roles: ['ADMINISTRATOR']
  },



  {
    displayName: 'Ajouter un Département',
    iconName: 'building-community',
    route: '/ui-components/add-departement',
    roles: ['ADMINISTRATOR']
  },
  {
    displayName: 'Ajouter une Filière',
    iconName: 'folder-plus',
    route: '/ui-components/managment-majors',
    roles: ['ADMINISTRATOR']
  },
  {
    displayName: 'Ajouter un Module',
    iconName: 'library',
    route: '/ui-components/add-module',
    roles: ['ADMINISTRATOR']
  },
  {
    displayName: 'Ajouter une publication',
    iconName: 'message-circle-plus',
    route: '/ui-components/add-post',
    roles: ['ADMINISTRATOR']
  },



];
