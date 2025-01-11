import { AfterContentInit, Component, OnInit, effect, forwardRef, inject, input, signal } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Command } from '@dashboards/models/command.model';
import { MatInput } from '@angular/material/input';
import { debounceTime } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProvidersService } from '@app/core/providers/services/providers.service';
import { SelectCommandSettings } from './select-command-settings.model';

@Component({
  selector: 'jee-select-command',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectCommandComponent),
      multi: true,
    },
  ],
  imports: [FormsModule, MatFormFieldModule, ReactiveFormsModule, MatInput, MatButtonModule, MatIconModule],
  templateUrl: './select-command.component.html',
  styleUrl: './select-command.component.scss',
})
export class SelectCommandComponent implements ControlValueAccessor {
  providersService = inject(ProvidersService);

  readonly settings = input.required<SelectCommandSettings>();

  value: Command = new Command();

  onChange: any = () => {};
  onTouch: any = () => {};
  disabled = signal(false);

  form: FormGroup<{}> = new FormGroup({});

  formNames: any = {};
  controlCommandLabel = new FormControl<string>('');

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
    this.disabled.set(isDisabled);
  }

  updateValue(): void {
    this.onChange(this.value);
    this.onTouch();
  }

  labelId: string = '';

  _initialize(): void {
    if (this.form.contains('commandLabel')) {
      this._updateCommandLabel();
      return;
    }

    this.form.addControl('commandLabel', this.controlCommandLabel);

    this._updateCommandLabel();

    this.controlCommandLabel.valueChanges.pipe(debounceTime(500)).subscribe((val: string | null) => {
      this.controlCommandLabel.setErrors({ commandLabel: false });
      if (!val) {
        this.value = new Command();
        this.updateValue();
        return;
      }
      const labelInfo = val?.split(ProvidersService.PROVIDER_SEPARATOR);
      if (labelInfo.length == 2) {
        const providerName = val.split(ProvidersService.PROVIDER_SEPARATOR)[0];

        if (providerName) {
          const labelId = val.split(ProvidersService.PROVIDER_SEPARATOR)[1];
          const provider = this.providersService.getProvider(providerName);
          const newCommand = provider?.getCommandByLabelId(labelId);
          if (newCommand) {
            this.value = newCommand;
            this.updateValue();
            return;
          }
        }
      }

      this.controlCommandLabel.setErrors({ commandLabel: true });
    });
  }

  openCommandPicker() {
    this.providersService.openCommandPickerModal(this.settings(), this.value).subscribe((cv: Command) => {
      if (cv) {
        this.value = cv;
        this._updateCommandLabel();
        this.updateValue();
      }
    });
  }

  private _updateCommandLabel(): void {
    let commandLabel = '';
    if (!this.value) {
      return;
    }

    const provider = this.providersService.getProvider(this.value.providerCode);
    if (provider) {
      provider.getCommandLabelId(this.value).subscribe((label) => {
        if (label) {
          const commandLabel = this.value.providerCode + ProvidersService.PROVIDER_SEPARATOR + label;

          this.controlCommandLabel.setValue(commandLabel, { emitEvent: false });
        }
      });
    }
  }
}
