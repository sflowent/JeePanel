
import { AfterContentInit, Component, OnInit, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { JeeColorPickerComponent } from '@app/shared/components/jee-color-picker/jee-color-picker.component';
import { JeeSliderNumberComponent } from '@app/shared/components/jee-slider-number/jee-slider-number.component';
import { DefaultValues } from '@app/shared/default-values';
import { MatInputModule } from '@angular/material/input';
import { TextFont, TextFontFormElement } from '@app/shared/features/text/models/text-font.model';

@Component({
    selector: 'text-font-picker',
    templateUrl: './text-font-picker.component.html',
    styleUrls: ['./text-font-picker.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextFontPickerComponent),
            multi: true
        }
    ],
    imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, JeeSliderNumberComponent, JeeColorPickerComponent]
})
export class TextFontPickerComponent implements AfterContentInit, ControlValueAccessor {
  readonly element = input.required<TextFontFormElement>();

  form: FormGroup<{}> = new FormGroup({});

  value: TextFont = new TextFont();

  onChange: any = () => {};
  onTouch: any = () => {};
  disabled: boolean = false;

  formNames: Record<string, string> = {};

  writeValue(value: TextFont): void {
    this.value = value ?? DefaultValues.LabelFont();

    this.refreshFormValue();
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

  protected refreshFormValue(){

    if (!this.formNames["size"]){
      return;
    }

    this.form.controls[this.formNames["size"]].patchValue(this.value.size);
    this.form.controls[this.formNames["color"]].patchValue(this.value.color);
    this.form.controls[this.formNames["unit"]].patchValue(this.value.unit);
    this.updateValue();
  }

  ngAfterContentInit(): void {
    this.addControl('size', this.value.size ?? DefaultValues.LabelFont().size);
    this.addControl('color', this.value.color ?? 'black');
    this.addControl('unit', this.value.unit ?? '');
  }

  addControl(name: string, value: any) {
    const element = this.element();
    const control = new FormControl(value);

    //element.formControl = control;

    this.formNames[name] = this.element().name + '.' + name;

    this.form.addControl(this.formNames[name], control);

    control.valueChanges.subscribe(value => {
      this.value[name] = value;
      this.updateValue();
    });
  }
}
