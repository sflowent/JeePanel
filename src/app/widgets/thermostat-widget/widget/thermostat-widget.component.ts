import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject, input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { JeeKnobComponent } from '@app/shared/components/jee-knob/jee-knob.component';
import { JeeSelectComponent } from '@app/shared/components/jee-select/jee-select.component';
import { JeeValueUnitComponent } from '@app/shared/components/jee-value-unit/jee-value-unit.component';
import { TextFont } from '@app/shared/features/text/models/text-font.model';
import { WidgetBaseComponent } from '@dashboards/components/widget-base/widget-base-component';
import { WidgetBoxComponent } from '@dashboards/components/widget-box/widget-box.component';
import { CommandListItem } from '@dashboards/models/command-list-item.model';
import { CommandValue } from '@dashboards/models/command-value.model';
import { BackgroundSettings } from '@dashboards/models/widget-settings.model';
import { DashboardManagerService } from '@dashboards/services/dashboard-manager.service';
import { takeUntil } from 'rxjs';
import { ThermostatWidgetConfiguration } from '../models/thermostat-widget-configuration';
import { WidgetIconComponent } from '@app/shared/features/icons/components/widget-icon/widget-icon.component';
import { LabelIconValueComponent } from "../../../dashboards/components/label-icon-value/label-icon-value.component";

@Component({
  selector: 'thermostat-widget',
  standalone: true,
  templateUrl: './thermostat-widget.component.html',
  styleUrls: ['./thermostat-widget.component.scss'],
  imports: [
    CommonModule,
    WidgetBoxComponent,
    JeeKnobComponent,
    MatIcon,
    MatFormFieldModule,
    MatSelectModule,
    JeeSelectComponent,
    JeeValueUnitComponent,
    MatIcon,
    WidgetIconComponent,
    LabelIconValueComponent
],
})
export class ThermostatWidgetComponent extends WidgetBaseComponent implements OnInit {
  override settings= input<ThermostatWidgetConfiguration>(new ThermostatWidgetConfiguration());

  static HEATING_STATUS = 'Chauffage';
  static OFF_STATUS = 'Arrêté';

  changeRef = inject(ChangeDetectorRef);
  dashboardManager = inject(DashboardManagerService);

  background: BackgroundSettings = new BackgroundSettings();

  currentTemperatureFont: TextFont = new TextFont();
  currentTemperature: number = 0;

  setpointTemperatureValue: number = 0;

  status: string = ThermostatWidgetComponent.HEATING_STATUS;

  valMax: number = 30;
  valMin: number = 10;
  heating: boolean = false;

  selectedMode?: CommandListItem;
  modes: CommandListItem[] = [];

  constructor() {
    super();
  }

  ngOnInit(): void {
    const settings = this.settings();

    this.modes = settings.modeCommands || [];

    if (settings.temperatureValueCommand) {
      this.dashboardManager
        .onCommandUpdate(settings.temperatureValueCommand)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: (cv: CommandValue) => {
            this.currentTemperature = cv.value;
            this.changeRef.detectChanges();
          }
        });
    }

    if (settings.setPointTemperatureValueCommand) {
      this.dashboardManager
        .onCommandUpdate(settings.setPointTemperatureValueCommand)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: (cv: CommandValue) => {
            this.setpointTemperatureValue = cv.value;
            //this.changeRef.detectChanges();
          }
        });
    }

    
    if (settings.modeValueCommand) {
      this.dashboardManager
        .onCommandUpdate(settings.modeValueCommand)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: (cv: CommandValue) => {
            this.selectedMode = settings.modeCommands.find(mc => mc.value.toLocaleLowerCase() === cv.value.toLowerCase());
            
            if (!this.selectedMode){
              this.selectedMode = new CommandListItem({
                value: cv.value
              })
            }
            
            this.changeRef.detectChanges();
          }
        });
    }

    if (settings.stateValueCommand) {
      this.dashboardManager
        .onCommandUpdate(settings.stateValueCommand)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: (cv: CommandValue) => {
            this.status = ThermostatWidgetComponent.OFF_STATUS;

           // const heatingValuesLower = this.settings().heatingValues?.map(value => value?.toLowerCase());
            //const heating = heatingValuesLower.some(v => v?.toLowerCase());
            this.heating = this.settings().heatingValue?.toLocaleLowerCase() === cv.value?.toLowerCase()
            if (this.heating){
              this.status = ThermostatWidgetComponent.HEATING_STATUS;
            }

            this.changeRef.detectChanges();
          }
        });
    }

  }

  onSelectedItemChange(){
    if(this.selectedMode?.command){
      this.dashboardManager.sendCmd(this.selectedMode.command);
    }
  }

  onSetPointChange(){
    if(this.settings().setPointTemperatureCommand){
      this.dashboardManager.sendCmd(this.settings().setPointTemperatureCommand, this.setpointTemperatureValue);
    }

  }
}
