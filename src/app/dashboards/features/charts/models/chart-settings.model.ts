import { Command } from '@dashboards/models/command.model';
import { AlternativeSettings } from '../../../models/alternative-settings.model';
import { CommandListItem } from '@dashboards/models/command-list-item.model';
import { SeriesItem } from './series-item.model';
import { TextFont } from '@app/shared/features/text/models/text-font.model';
import { DefaultValues } from '@app/shared/default-values';

export enum ChartType {
  list = 'list',
  line = 'line',
  bar = 'bar'
}
export class ChartPeriod {
  code: string;
  label: string;
  valueH?: number = 0;
  valueD?: number = 0;
  valueM?: number = 0;
  valueY?: number = 0;

  constructor(init?: Partial<ChartPeriod>) {
    Object.assign(this, init);
  }

  static toDate(period: string) {
   return ChartPeriods[period]?.toDate() ?? new Date();
  }

  toDate(): Date {
    const result = new Date();

    result.setHours(result.getHours() - (this.valueH ?? 0));
    result.setDate(result.getDate() - (this.valueD ?? 0));
    result.setMonth(result.getMonth() - (this.valueM ?? 0));
    result.setFullYear(result.getFullYear() - (this.valueY ?? 0));

    return result;
  }
}

export class ChartPeriods {
  static 'h' = new ChartPeriod({ code: 'h', label: 'La dernière heure', valueH: 1 });
  static '8h' = new ChartPeriod({ code: '8h', label: 'les 8 dernières heures', valueH: 8 });
  static '12h' = new ChartPeriod({ code: '12h', label: 'les 12 dernières heures', valueH: 12 });
  static 'D' = new ChartPeriod({ code: 'D', label: 'les 24 dernières heures', valueH: 24 });
  static '2D' = new ChartPeriod({ code: '2D', label: 'les 48 dernières heures', valueH: 48 });
  static '3D' = new ChartPeriod({ code: '3D', label: 'les 72 dernières heures', valueH: 72 });
  static 'W' = new ChartPeriod({ code: 'W', label: 'Les 7 derniers jours', valueD: 7 });
  static '2W' = new ChartPeriod({ code: '2W', label: 'Les 2 dernières semaines', valueD: 14 });
  static 'M' = new ChartPeriod({ code: 'M', label: 'Le dernier mois', valueM: 1 });
  static '2M' = new ChartPeriod({ code: '2M', label: 'Les 2 derniers Mois', valueM: 2 });
  static 'Y' = new ChartPeriod({ code: 'Y', label: 'Dernière année', valueY: 1 });

  static ALL: ChartPeriod[] = Object.values(ChartPeriods);
}

export class ChartTypes {
  static list = { type: ChartType.list, label: 'Liste' };
  static line = { type: ChartType.line, label: 'Ligne' };
  static bar = { type: ChartType.bar, label: 'Bar' };

  static ALL = Object.values(ChartTypes);
}

export class ChartSettings {
  hideFilters: boolean = false;
  title: string;
  titleFont: TextFont = DefaultValues.LabelFont();

  type: ChartType;
  autoRefresh?: boolean = false;
  alternatives: AlternativeSettings;

  period: string = ChartPeriods.W.code;
  series: SeriesItem[] | null = null;
}
