import { IconSettings } from "@app/shared/features/icons/models/icon-settings.model";
import { Command } from "./command.model";

export class CommandListItem {
  command: Command | null = null;

  bgColor: string | null = null;
  labelColor: string | null = null;
  valueColor: string | null = null;
  
  icon?: IconSettings;

  value: string = '';
  selected = false;

  constructor(init?: Partial<CommandListItem>) {
    Object.assign(this, init);
  }
}
