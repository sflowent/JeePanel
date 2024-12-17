
import { Component, HostBinding, Input, forwardRef, input, model } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';

@Component({
    selector: 'jee-slider-number',
    templateUrl: './jee-slider-number.component.html',
    styleUrls: ['./jee-slider-number.component.scss'],
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => JeeSliderNumberComponent),
            multi: true
        }
    ],
    imports: [FormsModule, MatInputModule, MatSliderModule, MatFormFieldModule, ReactiveFormsModule]
})
export class JeeSliderNumberComponent implements ControlValueAccessor {
  form = model<FormGroup>();

  readonly formControlName = input<string>("number");

  readonly label = input('');

  readonly min = input(1);

  readonly max = input<number>();

  formControl!: FormControl<number | null>;

  _value = model(0, { alias: "value" });
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor() {}

  get value() {
    return this._value();
  }

  set value(val) {
    this._value.set(val);
    this.onChange(val);
    this.onTouched();
  }

  registerOnChange(fn:any) {
    this.onChange = fn;
  }

  writeValue(value: number) {
    const form = this.form();
    if (!form){
      this.form.set(new FormGroup({}));
      this.formControl = new FormControl(this.value);
      this.form()!.addControl(this.formControlName(), this.formControl);
      this.formControl.valueChanges.subscribe((val) => {
        this.value = val || 0;
      })
    }
    else if (this.formControl){
      this.formControl.setValue(value);
    }

    if (value) {
      this.value = value;
    }
  }

  registerOnTouched(fn:any) {
    this.onTouched = fn;
  }

  sliderChanged($: Event) {}
}
