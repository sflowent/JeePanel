import { TextFont } from '@app/shared/features/text/models/text-font.model';
import { Command } from '@dashboards/models/command.model';
import { WidgetBaseSettings } from '@dashboards/models/widget-settings.model';

export enum ImageSource {
  Static = 'static',
  Command = 'command'
}

export class ImageWidgetConfiguration extends WidgetBaseSettings {
  labelFont: TextFont;
  hideLabel = false;

  source: ImageSource = ImageSource.Static;
  valueCommand: Command;

  staticUrl: string;
  refreshInterval: number;

  constructor(init?: Partial<ImageWidgetConfiguration>) {
    super();
    Object.assign(this, init);

    ImageWidgetConfiguration.ensureSettings(this);
  }

  public static ensureSettings(settings: ImageWidgetConfiguration) {
    settings.labelFont = settings.labelFont || new TextFont();
    settings.labelFont.size = settings.labelFont.size || 12;
  }
}
