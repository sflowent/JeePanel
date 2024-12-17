import { AfterContentInit, Component, ElementRef, forwardRef, inject, input } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { JeeSliderNumberComponent } from '@app/shared/components/jee-slider-number/jee-slider-number.component';
import { IconPickerComponent } from '@app/shared/features/icons/components/icon-picker/icon-picker.component';
import { IconFormElement, IconSettings } from '@app/shared/features/icons/models/icon-settings.model';
import { IconSet } from '@app/shared/features/icons/models/iconset.model';
import { IconService } from '@app/shared/features/icons/services/icon.service';

@Component({
    selector: 'widget-icon-picker',
    templateUrl: './widget-icon-picker.component.html',
    styleUrls: ['./widget-icon-picker.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, MatCheckboxModule, IconPickerComponent, JeeSliderNumberComponent],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => WidgetIconPickerComponent),
            multi: true
        }
    ]
})
export class WidgetIconPickerComponent implements AfterContentInit, ControlValueAccessor {
  readonly element = input<IconFormElement>(new IconFormElement());

  elementRef = inject(ElementRef);
  iconsService = inject(IconService);

  value?: IconSettings = new IconSettings();

  onChange: any = () => {};
  onTouch: any = () => {};
  disabled: boolean = false;
  iconSet: IconSet | null = null;
  form: FormGroup<{}> = new FormGroup({});

  noValue = false;
  iconCtrl: FormControl<IconSettings | null | undefined>;
  iconSizeCtrl: FormControl<any>;

  writeValue(value: IconSettings): void {
    this.value = value;

    if (!this.element()?.ui?.nullable) {
      this.value ||= new IconSettings();
    }

    this.noValue = !this.value;

    if (this.iconCtrl){
      this.iconCtrl.patchValue(this.value);
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
    this.onChange(this.value);
    this.onTouch();
  }

  ngAfterContentInit(): void {
    //this.label() ??= this.element().label;

    this.iconCtrl = new FormControl(this.value);
    this.form.addControl('icon', this.iconCtrl);

    this.iconSizeCtrl = new FormControl(this.value?.size);
    this.form.addControl('iconSize', this.iconSizeCtrl);

    this.iconCtrl.valueChanges.subscribe(value => {
      this.value = value;
      this.updateValue();
    });

    this.iconSizeCtrl.valueChanges.subscribe(value => {
      this.value.size = value;
      this.updateValue();
    });
  }

  onNoValueSelected() {
    if (this.noValue){
      this.value = undefined;
      this.updateValue();
      return;
    }

    this.value = new IconSettings();
    this.iconCtrl.setValue(this.value);
    this.iconSizeCtrl.setValue(this.value?.size);
    this.updateValue();
  }
}
