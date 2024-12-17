import { DefaultValues } from '@app/shared/default-values';
import { TextFont } from '@app/shared/features/text/models/text-font.model';
import { WidgetBaseSettings } from '@dashboards/models/widget-settings.model';

export class ClockWidgetConfiguration extends WidgetBaseSettings {
  labelFont: TextFont;
  clockFont: TextFont;

  constructor(init?: Partial<ClockWidgetConfiguration>) {
    super();
    Object.assign(this, init);

    ClockWidgetConfiguration.ensureSettings(this);
  }

  public static ensureSettings(settings: ClockWidgetConfiguration) {
    settings.labelFont = settings.labelFont || DefaultValues.LabelFont();
    
    settings.labelFont = settings.labelFont || DefaultValues.ValueFont();
  }
}
