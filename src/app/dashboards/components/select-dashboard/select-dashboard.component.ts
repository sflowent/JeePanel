import { Component, forwardRef, inject, input, model, OnInit } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Dashboard } from '@dashboards/models/dashboard.model';
import { DashboardManagerService } from '@dashboards/services/dashboard-manager.service';

@Component({
  selector: 'jee-select-dashboard',
  imports: [FormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './select-dashboard.component.html',
  styleUrl: './select-dashboard.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectDashboardComponent),
      multi: true,
    },
  ],
})
export class SelectDashboardComponent implements OnInit, ControlValueAccessor {

  dashboardManager = inject(DashboardManagerService);

  dashboardCode = model<string>();
  exceptDashboards = input<string[]>([]);
  
  onChange: any = () => {};
  onTouch: any = () => {};
  disabled: boolean = false;

  dashboards: Dashboard[] = [];

  dashboardSelected: Dashboard | undefined;

  constructor(){

  }
  ngOnInit(): void {
    this.dashboardManager.getDashboards().subscribe((dashboards) => {

      if (this.exceptDashboards()?.length){
        dashboards = dashboards.filter(d => !this.exceptDashboards()?.some(code => d.settings.code === code));
      }
      
      this.dashboards = dashboards.sort((a, b) => (a?.settings.title >= b?.settings.title ? 1 : -1));
    })
  }

  writeValue(value: string): void {
    this.dashboardCode.set(value);

      if (this.dashboardCode()){
        this.dashboardSelected = this.dashboards.find(d => d.settings.code === this.dashboardCode())
      }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  updateValue(): void {
    this.onChange(this.dashboardCode());
    this.onTouch();
  }

  onDashboardSelected(){

    this.dashboardCode.set(this.dashboardSelected?.settings.code);
    this.updateValue();
  }

}
