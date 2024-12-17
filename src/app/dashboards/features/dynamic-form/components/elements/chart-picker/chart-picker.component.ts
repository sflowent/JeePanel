
import { AfterContentInit, Component, OnInit, forwardRef, inject, input } from '@angular/core';
import { ControlValueAccessor, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProvidersService } from '@app/core/providers/services/providers.service';
import { ChartPeriods, ChartSettings, ChartTypes } from '@dashboards/features/charts/models/chart-settings.model';
import { FormElementConfig } from '@dashboards/features/dynamic-form/models/dynamic-form.model';
import { AlternativePickerComponent } from '../alternative-picker/alternative-picker.component';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
    selector: 'jee-chart-picker',
    imports: [
        FormsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        AlternativePickerComponent,
        MatCheckbox
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ChartPickerComponent),
            multi: true
        }
    ],
    templateUrl: './chart-picker.component.html',
    styleUrl: './chart-picker.component.scss'
})
export class ChartPickerComponent implements OnInit, AfterContentInit, ControlValueAccessor {


  providersService = inject(ProvidersService);
  formBuilder = inject(FormBuilder);

  readonly element = input<FormElementConfig>(new FormElementConfig());

  readonly noAlternatives = input<boolean>(true);

  readonly form = input<FormGroup<{}>>();

  value: ChartSettings = new ChartSettings();

  onChange: any = () => {};
  onTouch: any = () => {};
  disabled: boolean = false;

  chartTypes: any[] = ChartTypes.ALL;
  chartPeriods: any[] = ChartPeriods.ALL;

  formNames: any = {};
  controlCommandLabel = new FormControl<string>('');
  formArrayCommands: FormArray = this.formBuilder.array([]);
  typeFromControl: FormControl<any>;

  writeValue(value: ChartSettings): void {
    this.value = value ?? new ChartSettings();
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
    this.onChange(this.value);
    this.onTouch();
  }

  ngOnInit(): void {
   
  }

  ngAfterContentInit(): void {
    this.typeFromControl = this.addControl('type', this.value.type);
    this.addControl('period', this.value.period);
    this.addControl('alternatives', this.value.alternatives);
    this.addControl('hideFilters', this.value.hideFilters);
  }

  addControl(name: string, value: any): FormControl {
    const control = new FormControl(value);
    this.formNames[name] = this.element().name + '.' + name;

    this.form().addControl(this.formNames[name], control);

    control.valueChanges.subscribe(value => {
      this.value[name] = value;
      this.updateValue();
    });

    return control;
  }

}
