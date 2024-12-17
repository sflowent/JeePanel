
import { Component, OnInit, input, output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { debounceTime } from 'rxjs';
import { FormElementConfig } from '../../models/dynamic-form.model';
import { AlternativePickerComponent } from '../elements/alternative-picker/alternative-picker.component';
import { ChartPickerComponent } from '../elements/chart-picker/chart-picker.component';
import { CommandListChartPickerComponent } from '../elements/command-list-chart-picker/command-list-chart-picker.component';
import { CommandListPickerComponent } from '../elements/command-list-picker/command-list-picker.component';
import { CommandPickerComponent } from '../elements/command-picker/command-picker.component';
import { LiteralTypePickerComponent } from '../elements/literal-type-picker/literal-type-picker.component';
import { TextFontPickerComponent } from '../elements/text-font-picker/text-font-picker.component';
import { WidgetIconPickerComponent } from '../elements/widget-icon-picker/widget-icon-picker.component';

@Component({
    selector: 'form-element',
    templateUrl: './form-element.component.html',
    styleUrls: ['./form-element.component.scss'],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        TextFontPickerComponent,
        WidgetIconPickerComponent,
        CommandPickerComponent,
        AlternativePickerComponent,
        CommandListPickerComponent,
        ChartPickerComponent,
        CommandListChartPickerComponent,
        LiteralTypePickerComponent
    ]
})
export class FormElementComponent implements OnInit {
  readonly element = input.required<FormElementConfig>();

  readonly form = input.required<FormGroup>();

  readonly valueCh = output<any>();
  isLiteralValue: boolean = false;
  control!: FormControl<any>;

  constructor() {}

  ngOnInit(): void {
    this.isLiteralValue = ['color', 'text', 'number', 'bool', 'select'].indexOf(this.element().type?.toLowerCase()) >= 0;

    const element = this.element();
    if (this.isLiteralValue) {
      if (!element.value) {
        element.value = '';
      }
    }

    this.control = new FormControl(element.value);
    element.formControl = this.control;
    
    this.form().addControl(element.name, this.control);

    this.control.valueChanges.pipe(debounceTime(500)).subscribe((val: any) => {
      const elementValue = this.element();
      elementValue.value = val;
      if (this.valueCh) {
        this.valueCh.emit({ name: elementValue.name, value: val });
      }
    });
  }
}
