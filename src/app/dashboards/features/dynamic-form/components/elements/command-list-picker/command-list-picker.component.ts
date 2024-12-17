import { AfterContentInit, Component, OnInit, effect, forwardRef, inject, input } from '@angular/core';
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ProvidersService } from '@app/core/providers/services/providers.service';
import { JeeColorPickerComponent } from '@app/shared/components/jee-color-picker/jee-color-picker.component';
import { FormElementConfig } from '@dashboards/features/dynamic-form/models/dynamic-form.model';
import { CommandListItem } from '@dashboards/models/command-list-item.model';
import { Command } from '@dashboards/models/command.model';
import { debounceTime } from 'rxjs';
import { CommandPickerComponent } from '../command-picker/command-picker.component';
import { WidgetIconPickerComponent } from '../widget-icon-picker/widget-icon-picker.component';
import { CommandListFormElement } from './models/command-list-form-element.model';
import { CommandFormElementConfig } from '@app/core/providers/models/command-form-element';

class CmdListItemUI{
  commandElement: FormElementConfig<Command>;
  formGroup: FormGroup;
  command: CommandListItem;
}

@Component({
  selector: 'jee-command-list-picker',
  imports: [
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CommandPickerComponent,
    JeeColorPickerComponent,
    MatExpansionModule,
    WidgetIconPickerComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CommandListPickerComponent),
      multi: true,
    },
  ],
  templateUrl: './command-list-picker.component.html',
  styleUrl: './command-list-picker.component.scss',
})
export class CommandListPickerComponent implements OnInit, AfterContentInit, ControlValueAccessor {
  providersService = inject(ProvidersService);
  formBuilder = inject(FormBuilder);

  readonly element = input<CommandListFormElement>(new CommandListFormElement());

  readonly form = input.required<FormGroup<{}>>();

  value: CommandListItem[] = [];

  items: CmdListItemUI[] = [];

  onChange: any = () => {};
  onTouch: any = () => {};
  disabled: boolean = false;

  formNames: any = {};
  controlCommandLabel = new FormControl<string>('');
  formArrayCommands: FormArray = this.formBuilder.array([]);

  writeValue(value: CommandListItem[]): void {
    this.value = value ?? [];

    this.formArrayCommands.clear();
    this.items.length = 0;

    this.value.forEach((alt, index) => {
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
    this.onChange(this.value);
    this.onTouch();
  }

  labelId: string = '';

  constructor() {
  }

  ngOnInit(): void {
    this.form().addControl('commandList', this.formArrayCommands);
  }

  ngAfterContentInit(): void {}

  addCommand() {
    const newCommnand = new CommandListItem();
    this.value.push(newCommnand);
    this.addCommandFormControl(newCommnand);
  }

  deleteCommand(index: number, $event: Event) {
    this.value.splice(index, 1);
    this.items.splice(index, 1);
    this.formArrayCommands.removeAt(index);
    this.updateValue();

    $event.stopPropagation();
  }

  addCommandFormControl(command: CommandListItem) {
    const commandForm = this.formBuilder.group({
      command: [command.command],
      value: [command.value],
      bgColor: [command.bgColor],
      labelColor: [command.labelColor],
      valueColor: [command.valueColor],
      icon: [command.icon],
    });

    const subElement = new CommandFormElementConfig({
      name: this.element().name + "-" + (this.items.length+1),
      value: command.command,
      parent: this.element(),
      formControl: commandForm
    });

    const newItem: CmdListItemUI= {
      commandElement: subElement,
      formGroup: commandForm,
      command: command
    }

    this.items.push(newItem);

    commandForm.controls['command'].valueChanges.pipe(debounceTime(200)).subscribe((val: any) => {
      console.log(val);
      command.command = val;
      this.updateValue();
    });

    commandForm.controls['value'].valueChanges.pipe(debounceTime(200)).subscribe((val: any) => {
      command.value = val;
      this.updateValue();
    });

    commandForm.controls['bgColor'].valueChanges.pipe(debounceTime(200)).subscribe((val) => {
      command.bgColor = val;
      this.updateValue();
    });

    commandForm.controls['labelColor'].valueChanges.pipe(debounceTime(200)).subscribe((val) => {
      command.labelColor = val || '';
      this.updateValue();
    });

    commandForm.controls['valueColor'].valueChanges.pipe(debounceTime(200)).subscribe((val) => {
      command.valueColor = val || '';
      this.updateValue();
    });

    commandForm.controls['icon'].valueChanges.pipe(debounceTime(200)).subscribe((val) => {
      command.icon = val || undefined;
      this.updateValue();
    });

    this.formArrayCommands.push(commandForm);
  }
}
