import { IconSettings } from '@app/shared/features/icons/models/icon-settings.model';
import { GridsterItem } from 'angular-gridster2';

export class WidgetBaseSettings  implements GridsterItem {
  id: number;
  x: number;
  y: number;
  rows: number;
  cols: number;
  dashboardId: number;


  groupId: string | null = null;

  background: BackgroundSettings = new BackgroundSettings();

  widgetType: string;

  label: string;
  image?: string;
  icon?: IconSettings;
  highlightIcon: boolean= false;;

  [propName: string]: any;

  constructor(init?: Partial<WidgetBaseSettings>) {
    Object.assign(this, init);
    WidgetBaseSettings.ensureWidgetBaseSettings(this);
  }

  public static ensureWidgetBaseSettings(settings: WidgetBaseSettings) {
    settings.background ??= new BackgroundSettings();
  }
}

export class BackgroundSettings {
  bgColor?: string;
  image?: string;
  backdropIcon?: IconSettings;
}
