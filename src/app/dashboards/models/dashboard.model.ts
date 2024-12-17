import { DefaultValues } from '@app/shared/default-values';
import { TextFont } from '@app/shared/features/text/models/text-font.model';
import { WidgetBaseSettings } from './widget-settings.model';
import { clone } from '@app/shared/functions/clone';
import { Command } from './command.model';

export class Dashboard {
  id: number = 0;
  settings: DashboardSettings = new DashboardSettings();
  default? = false;

  widgets?: WidgetBaseSettings[] = [];
  link?: string;

  constructor(init?: Partial<Dashboard>) {
    Object.assign(this, init);
    Dashboard.ensureDashboardSettings(this);
  }

  /**
   * Retrieve all Dashboard's commands
   */
  getCommands(): Command[] {
    if (!this.widgets?.length) {
      return [];
    }

    const commands = this._getCommands(this.widgets);

    return commands;
  }

  private _getCommands(obj: any): Command[] {
    if (!obj) {
      return [];
    }

    let commands: Command[] = [];
    if (obj && typeof obj === 'object') {
      if ('providerCode' in obj) {
        commands.push(obj);

        return commands;
      }

      Object.values(obj).forEach((subobj) => {
        if (subobj && typeof subobj === 'object') {
          commands.push(...this._getCommands(subobj));
        }
      });
    } 

    return commands;
  }

  hasCode(dashboardCode: string): boolean {
    return this.settings?.code?.toLocaleLowerCase() == dashboardCode?.toLocaleLowerCase();
  }

  public static ensureDashboardSettings(dashboard: Dashboard) {
    dashboard.settings = new DashboardSettings(dashboard.settings);

    dashboard.widgets ||= [];
  }
}

export class DashboardSettings {
  title: string = '';
  code: string = '';
  titleFont?: TextFont = new TextFont();

  columns?: number;
  oneColumnOnMobile?: true;
  thumbnail?: DashboardThumbnailSettings = new DashboardThumbnailSettings();
  backgroungColor?: string;
  rowsHeight?: number;

  constructor(init?: Partial<DashboardSettings>) {
    Object.assign(this, init);

    DashboardSettings.ensureSettings(this);
  }

  public static ensureSettings(settings: DashboardSettings) {
    settings.titleFont = DefaultValues.LabelFont();
    settings.columns = settings.columns ?? 12;
    settings.rowsHeight = settings.rowsHeight ?? 50;
    settings.thumbnail = settings.thumbnail ?? new DashboardThumbnailSettings();
    settings.thumbnail.titleFont = settings.thumbnail.titleFont ?? new TextFont();
  }
}

export class DashboardThumbnailSettings {
  titleFont: TextFont = new TextFont();
  bgColor?: string;
  image?: string;
  backdropIcon?: any;
}
