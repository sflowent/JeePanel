import { DefaultValues } from '@app/shared/default-values';
import { TextFont } from '@app/shared/features/text/models/text-font.model';
import { ChartSettings } from '@dashboards/features/charts/models/chart-settings.model';
import { AlternativeSettings } from '@dashboards/models/alternative-settings.model';
import { Command } from '@dashboards/models/command.model';
import { WidgetBaseSettings } from '@dashboards/models/widget-settings.model';

export class LabelWidgetConfiguration extends WidgetBaseSettings {
  position: any;

  // -- Label Icon Value settings
  labelFont: TextFont = DefaultValues.LabelFont();
  hideLabel = false;
  valueFont: TextFont = DefaultValues.ValueFont();
  hideValue = false;
  alignHorizontal: boolean = false;
  iconLeft: boolean = false;

  marquee: boolean = false;

  alternatives: AlternativeSettings = new AlternativeSettings();
  alternativesMarquee: AlternativeSettings = new AlternativeSettings();

  valueCommand: Command | null = null;

  showHistory: boolean = false;
  history: ChartSettings = new ChartSettings();

  constructor(init?: Partial<LabelWidgetConfiguration>) {
    super();
    Object.assign(this, init);

    LabelWidgetConfiguration.ensureSettings(this);
  }

  public static ensureSettings(settings: LabelWidgetConfiguration) {
    settings.valueFont ??= DefaultValues.ValueFont();
    settings.labelFont ??= DefaultValues.LabelFont();

    WidgetBaseSettings.ensureWidgetBaseSettings(settings);
  }
}
