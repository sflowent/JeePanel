import { DefaultValues } from '@app/shared/default-values';
import { TextFont } from '@app/shared/features/text/models/text-font.model';
import { Command } from '@dashboards/models/command.model';
import { WidgetBaseSettings } from '@dashboards/models/widget-settings.model';

export class SliderWidgetConfiguration extends WidgetBaseSettings {
  labelFont: TextFont;
  hideLabel = false;

  valueCommand: Command;
  actionCommand: Command;

  min: 0;
  max: 0;
  bigSlider: false;
  vertical: false;

  step: 1;
  showTicks: true;
  showTicksLabel: false;

  unit: '';

  constructor(init?: Partial<SliderWidgetConfiguration>) {
    super();
    Object.assign(this, init);
    SliderWidgetConfiguration.ensureSettings(this);
  }

  static ensureSettings(settings: SliderWidgetConfiguration) {
    WidgetBaseSettings.ensureWidgetBaseSettings(settings);
    settings.labelFont ??= DefaultValues.LabelFont();
  }
}
