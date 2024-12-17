import { WritableSignal, signal } from '@angular/core';
import { AbstractControl, FormControl, FormControlDirective } from '@angular/forms';

export interface IVisible {
  show?: { name: string; equals: [string] };
  hide?: { name: string; equals: [string] };
}

export class DynamicForm implements IVisible {
  label?: string;

  rows: FormElementConfig[] = [];

  show?: { name: string; equals: [string] };
  hide?: { name: string; equals: [string] };

  constructor(label?: string, rows?: FormElementConfig[]) {
    this.label = label;
    this.rows = rows || [];
  }

  static newDynamicForm(form: DynamicForm) {
    const newForm = new DynamicForm();
    newForm.label = form.label;
    newForm.show = form.show;
    newForm.hide = form.hide;

    form.rows?.forEach(r => newForm.rows.push(FormElementConfig.newDynamicForm(r)));

    return newForm;
  }
}

export class FormElementConfig<T = any> implements IVisible {
  name: string;
  type: string;
  label?: string;

  protected _value?: T | null = null;

  ui?: any;
  validators?: unknown;
  defaultValue?: any;
  required? = false;
  category?: string;

  show?: { name: string; equals: [string] };
  hide?: { name: string; equals: [string] };

  parent?:  FormElementConfig;

  formControl?: AbstractControl;
  signalValue?: WritableSignal<T | null>;

  get value(): T | null {
    if (!this.signalValue) {
      this.signalValue = signal(this._value || null);
    }
    return this._value ?? null;
  }

  set value(value: T | null) {
    this._value = value;
    if (!this.signalValue) {
      this.signalValue = signal(value);
    } else {
      this.signalValue.set(value);
    }
  }

  // /**
  //  * 
  //  * @param value Update value without propagate change
  //  */
  // patchValue(value: T | null){
  //   this._value = value;
  // }

  static newDynamicForm(config: FormElementConfig) {
    const newForm = new FormElementConfig();
    Object.assign(newForm, config);
    return newForm;
  }
}
