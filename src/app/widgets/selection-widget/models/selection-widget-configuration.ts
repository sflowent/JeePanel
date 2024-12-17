import { DefaultValues } from '@app/shared/default-values';
import { TextFont } from '@app/shared/features/text/models/text-font.model';
import { CommandListItem } from '@dashboards/models/command-list-item.model';
import { Command } from '@dashboards/models/command.model';
import { WidgetBaseSettings } from '@dashboards/models/widget-settings.model';

export class SelectionWidgetConfiguration extends WidgetBaseSettings {
  // -- Label Icon Value

  labelFont: TextFont;
  hideLabel = false;
  valueFont: TextFont;
  hideValue = false;
  alignHorizontal: boolean = false;
  iconLeft: boolean = false;

  keepOpen = false;
  columns = 1;

  valueCommand: Command;

  commands: CommandListItem[] = [];

  constructor(init?: Partial<SelectionWidgetConfiguration>) {
    super();
    Object.assign(this, init);

    SelectionWidgetConfiguration.ensureSettings(this);
  }

  public static ensureSettings(settings: SelectionWidgetConfiguration) {
    WidgetBaseSettings.ensureWidgetBaseSettings(settings);
    settings.valueFont ??= DefaultValues.ValueFont();
    settings.labelFont ??= DefaultValues.ValueFont();

    // if (settings.commands) {
    //     settings.commands.forEach((cmd: CommandListItem) => {

    //         if (cmd.valueFont){
    //             cmd.valueFont.unit = settings.valueFont.unit;
    //             cmd.valueFont.size =  cmd.valueFont.size || settings.valueFont.size;
    //         }
    //     })
    // }
  }
}
