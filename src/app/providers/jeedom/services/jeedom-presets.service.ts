import { Injectable, inject } from '@angular/core';
import { CommandFormElementConfig } from '@app/core/providers/models/command-form-element';
import { ConfirmDialogComponent } from '@app/shared/features/modals/components/confirm-dialog/confirm-dialog.component';
import { ModalService } from '@app/shared/features/modals/services/modal.service';
import { CommandListFormElement } from '@dashboards/features/dynamic-form/components/elements/command-list-picker/models/command-list-form-element.model';
import { DynamicForms } from '@dashboards/features/dynamic-form/models/dynamic-forms.model';
import { DynamicFormService } from '@dashboards/features/dynamic-form/services/dynamic-form.service';
import { CommandListItem } from '@dashboards/models/command-list-item.model';
import { JeedomCmd_http } from '../models/http-command';
import { JeedomService } from './jeedom.service';
import { FormElementConfig } from '@dashboards/features/dynamic-form/models/dynamic-form.model';
import { FormControl, FormGroup } from '@angular/forms';
import { PresetButtonWidget } from './presets/button-widget-presets';
import { PresetLabelWidget } from './presets/label-widget-presets';

@Injectable({
  providedIn: 'root',
})
export class JeedomPresetsService {
  dynamicFormService = inject(DynamicFormService);

  modalService = inject(ModalService);
  currentForms: DynamicForms | null = null;

  presetButtonWidget: PresetButtonWidget;
  presetLabelWidget: PresetLabelWidget;

  constructor() {}

  presetForm(jeedomService: JeedomService, element: FormElementConfig, command: JeedomCmd_http): void {
    const currentForms = this.dynamicFormService.dynamicForms;
    if (!command || !currentForms || !currentForms.metadata) {
      return;
    }

    this.currentForms = currentForms;

    switch (this.currentForms.metadata.widgetType) {
      case 'SelectionWidgetComponent':
        this._presetSelectionWidgetComponent(jeedomService, element as CommandListFormElement, command);
        break;
      case 'ButtonWidgetComponent':
        if (!this.presetButtonWidget) {
          this.presetButtonWidget = new PresetButtonWidget(currentForms, this.modalService);
        }
        this.presetButtonWidget.preset(jeedomService, element, command);
        break;
        case 'LabelWidgetComponent':
          if (!this.presetLabelWidget) {
            this.presetLabelWidget = new PresetLabelWidget(currentForms, this.modalService);
          }
          this.presetLabelWidget.preset(jeedomService, element, command);
          break;
      case 'ThermostatWidgetComponent':
        this._presetThermostatWidgetComponent(jeedomService, element, command);
        break;
    }
  }

