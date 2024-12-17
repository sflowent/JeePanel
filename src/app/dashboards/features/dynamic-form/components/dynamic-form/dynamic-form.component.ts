import { Component, OnInit, inject, input, output } from '@angular/core';
import { FormsModule, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormElementConfig, DynamicForm } from '../../models/dynamic-form.model';
import { FormElementComponent } from '../form-element/form-element.component';

import { DynamicFormService } from '../../services/dynamic-form.service';

@Component({
    selector: 'dynamic-form',
    templateUrl: './dynamic-form.component.html',
    styleUrls: ['./dynamic-form.component.scss'],
    imports: [FormsModule, FormElementComponent, ReactiveFormsModule]
})
export class DynamicFormComponent implements OnInit {
  readonly dynamicForm = input<DynamicForm>();

  readonly form = input<FormGroup>(new FormGroup({}));

  readonly valueChanges = output<any>();

  dynamicFormService = inject(DynamicFormService);

  constructor() {}

  ngOnInit(): void {}

  isVisible(elt: FormElementConfig) {
    return this.dynamicFormService.dynamicForms?.isVisible(elt);
  }

  _valueChanges(data: any) {
    this.valueChanges.emit(data);
  }
}
