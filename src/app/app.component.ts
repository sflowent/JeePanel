import { CommonModule, DatePipe, DOCUMENT } from '@angular/common';
import { Component, HostListener, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDrawerContainer, MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { DashboardManagerService } from '@dashboards/services/dashboard-manager.service';
import { PageTitleService } from './core/services/page-title-service.service';
import { SideNavService } from './core/services/sidenav.service';
import { JEE_SETTINGS } from './core/settings/models/jeepanel-settings.model';
import { DashboardSidenavComponent } from './dashboards/components/dashboard-sidenav/dashboard-sidenav.component';
import { ToolbarActionsComponent } from './shared/components/toolbar-actions/toolbar-actions.component';
import { ModalService } from './shared/features/modals/services/modal.service';
@Component({
    selector: 'jee-panel-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [
        MatMenuModule,
        CommonModule,
        RouterOutlet,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        DatePipe,
        DashboardSidenavComponent,
        ToolbarActionsComponent,
    ]
})
export class AppComponent {
  document = inject(DOCUMENT);
  window = inject(Window);
  jeePanelSettings = inject(JEE_SETTINGS);
  matIconRegistry = inject(MatIconRegistry);

  opened: boolean = false;
  now: number = Date.now();

  modalService = inject(ModalService);
  dashboardManagerService = inject(DashboardManagerService);
  pageTitleService = inject(PageTitleService);
  sidenavService = inject(SideNavService);
  documentElement: HTMLElement = this.document.documentElement;

  readonly sidenav = viewChild.required<MatSidenav>('sidenav');
  readonly drawerContainer = viewChild.required<MatDrawerContainer>('drawerContainer');
  
  isFullScreen: boolean = false;
  loading: boolean = false;

  constructor(){
    this.matIconRegistry.setDefaultFontSetClass("material-symbols-outlined");
  }

  ngOnInit(): void {

    this.loading = false;

    setInterval(() => {
      this.now = Date.now();
    }, 1000);

    this.sidenavService.configure(this.sidenav(), this.drawerContainer());
    this.documentElement = document.documentElement;
    this.checkScreenMode();
  }

  closeSidenav(){
    if (!this.sidenavService.pinned)
    {
      this.sidenav().close();
    }
  }

  sidenavClosed(){

  }

  sidenavOpened(){
  }

  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  fullscreenmodes(event: any) {
    this.checkScreenMode();
  }

  checkScreenMode() {
    if (document.fullscreenElement) {
      this.isFullScreen = true;
    } else {
      this.isFullScreen = false;
    }
  }

  openFullscreen() {
    if (this.documentElement.requestFullscreen) {
      this.documentElement.requestFullscreen();
    }
  }

  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    }
  }
}
