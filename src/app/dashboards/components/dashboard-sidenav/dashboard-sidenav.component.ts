import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { PageTitleService } from '@app/core/services/page-title-service.service';
import { SideNavService } from '@app/core/services/sidenav.service';
import { JEE_SETTINGS } from '@app/core/settings/models/jeepanel-settings.model';
import { PromptDialogComponent } from '@app/shared/features/modals/components/prompt-dialog/prompt-dialog.component';
import { ModalService } from '@app/shared/features/modals/services/modal.service';
import { Dashboard } from '../../models/dashboard.model';
import { DashboardManagerService } from '../../services/dashboard-manager.service';

@Component({
    selector: 'dashboard-sidenav',
    standalone: true,
    templateUrl: './dashboard-sidenav.component.html',
    styleUrls: ['./dashboard-sidenav.component.scss'],
    imports: [RouterModule, CommonModule, MatButtonModule, MatIconModule, DatePipe]
})
export class DashboardSidenavComponent implements OnInit {
  modalService = inject(ModalService);
  dashboardManager = inject(DashboardManagerService)
  pageTitleService = inject(PageTitleService)
  sidenavService = inject(SideNavService)
  jeePanelSettings = inject(JEE_SETTINGS)

  now: number = Date.now();
  editMode = computed(() => this.pageTitleService.editMode());

  constructor(){
  
  }

  ngOnInit(): void {
    setInterval(() => {
      this.now = Date.now();
    }, 1000);

  }

  addDashboard(){
    this.modalService.open(PromptDialogComponent, {
      title: "Nouveau Dashboard"
    }).afterClosed().subscribe((dashboardName: string) => {

      if (dashboardName){
      this.dashboardManager.saveDashboard(new Dashboard({
        settings: {
          title: dashboardName,
          code: encodeID(dashboardName)
        }
      }))
      }
    })
  }

  removeDashboard(dashboard:Dashboard, event:Event){

    this.dashboardManager.removeDashboard(dashboard.id).subscribe(() => {

    });

    event.stopPropagation();
  }

  togglePin($event: Event){
    
    $event.stopPropagation();
    this.sidenavService.togglePin();
  }
}

function encodeID(s) {
  if (s==='') return '_';
  return s.replace(/[^a-zA-Z0-9.-]/g, "");
}
