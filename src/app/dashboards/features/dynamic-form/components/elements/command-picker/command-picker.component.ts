import { Component, forwardRef, inject, input } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { SelectCommandSettings } from '@app/core/components/select-command/select-command-settings.model';
import { SelectCommandComponent } from '@app/core/components/select-command/select-command.component';
import { ProvidersService } from '@app/core/providers/services/providers.service';
import { Command } from '@dashboards/models/command.model';
import { FormElementConfig } from '../../../models/dynamic-form.model';

@Component({
  selector: 'jee-command-picker',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CommandPickerComponent),
      multi: true,
    },
  ],
  imports: [FormsModule, MatFormFieldModule, ReactiveFormsModule, MatButtonModule, MatIconModule, SelectCommandComponent],
  templateUrl: './command-picker.component.html',
  styleUrl: './command-picker.component.scss',
})
export class CommandPickerComponent implements ControlValueAccessor {
  providersService = inject(ProvidersService);

  readonly element = input.required<FormElementConfig>();

  value: Command | null = null;

  onChange: any = () => {};
  onTouch: any = () => {};
  disabled: boolean = false;

  form: FormGroup<{}> = new FormGroup({});

  selectCommandSettings!: SelectCommandSettings;

  constructor() {}

  writeValue(value: Command): void {
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

  onCommandSelected(){
    if (this.value?.commandRef) {
      this.providersService.getProvider(this.value?.providerCode!)?.presetsWidgetCommands(this.element(), this.value);
    }
    this.updateValue();
  }

  _initialize(): void {

    this.selectCommandSettings = {
      name: this.element()?.name,
      label: this.element()?.label,
      type: this.element()?.ui?.type,
      isHistorized: this.element()?.ui?.isHistorized ?? false,
      subType: this.element()?.ui?.subType,
    };
    
  }
}