  private _presetThermostatWidgetComponent(jeedomService: JeedomService, element: FormElementConfig, command: JeedomCmd_http) {
    if (!this.currentForms) {
      return;
    }

    // -- if the setpoint is selected, search for heating modes
    if (command.equipment.eqType_name === 'thermostat') {
      // -- set heating modes commands
      const jeedomModeCommands = command.equipment.cmds.filter((cmd) => cmd.generic_type === 'THERMOSTAT_SET_MODE');
      const heatingModeCommands = this.currentForms!.elementsMap!['modeCommands'];
      if (!heatingModeCommands.value?.length) {
        const modes: CommandListItem[] = [];
        jeedomModeCommands.forEach((cmd) => {
          modes.push(
            new CommandListItem({
              command: cmd.toCommand(jeedomService.settings.code),
              value: cmd.name,
            }),
          );
        });

        heatingModeCommands.formControl?.patchValue(modes);
      }

      // -- set title
      const labelValueCommand = this.currentForms!.elementsMap!['label'];
      if (labelValueCommand && !labelValueCommand?.value) {
        labelValueCommand.formControl?.patchValue(command.equipment.name);
      }

      // -- set actual mode command
      const jeedomModeValueCommand = command.equipment.cmds.find((cmd) => cmd.generic_type === 'THERMOSTAT_MODE');
      const modeValueCommand = this.currentForms!.elementsMap!['modeValueCommand'];
      if (jeedomModeValueCommand && !modeValueCommand?.value) {
        modeValueCommand.formControl?.patchValue(jeedomModeValueCommand.toCommand(jeedomService.settings.code));
      }

      // -- set setpoint temperature command
      const jeedomSetPointValueCommand = command.equipment.cmds.find((cmd) => cmd.generic_type === 'THERMOSTAT_SETPOINT');
      const setPointTemperatureValueCommand = this.currentForms!.elementsMap!['setPointTemperatureValueCommand'];
      if (jeedomSetPointValueCommand && !setPointTemperatureValueCommand?.value) {
        setPointTemperatureValueCommand.formControl?.patchValue(jeedomSetPointValueCommand.toCommand(jeedomService.settings.code));
      }

      // -- set setpoint command
      const jeedomSetPointCommand = command.equipment.cmds.find((cmd) => cmd.generic_type === 'THERMOSTAT_SET_SETPOINT');
      const setPointCommand = this.currentForms!.elementsMap!['setPointTemperatureCommand'];
      if (jeedomSetPointCommand && !setPointCommand?.value) {
        setPointCommand.formControl?.patchValue(jeedomSetPointCommand.toCommand(jeedomService.settings.code));
      }

      // -- set heating status
      const jeedomStateValueCommand = command.equipment.cmds.find((cmd) => cmd.generic_type === 'THERMOSTAT_STATE_NAME');
      const stateValueCommand = this.currentForms!.elementsMap!['stateValueCommand'];
      if (jeedomStateValueCommand && !stateValueCommand?.value) {
        stateValueCommand.formControl?.patchValue(jeedomStateValueCommand.toCommand(jeedomService.settings.code));

        const heatingValue = this.currentForms!.elementsMap!['heatingValue'];
        if (!heatingValue?.value) {
          heatingValue.formControl?.patchValue('Chauffage');
        }
      }
    }

    // -- if new mode: automatic value setting
    if (element.name.indexOf('modeCommands-') === 0) {
      const formGroup = element.formControl as FormGroup;
      if (formGroup && !formGroup.value.value) {
        formGroup.controls['value'].patchValue(command.name);
      }
    }
  }

  private _presetSelectionWidgetComponent(jeedomService: JeedomService, element: CommandListFormElement, command: JeedomCmd_http): void {
    if (!this.currentForms) {
      return;
    }

    const commandsValue = this.currentForms?.elementsMap!['commands'];

    if (element.name !== 'valueCommand' || !commandsValue) {
      return;
    }

    // -- Jeedo Themostat
    if (command.equipment.eqType_name === 'thermostat') {
      const jeedomModeCommands = command.equipment.cmds.filter((cmd) => cmd.generic_type === 'THERMOSTAT_SET_MODE');
      if (!element.value?.length && jeedomModeCommands.length) {
        this.modalService
          .open<any, boolean>(ConfirmDialogComponent, {
            title: 'Initialisation',
            message: 'Voulez vous initialiser les modes disponibles à partir des modes du thermostat Jeedom ?',
          })
          .afterClosed()
          .subscribe((result: boolean) => {
            if (!result) {
              return;
            }
            const modes: CommandListItem[] = [];
            jeedomModeCommands.forEach((cmd) => {
              modes.push(
                new CommandListItem({
                  command: cmd.toCommand(jeedomService.settings.code),
                  value: cmd.name,
                }),
              );
            });

            commandsValue.formControl?.patchValue(modes);
          });
      }
    }

    // -- jeedom Mode
    if (command.generic_type === 'MODE_STATE' && element && !element.value?.length) {
      const allModes = jeedomService.commands.filter(
        (cmd) => cmd.eqLogic_id === command.eqLogic_id && cmd.generic_type === 'MODE_SET_STATE',
      );

      if (allModes.length) {
        this.modalService
          .open<any, boolean>(ConfirmDialogComponent, {
            title: 'Initialisation',
            message: 'Voulez vous initialiser les modes disponibles à partir des modes Jeedom ?',
          })
          .afterClosed()
          .subscribe((result: boolean) => {
            if (result) {
              const cmds: CommandListItem[] = [];
              allModes.forEach((cmd) => {
                cmds.push(
                  new CommandListItem({
                    command: cmd.toCommand(jeedomService.settings.code),
                    value: cmd.name,
                  }),
                );
              });

              commandsValue.formControl?.patchValue(cmds);
            }
          });
      }
    }
  }
}
