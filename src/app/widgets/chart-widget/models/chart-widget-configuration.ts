import { DefaultValues } from '@app/shared/default-values';
import { TextFont } from '@app/shared/features/text/models/text-font.model';
import { AlternativeItem, AlternativeSettings } from '@dashboards/models/alternative-settings.model';
import { ChartSettings } from '@dashboards/features/charts/models/chart-settings.model';
import { Command } from '@dashboards/models/command.model';
import { WidgetBaseSettings } from '@dashboards/models/widget-settings.model';

export class ChartWidgetConfiguration extends WidgetBaseSettings {
  position: any;

  // -- Label Icon Value settings
  labelFont: TextFont = DefaultValues.LabelFont();

  chartSettings: ChartSettings;

  constructor(init?: Partial<ChartWidgetConfiguration>) {
    super();
    Object.assign(this, init);

    ChartWidgetConfiguration.ensureSettings(this);
  }

  public static ensureSettings(settings: ChartWidgetConfiguration) {
    settings.labelFont ??= DefaultValues.LabelFont();

    WidgetBaseSettings.ensureWidgetBaseSettings(settings);
  }
}
