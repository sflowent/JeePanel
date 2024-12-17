
import { Component, forwardRef, inject, input } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProvidersService } from '@app/core/providers/services/providers.service';
import { JeeColorPickerComponent } from '@app/shared/components/jee-color-picker/jee-color-picker.component';
import { JeeSliderNumberComponent } from '@app/shared/components/jee-slider-number/jee-slider-number.component';
import { FormElementConfig } from '../../../models/dynamic-form.model';

@Component({
    selector: 'literal-type-picker',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => LiteralTypePickerComponent),
            multi: true
        }
    ],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      MatCheckboxModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      JeeSliderNumberComponent,
      JeeColorPickerComponent,
    ],
    templateUrl: './literal-type-picker.component.html',
    styleUrl: './literal-type-picker.component.scss'
})
export class LiteralTypePickerComponent implements ControlValueAccessor {
  providersService = inject(ProvidersService);

  readonly label = input<string | null>(null);

  readonly element = input.required<FormElementConfig>();

  readonly form = input.required<FormGroup<{}>>();

  readonly control = input.required<FormControl<any>>();

  value: any;

  onChange: any = () => {};
  onTouch: any = () => {};
  disabled: boolean = false;

  formInt: FormGroup<{}> = new FormGroup({});
  
  constructor(){
  }

  writeValue(value: any): void {
    this.value = value;
    this._initialize();
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

  labelId: string = '';

  _initialize(): void {
  }
}
