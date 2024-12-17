
import { AfterContentInit, Component, forwardRef, inject, input } from '@angular/core';
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { JeeColorPickerComponent } from '@app/shared/components/jee-color-picker/jee-color-picker.component';
import { AlternativeItem, AlternativeSettings } from '@dashboards/models/alternative-settings.model';
import { ProvidersService } from '@app/core/providers/services/providers.service';
import { debounceTime } from 'rxjs';
import { FormElementConfig } from '../../../models/dynamic-form.model';
import { WidgetIconPickerComponent } from '../widget-icon-picker/widget-icon-picker.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { AlternativeFormElement } from './models/alterative-form-element.model';

@Component({
    selector: 'jee-alternative-picker',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AlternativePickerComponent),
            multi: true
        }
    ],
    imports: [
        FormsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInput,
        MatButtonModule,
        MatCheckbox,
        MatIconModule,
        MatExpansionModule,
        JeeColorPickerComponent,
        WidgetIconPickerComponent
    ],
    templateUrl: './alternative-picker.component.html',
    styleUrl: './alternative-picker.component.scss'
})
export class AlternativePickerComponent implements AfterContentInit, ControlValueAccessor {
  providersService = inject(ProvidersService);
  formBuilder = inject(FormBuilder);

  readonly element = input<AlternativeFormElement>(new AlternativeFormElement());

  value: AlternativeSettings = new AlternativeSettings();

  onChange: any = () => {};
  onTouch: any = () => {};
  disabled: boolean = false;

  readonly form = input.required<FormGroup>();

  readonly noColors = input<boolean>(false);

  readonly noIcons = input<boolean>(false);

  readonly noDescription = input<boolean>(false);

  formNames: any = {};
  controlCommandLabel = new FormControl<string>('');
  formArrayAlternatives!: FormArray;

  writeValue(value: AlternativeSettings): void {
    this.value = value ?? new AlternativeSettings();
    this.value.alternatives ??= [];
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

    this.formArrayAlternatives = this.formBuilder.array([]);
    this.form().addControl('alternatives', this.formArrayAlternatives);
    //this.element.formControl = this.formArrayAlternatives;

    this.value.alternatives.forEach(alt => {
      this.addAlternativeFormControl(alt);
    });
  }

  addAlternative() {
    const newAlternative = new AlternativeItem();
    this.value.alternatives.push(newAlternative);
    this.addAlternativeFormControl(newAlternative);
  }

  deleteAlternative(index: number) {
    this.value.alternatives.splice(index, 1);
    this.formArrayAlternatives.removeAt(index);
    this.updateValue();
  }

  addAlternativeFormControl(alt: AlternativeItem) {
    const alternativeForm = this.formBuilder.group({
      expression: [alt.expression, Validators.required],
      bgColor: [alt.bgColor],
      labelColor: [alt.labelColor],
      valueColor: [alt.valueColor],
      icon: [alt.icon],
      hightlightIcon: [alt.hightlightIcon],
      bgIcon: [alt.bgIcon],
      displayValue: [alt.displayValue]
    });

    alternativeForm.controls['expression'].valueChanges.subscribe(val => {
      debugger;
      alt.expression = val || '';
      this.updateValue();
    });
    alternativeForm.controls['bgColor'].valueChanges.subscribe(val => {
      alt.bgColor = val || undefined;
      this.updateValue();
    });
    alternativeForm.controls['displayValue'].valueChanges.pipe(debounceTime(200)).subscribe(val => {
      alt.displayValue = val || undefined;
      this.updateValue();
    });
    alternativeForm.controls['icon'].valueChanges.pipe(debounceTime(200)).subscribe(val => {
      alt.icon = val || undefined;
      this.updateValue();
    });
    alternativeForm.controls['bgIcon'].valueChanges.pipe(debounceTime(200)).subscribe(val => {
      alt.bgIcon = val || undefined;
      this.updateValue();
    });
    alternativeForm.controls['hightlightIcon'].valueChanges.pipe(debounceTime(200)).subscribe(val => {
      alt.hightlightIcon = val || undefined;
      this.updateValue();
    });

    this.formArrayAlternatives.push(alternativeForm);
  }
}
