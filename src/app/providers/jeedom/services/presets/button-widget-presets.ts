import { FormElementConfig } from '@dashboards/features/dynamic-form/models/dynamic-form.model';
import { JeedomCmd_http } from '../../models/http-command';
import { JeedomService } from '../jeedom.service';
import { DynamicForms } from '@dashboards/features/dynamic-form/models/dynamic-forms.model';
import { ModalService } from '@app/shared/features/modals/services/modal.service';
import { IconSettings } from '@app/shared/features/icons/models/icon-settings.model';

export class PresetButtonWidget {
  protected currentForms: DynamicForms;
  protected modalService: ModalService;

  protected TypeIcon: Record<string, IconSettings> = {
    LIGHT: {
      icon: 'bulb',
      iconType: 'icon',
      iconset: 'smarthome-set',
    },
    ENERGY: {
      icon: 'plug',
      iconType: 'icon',
      iconset: 'smarthome-set',
    },
  };

  constructor(currentForms: DynamicForms, modalService: ModalService) {
    this.currentForms = currentForms;
    this.modalService = modalService;
  }

  public preset(jeedomService: JeedomService, element: FormElementConfig, command: JeedomCmd_http) {
    if (!this.currentForms) {
      return;
    }

    const actionType = this.currentForms.elementsMap['actionType'].value;

    // Set plug or light if "toggle"
    if (actionType === 'toggle' && element.name === 'action.command' && command.generic_type && command.generic_type?.indexOf('_ON') > -1) {
      const match = command.generic_type.match(/^(.*)_ON/);
      const type = match ? match[1] : null;
      if (!type) {
        return;
      }

      const titleValue = this.currentForms.elementsMap['label'];

      const actionAltCommand = this.currentForms.elementsMap['actionAlt.command'];
      const jeedomOffCommand = command.equipment?.cmds?.find((cmd) => cmd.generic_type === type + '_OFF');

      const valueCommand = this.currentForms.elementsMap['valueCommand'];
      const jeedomStateValueCommand = command.equipment?.cmds?.find((cmd) => cmd.generic_type === type + '_STATE');

      if (!element.value) {
        this.currentForms.elementsMap['hideValue']?.formControl?.patchValue('true');

        this.setButtonLabel(command, '1');
        this.currentForms.elementsMap['action.colorize']?.formControl?.patchValue('true');

        if (this.TypeIcon[type]) {
          this.currentForms.elementsMap['icon']?.formControl?.patchValue(this.TypeIcon[type]);
        }
      }

      if (titleValue && !titleValue.value) {
         titleValue.formControl?.patchValue(command.equipment.name);
      }

      if (jeedomOffCommand && !actionAltCommand.value) {
        actionAltCommand.formControl?.patchValue(jeedomOffCommand.toCommand(jeedomService.settings.code));
        this.setButtonAltLabel(jeedomOffCommand);
      }

      if (jeedomStateValueCommand && !valueCommand.value) {
        valueCommand.formControl?.patchValue(jeedomStateValueCommand.toCommand(jeedomService.settings.code));
      }

      return;
    }

    // other command
    if (element.name === 'action.command') {
      this.setButtonLabel(command);
      return;
    }

    if (element.name === 'actionAlt.command') {
      this.setButtonAltLabel(command);
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
