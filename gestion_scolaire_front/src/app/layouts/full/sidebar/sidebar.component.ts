import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BrandingComponent } from './branding.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import {MatIconModule} from "@angular/material/icon";
import {NavItem} from "./nav-item/nav-item";
import {RouterLink} from "@angular/router";
import {NavService} from "../../../services/nav.service";
import {AuthService} from "../../../components/services/auth.service";

@Component({
  selector: 'app-sidebar',
  imports: [TablerIconsModule, MaterialModule, MatIconModule, BrandingComponent],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {


  navItems: NavItem[] = [];
  isLoggedIn = false;
  constructor(private navService: NavService,private authService:AuthService) {}
  @Input() showToggle = true;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  ngOnInit(): void {
    this.navItems = this.navService.getFilteredNavItems();
    this.isLoggedIn = this.authService.isAuthenticated();

    // Optionnel: écouter les changements d'état de connexion
    this.authService.getCurrentUser$().subscribe(user => {
      this.isLoggedIn = !!user;
  });
}
}
