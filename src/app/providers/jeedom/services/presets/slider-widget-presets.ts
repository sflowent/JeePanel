import { FormElementConfig } from '@dashboards/features/dynamic-form/models/dynamic-form.model';
import { JeedomCmd_http } from '../../models/http-command';
import { JeedomService } from '../jeedom.service';
import { DynamicForms } from '@dashboards/features/dynamic-form/models/dynamic-forms.model';
import { ModalService } from '@app/shared/features/modals/services/modal.service';
import { IconSettings } from '@app/shared/features/icons/models/icon-settings.model';
import { TextFont, TextFontFormElement } from '@app/shared/features/text/models/text-font.model';
import { DefaultValues } from '@app/shared/default-values';

export class SliderLabelWidget {
  protected currentForms: DynamicForms;
  protected modalService: ModalService;

  protected TypeIcon: Record<string, IconSettings> = {
    LIGHT: {
      icon: 'bulb',
      iconType: 'icon',
      iconset: 'smarthome-set',
    }
  };

  constructor(currentForms: DynamicForms, modalService: ModalService) {
    this.currentForms = currentForms;
    this.modalService = modalService;
  }

  public preset(jeedomService: JeedomService, element: FormElementConfig, command: JeedomCmd_http) {
    if (!this.currentForms) {
      return;
    }

    if (element.name !== 'valueCommand') {
      return;
    }

    let type: string = command?.generic_type ?? '';

    // Set plug or light if "toggle"
    if (type.indexOf('_ON') > -1) {
      const match = type.match(/^(.*)_ON/);
      type = match ? match[1] : '';
    }

    if (type === 'LIGHT') {
      this.currentForms.elementsMap['hideValue']?.formControl?.patchValue('true');
      // -- TODO add alternative
    }

    const bgIcon = this.currentForms.elementsMap['background.backdropIcon'];
    if (this.TypeIcon[type] && !bgIcon.value) {
      bgIcon.formControl?.patchValue(this.TypeIcon[type]);
    }

    const titleValue = this.currentForms.elementsMap['label'];
    if (titleValue && !titleValue.value) {
      titleValue.formControl?.patchValue(command.equipment.name);
    }

    let valueFont = this.currentForms.elementsMap['valueFont'] as TextFontFormElement;
    if (!valueFont) {
      valueFont = new TextFontFormElement();
    }
    
    if (!valueFont.value) {
      valueFont.value = DefaultValues.ValueFont();
    }

    if (!valueFont.value.unit) {
      valueFont.value.unit = command.unite;
      valueFont.formControl?.patchValue(valueFont.value);
    }
  }

  private setButtonLabel(command: JeedomCmd_http, value?: string) {
    const activeBtnValue = this.currentForms.elementsMap['activeValue'];
    const activeBtnLabel = this.currentForms.elementsMap['action.buttonLabel'];

    if (activeBtnValue && !activeBtnValue.value) {
      activeBtnValue.formControl?.patchValue(value ?? command.name);
    }

    if (activeBtnLabel && !activeBtnLabel.value) {
      activeBtnLabel.formControl?.patchValue(command.name);
    }
  }

  private setButtonAltLabel(command: JeedomCmd_http) {
    const inactiveBtnLabel = this.currentForms.elementsMap['actionAlt.buttonLabel'];

    if (inactiveBtnLabel && !inactiveBtnLabel.value) {
      inactiveBtnLabel.formControl?.patchValue(command.name);
    }
  }
}
