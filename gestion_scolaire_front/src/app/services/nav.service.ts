import { Injectable, signal } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import {NavItem} from "../layouts/full/sidebar/nav-item/nav-item";
import {navItems} from "../layouts/full/sidebar/sidebar-data";
import {AuthService} from "../components/services/auth.service";

@Injectable({ providedIn: 'root' })
export class NavService {
  showClass: any = false;

  public currentUrl = signal<string | undefined>(undefined);

  constructor(private router: Router,private authService: AuthService) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.set(event.urlAfterRedirects);
      }
    });
  }

  getFilteredNavItems(): NavItem[] {
    const userRole = this.authService.getUserRole();
    return this.filterItemsByRole(navItems, userRole);
  }

  private filterItemsByRole(items: NavItem[], role: string): NavItem[] {
    return items.filter(item => {
      // Si pas de restriction de rôle ou si le rôle est inclus
      const hasAccess = !item.roles || item.roles.includes(role);

      // Filtre les enfants si nécessaire
      if (hasAccess && item.children) {
        item.children = this.filterItemsByRole(item.children, role);
      }

      return hasAccess;
    });
  }
}
