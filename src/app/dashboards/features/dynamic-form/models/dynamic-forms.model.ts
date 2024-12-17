import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { listToDict } from '@app/shared/functions/listToDict';
import { WidgetBaseSettings } from '@dashboards/models/widget-settings.model';
import { DynamicForm, FormElementConfig, IVisible } from './dynamic-form.model';

export class DynamicForms {
  widgetSettings: WidgetBaseSettings;

  elementsMap: { [key: string]: FormElementConfig } = {};
  allElements: FormElementConfig[];
  dynamicForms: DynamicForm[];

  formGroup: FormGroup;
  get formControlsMap(): Record<string, FormControl> {
    return this.getFormControlsMap(this.formGroup);
  }

  metadata?: any;

  constructor(dynamicForms: DynamicForm[], metadata: any, formGroup: FormGroup) {
    this.dynamicForms = dynamicForms;

    this.allElements = this.dynamicForms.flatMap((x) => x.rows);
    this.elementsMap = listToDict(this.allElements, (e) => e.name);
    this.metadata = metadata;
    this.formGroup = formGroup;
  }

  isVisible(elt: IVisible) {
    const elementsDict = this.elementsMap || {};

    if (elt.hide) {
      let resultHide = false;
      const element = elementsDict[elt.hide.name];
      if (element) {
        elt.hide.equals.forEach((eq: string) => {
          if (element.value == eq) {
            resultHide = true;
            return;
          }
        });
      }
      if (resultHide) return false;
    }

    if (elt.show) {
      let resultShow = false;
      const element = elementsDict[elt.show.name];
      if (element) {
        elt.show.equals.forEach((eq: string) => {
          if (element.value == eq) {
            resultShow = true;
            return;
          }
        });
      }
      return resultShow;
    }

    return true;
  }

  private getFormControlsMap(form: AbstractControl, path: string = ''): Record<string, FormControl> {
    const controlsMap: Record<string, FormControl> = {};

    if (form instanceof FormControl) {
      controlsMap[path] = form;
    } else if (form instanceof FormGroup) {
      Object.entries(form.controls).forEach(([key, control]) => {
        const controlPath = path ? `${path}.${key}` : key;
        Object.assign(controlsMap, this.getFormControlsMap(control, controlPath));
      });
    } else if (form instanceof FormArray) {
      form.controls.forEach((control, index) => {
        const controlPath = `${path}[${index}]`;
        Object.assign(controlsMap, this.getFormControlsMap(control, controlPath));
      });
    }

    return controlsMap;
  }
}
