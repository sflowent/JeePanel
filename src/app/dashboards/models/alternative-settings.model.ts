import { IconSettings } from '@app/shared/features/icons/models/icon-settings.model';
import { BackgroundSettings } from './widget-settings.model';
import { BlobOptions } from 'buffer';

export class AlternativeSettings {
  alternatives: AlternativeItem[] = [];
}

export class AlternativeItem {
  bgColor?: string;
  labelColor?: string;
  valueColor?: string;

  icon?: IconSettings;
  hightlightIcon?: boolean;
  bgIcon?: IconSettings;

  expression: string;
  displayValue?: string;

}
