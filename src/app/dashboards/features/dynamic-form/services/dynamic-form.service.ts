import { Injectable } from '@angular/core';
import { DynamicForm } from '../models/dynamic-form.model';
import { DynamicForms } from '../models/dynamic-forms.model';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {
  dynamicForms?: DynamicForms | null;

  constructor() {}

  toModel(model: any, forms: DynamicForm[]) {
    const allElements = forms.flatMap(c => c.rows);

    allElements.forEach(data => {
      let obj = model;
      var arr = data.name.split('.');
      while (arr.length - 1 && (obj = obj[arr.shift()!]));

      obj[arr[arr.length - 1]] = data.value;
    });
  }
}
