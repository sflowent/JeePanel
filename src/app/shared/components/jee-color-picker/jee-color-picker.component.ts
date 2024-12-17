import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, forwardRef, HostBinding, Input, OnInit, input, model } from '@angular/core';
import { ControlValueAccessor, FormGroup, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { ColorPickerModule, ColorPickerService } from 'ngx-color-picker';

@Component({
    selector: 'jee-color-picker',
    templateUrl: './jee-color-picker.component.html',
    styleUrls: ['./jee-color-picker.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => JeeColorPickerComponent),
            multi: true
        }
    ],
    imports: [CommonModule, FormsModule, MatInputModule, ColorPickerModule, MatCheckboxModule, MatCheckboxModule]
})
export class JeeColorPickerComponent implements AfterContentInit, ControlValueAccessor {
  readonly form = input<FormGroup>();

  readonly round = input<boolean>(true);

  readonly nullable = input<boolean>(true);

  readonly formControlName = input<string>();

  noValue: boolean;

  private _ID = '';

  readonly _value = model<any>(undefined, { alias: "value" });
  onChange: any = () => {};
  onTouched: any = () => {};

  get value() {
    return this._value();
  }

  set value(val) {
    this._value.set(val);
    this.onChange(val);
    this.onTouched();
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  writeValue(value:string) {
      this.value = value;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  constructor() {}

  ngAfterContentInit(): void {

    if (this.nullable()){
      this.noValue = !this.value;
    }
  }

  onColorChanged(color: string) {
    this.form().controls[this.formControlName()].setValue(color);
    if (color){
      this.noValue = false;
    }
  }

  onNoValueSelected(){

    if (this.noValue){
      this.form().controls[this.formControlName()].setValue(null);
    }

  }
}
