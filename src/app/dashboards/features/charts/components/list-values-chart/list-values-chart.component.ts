import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, effect, inject, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProvidersService } from '@app/core/providers/services/providers.service';
import { ValueComparaisonService } from '@app/shared/services/value-comparison.service';
import { ChartSettings } from '@dashboards/features/charts/models/chart-settings.model';
import { HistoryValue } from '../../models/history-value.model';
import { ChartService } from '../../services/chart.service';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'jee-list-value-chart',
  standalone: true,
  imports: [DatePipe, MatCheckboxModule, MatLabel, MatFormField, FormsModule, MatSelectModule],
  templateUrl: './list-values-chart.component.html',
  styleUrl: './list-values-chart.component.scss',
})
export class ListValueChartComponent{
  providerService = inject(ProvidersService);
  valueComparisonService = inject(ValueComparaisonService);
  charService = inject(ChartService);

  settings = input.required<ChartSettings>();

  showOriginalValues = model<boolean>(false);
  hasAlternatives = computed(() => {
    return this.settings()?.alternatives?.alternatives?.length > 0;
  });

  allValues = signal<HistoryValue[]>([]);

  values = computed(() => {
    let values = this.allValues();

    if (this.filtersSelected().length){
      values = values.filter((v) => this.filtersSelected()?.some((f) => f.displayValue === v.displayValue));
    }

    if (this.seriesSelected().length){
      values = values.filter((v) => this.seriesSelected()?.some((f) => f.name === v.name));
    }

    return values;
  });

  multiple = computed(() => {
    return (this.settings()?.series?.length ?? 0) > 1;
  });

  filtersSelected = model<any[]>([]);
  seriesSelected = model<any[]>([]);
  availableValuesFilter = computed(() => {
    const uniqueValues = Array.from(
      new Map(
        this.allValues().map((item) => [
          `${item.value}|#|${item.displayValue}`,
          {
            value: item.value,
            displayValue: item.displayValue,
          },
        ]),
      ).values(),
    );

    return uniqueValues;
  });

  constructor() {
    effect(() => {
      this.charService.getChartList(this.settings()).subscribe((values: HistoryValue[][]) => {
        const flatValues = values.flatMap((hvs) => hvs).sort((a, b) => b.date.getTime() - a.date.getTime());
        this.allValues.set(flatValues);
      });
    });
  }
}
