
import { Component, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { clone } from '@app/shared/functions/clone';
import { DynamicFormComponent } from '../../components/dynamic-form/dynamic-form.component';
import { DynamicForm } from '../../models/dynamic-form.model';
import { DynamicFormService } from '../../services/dynamic-form.service';
import { DynamicForms } from '../../models/dynamic-forms.model';

@Component({
    selector: 'dynamic-form-modal',
    templateUrl: './dynamic-form-modal.component.html',
    styleUrls: ['./dynamic-form-modal.component.scss'],
    imports: [MatTabsModule, MatButtonModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, FormsModule, DynamicFormComponent]
})
export class DynamicFormModal implements OnInit, OnDestroy {
  dynamicFormService = inject(DynamicFormService);

  settings: any;
  form: FormGroup = new FormGroup({});
  dynamicForms: DynamicForm[];
  valueChanges: any;
  title: any;
  metadata: any;

  constructor(
    public dialogRef: MatDialogRef<DynamicFormModal>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    // clone
    this.dynamicForms = data.dynamicForms;
    this.metadata = data.metadata;
    //data.dynamicForms.forEach((df:DynamicForm) => this.dynamicForms.push(DynamicForm.newDynamicForm(df)))

    this.valueChanges = data.valueChanges ?? this._valueChanges;
    this.title = data.title;
  }
  ngOnDestroy(): void {
    this.dynamicFormService.dynamicForms = null;
  }

  ngOnInit(): void {
    this.dynamicFormService.dynamicForms = new DynamicForms(this.dynamicForms, this.metadata, this.form);
  }

  isVisible(tab: DynamicForm) {
    return this.dynamicFormService.dynamicForms?.isVisible(tab);
  }

  _valueChanges(data: any) {}

  formSubmitted(event: any) {
    this.dialogRef.close(this.dynamicForms);
  }
}
