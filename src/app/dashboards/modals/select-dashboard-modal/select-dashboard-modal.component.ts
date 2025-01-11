import { Component, inject, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/shared/features/modals/components/confirm-dialog/confirm-dialog.component';
import { SelectDashboardComponent } from '@dashboards/components/select-dashboard/select-dashboard.component';
import { Dashboard } from '@dashboards/models/dashboard.model';
import { DashboardManagerService } from '@dashboards/services/dashboard-manager.service';

@Component({
  selector: 'jee-select-dashboard-modal',
  imports: [FormsModule, SelectDashboardComponent, MatDialogModule, MatButtonModule],
  templateUrl: './select-dashboard-modal.component.html',
  styleUrl: './select-dashboard-modal.component.scss',
})
export class SelectDashboardModalComponent {
  dashboardManager = inject(DashboardManagerService);

  dashboardCode: string;
  exceptDashboards: string[] = []

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.dashboardCode = data.dashboardCode;
    this.exceptDashboards = data.exceptDashboards;
  }

  onSave() {
    this.dashboardManager.getDashboard(this.dashboardCode).subscribe((dashboard: Dashboard) => {
      this.dialogRef.close(dashboard);
    });
  }
}
