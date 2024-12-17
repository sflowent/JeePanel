
import { Component, Inject, model } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { JeedomCommandPickerModalComponent } from '@app/providers/jeedom/modals/jeedom-command-picker-modal/jeedom-command-picker-modal.component';
import { ChartPeriods, ChartSettings, ChartType, ChartTypes } from '@dashboards/features/charts/models/chart-settings.model';

@Component({
    selector: 'jee-chart-modal-settings',
    imports: [MatDialogModule, MatButton, MatFormField, MatSelectModule, FormsModule],
    templateUrl: './chart-modal-settings.component.html',
    styleUrl: './chart-modal-settings.component.scss'
})
export class ChartModalSettingsComponent {

  chartTypes = ChartTypes.ALL;
  chartPeriods = ChartPeriods.ALL;

  type = model<ChartType>();
  period = model<string>();

  form: FormGroup = new FormGroup({});

  constructor(
    public dialogRef: MatDialogRef<JeedomCommandPickerModalComponent, any>,
    @Inject(MAT_DIALOG_DATA)
    private data: { settings: ChartSettings }
  ) {
    this.type.set(data.settings.type);
    this.period.set(data.settings.period);
  }

  save(){
    this.dialogRef.close({
      type: this.type(),
      period: this.period()
    });
  }

  cancel(){
    this.dialogRef.close();
  }
}
