import { DefaultValues } from '@app/shared/default-values';
import { CommandListItem } from '@dashboards/models/command-list-item.model';
import { Command } from '@dashboards/models/command.model';
import { WidgetBaseSettings } from '@dashboards/models/widget-settings.model';

export class ThermostatWidgetConfiguration extends WidgetBaseSettings {
  
  labelFont = DefaultValues.LabelFont();

  heatingValue: string = "";
  stateValueCommand: Command;
  temperatureValueCommand: Command;
  setPointTemperatureValueCommand: Command;
  setPointTemperatureCommand: Command;
  modeValueCommand: Command;
  modeCommands: CommandListItem[] = [];

  constructor(init?: Partial<ThermostatWidgetConfiguration>) {
    super();
    Object.assign(this, init);
  }

  public static ensureSettings(settings: ThermostatWidgetConfiguration) {
  }
}
