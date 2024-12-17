import { FormElementConfig } from "@dashboards/features/dynamic-form/models/dynamic-form.model";
import { CommandValue } from "@dashboards/models/command-value.model";

export class IconSettings {
  iconset?: string;
  icon?: string;

  iconType: 'icon' | 'staticUrl' = 'icon';

  colorize? = true;
  center? = false;
  inline? = false;
  size?: number;

  color?: string;

  staticUrl?: string;
  refreshInterval?: any;

  constructor(init?: Partial<IconSettings>){
    Object.assign(this, init);
  }
}

export class IconFormElement extends FormElementConfig {
  override ui: { hideSize?: boolean; min: number; max?: number, nullable:boolean } = { min: 1, nullable: true };
}
