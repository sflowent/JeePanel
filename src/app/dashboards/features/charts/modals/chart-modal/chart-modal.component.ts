import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { JeedomCommandPickerModalComponent } from '@app/providers/jeedom/modals/jeedom-command-picker-modal/jeedom-command-picker-modal.component';
import { JeedomCmd_http } from '@app/providers/jeedom/models/http-command';
import { ModalService } from '@app/shared/features/modals/services/modal.service';
import { ChartSettings, ChartType } from '@dashboards/features/charts/models/chart-settings.model';
import { Command } from '@dashboards/models/command.model';
import { GenericChartComponent } from '../../components/generic-chart/generic-chart.component';
import { ChartModalSettingsComponent } from '../chart-modal-settings/chart-modal-settings.component';
import { clone } from '@app/shared/functions/clone';

@Component({
  selector: 'jee-chart-modal',
  imports: [MatDialogModule, GenericChartComponent, MatButtonModule, MatIcon],
  templateUrl: './chart-modal.component.html',
  styleUrl: './chart-modal.component.scss',
})
export class ChartModalComponent {
  modalService = inject(ModalService);

  command: Command;
  settings: ChartSettings;
  ChartType = ChartType;

  constructor(
    public dialogRef: MatDialogRef<JeedomCommandPickerModalComponent, JeedomCmd_http>,
    @Inject(MAT_DIALOG_DATA)
    private data: { command: Command; settings: ChartSettings },
  ) {
    this.settings = clone(data.settings);
  }

  showChartSettings() {
    this.modalService
      .open(ChartModalSettingsComponent, {
        settings: this.settings
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.settings = clone(this.settings);
          this.settings.period = result.period;
          this.settings.type = result.type;
        }
      });
  }
}
