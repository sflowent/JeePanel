
import { AfterContentInit, Component, OnInit, forwardRef, inject, input } from '@angular/core';
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ProvidersService } from '@app/core/providers/services/providers.service';
import { JeeColorPickerComponent } from '@app/shared/components/jee-color-picker/jee-color-picker.component';
import { SeriesItem } from '@dashboards/features/charts/models/series-item.model';
import { debounceTime } from 'rxjs';
import { FormElementConfig } from '../../../models/dynamic-form.model';
import { CommandPickerComponent } from '../command-picker/command-picker.component';

@Component({
    selector: 'jee-command-list-chart-picker',
    imports: [
        FormsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        CommandPickerComponent,
        JeeColorPickerComponent,
        MatExpansionModule
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CommandListChartPickerComponent),
            multi: true
        }
    ],
    templateUrl: './command-list-chart-picker.component.html',
    styleUrl: './command-list-chart-picker.component.scss'
})
export class CommandListChartPickerComponent implements OnInit, AfterContentInit, ControlValueAccessor {
  providersService = inject(ProvidersService);
  formBuilder = inject(FormBuilder);

  readonly element = input<FormElementConfig>(new FormElementConfig());

  readonly form = input<FormGroup<{}>>();

  series: SeriesItem[] = [];

  onChange: any = () => {};
  onTouch: any = () => {};
  disabled: boolean = false;

  formNames: any = {};
  controlCommandLabel = new FormControl<string>('');
  formArrayCommands: FormArray = this.formBuilder.array([]);

  writeValue(value: SeriesItem[]): void {
    this.series = value ?? [];

    this.formArrayCommands.clear();

    this.series.forEach(alt => {
      this.addCommandFormControl(alt);
    });
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
    this.onChange(this.series);
    this.onTouch();
  }

  labelId: string = '';

  constructor() {}

  ngOnInit(): void {
    this.form().addControl('commandListChart', this.formArrayCommands);
  }

  ngAfterContentInit(): void {
    const element = this.element();
    if (!element.ui) {
      element.ui = {};
    }
    if (!element.ui['isHistorized']) {
      element.ui['isHistorized'] = true;
    }
    if (!element.ui['type']) {
      element.ui['type'] = "info";
    }
  }

  addCommand() {
    const newCommnand = new SeriesItem();
    this.series.push(newCommnand);
    this.addCommandFormControl(newCommnand);
  }

  deleteCommand(index: number) {
    this.series.splice(index, 1);
    this.formArrayCommands.removeAt(index);
    this.updateValue();
  }

  addCommandFormControl(command: SeriesItem) {
    const commandForm = this.formBuilder.group({
      command: [command.command],
      name: [command.name],
      color: [command.color]
    });

    commandForm.controls['command'].valueChanges.pipe(debounceTime(200)).subscribe((val: any) => {
      command.command = val;
      this.updateValue();
    });

    commandForm.controls['name'].valueChanges.pipe(debounceTime(200)).subscribe((val: any) => {
      command.name = val;
      this.updateValue();
    });

    commandForm.controls['color'].valueChanges.pipe(debounceTime(200)).subscribe(val => {
      command.color = val;
      this.updateValue();
    });

    this.formArrayCommands.push(commandForm);
  }
}
