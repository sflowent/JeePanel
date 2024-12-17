import { TextFont } from '@app/shared/features/text/models/text-font.model';
import { Command } from '@dashboards/models/command.model';
import { IconSettings } from '@app/shared/features/icons/models/icon-settings.model';
import { BackgroundSettings, WidgetBaseSettings } from '@dashboards/models/widget-settings.model';
import { DefaultValues } from '@app/shared/default-values';

export enum ButtonActionType {
  Command = 'command',
  Toggle = 'toggle',
  Navigate = 'navigate'
}

export enum LinkType {
  Dashboard = 'dashboard',
  Link = 'link',
  Api = 'api'
}

export class ActionButtonSettings {
  command: Command | null = null;
  bgColor: string | null = null;
  labelColor: string | null = null;
  valueColor: string | null = null;
}

export class ButtonWidgetConfiguration extends WidgetBaseSettings {
  // -- Label Icon Value
  labelFont: TextFont = DefaultValues.LabelFont();
  hideLabel = false;
  valueFont: TextFont = DefaultValues.ValueFont();
  hideValue = false;

  alignHorizontal: boolean = false;
  iconLeft: boolean = false;

  actionType: ButtonActionType = ButtonActionType.Command;

  valueCommand: Command | null = null;

  action: ActionButtonSettings | null = null;

  // -- TOGGLE
  activeValue: string | null = null;
  actionAlt: ActionButtonSettings | null = null;
  showButtons = false;

  // -- NAVIGATE
  linkType: LinkType = LinkType.Dashboard;

  targetDashboardCode?: string ;
  dashboardName: boolean = true;
  href: string = '';
  newTab: boolean = false;

  constructor(init?: Partial<ButtonWidgetConfiguration>) {
    super();
    Object.assign(this, init);

    ButtonWidgetConfiguration.ensureSettings(this);
  }

  public static ensureSettings(settings: ButtonWidgetConfiguration) {
    // WidgetBaseSettings.ensureWidgetBaseSettings(settings);
    // settings.labelFont ??= DefaultValues.LabelFont();
    // settings.actionCommand = ActionButtonSettings.default(settings.actionCommand, new ActionButtonSettings());
    // settings.actionCommandAlt = ActionButtonSettings.default(settings.actionCommandAlt, null);
    // settings.commandType = settings.commandType || ButtonActionType.Command;
  }
}
