import { Injectable, inject } from '@angular/core';
import { ProvidersService } from '@app/core/providers/services/providers.service';
import { ModalService } from '@app/shared/features/modals/services/modal.service';
import { ValueComparaisonService } from '@app/shared/services/value-comparison.service';
import { ChartPeriod, ChartSettings } from '@dashboards/features/charts/models/chart-settings.model';
import { AlternativeItem } from '@dashboards/models/alternative-settings.model';
import { CommandValue } from '@dashboards/models/command-value.model';
import { Observable, Subject, forkJoin, map, tap } from 'rxjs';
import { ChartModalComponent } from '../modals/chart-modal/chart-modal.component';
import { HistoryValue } from '../models/history-value.model';
import { SeriesItem } from '../models/series-item.model';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  modalService = inject(ModalService);
  providerService = inject(ProvidersService);
  valueComparisonService = inject(ValueComparaisonService);

  openModalChart(chartSettings: ChartSettings) {
    this.modalService
      .open(
        ChartModalComponent,
        {
          settings: chartSettings,
        },
        {
          disableClose: false,
          width: '50vw',
          maxWidth: '90vw',
          minWidth: '300px',
          height: 'auto',
        },
      )
      .afterClosed()
      .subscribe();
  }

  getChartList(settings: ChartSettings): Observable<HistoryValue[][]> {
    const resultSub = new Subject<any>();
    const start = ChartPeriod.toDate(settings.period);
    const allSub: Observable<HistoryValue[]>[] = [];
    const resultValues: HistoryValue[][] = [];

    settings.series?.forEach((si) => {
      if (si.command) {
        const getH = this.providerService.getHistory(si.command, start).pipe(
          tap((hvs) => {
            resultValues.push(hvs);

            this._evalValues(hvs, si, settings.alternatives?.alternatives);
          }),
        );
        allSub.push(getH);
      }
    });

    forkJoin(allSub).subscribe(() => {
      resultSub.next(resultValues);
    });

    return resultSub.asObservable();
  }

  getChartBar(settings: ChartSettings): Observable<HistoryValue[]> {
    const resultSub = new Subject<any>();
    const allSub: Observable<CommandValue>[] = [];
    const resultValues: HistoryValue[] = [];
    settings.series?.forEach((si) => {
      if (si.command) {
        const getV = this.providerService.getValue(si.command).pipe(
          tap((cv) => {
            if (cv) {
              const hv = new HistoryValue();
              hv.value = cv.value;

              this._evalValue(hv, si, settings.alternatives?.alternatives);

              resultValues.push(hv);
            }
          }),
        );

        allSub.push(getV);
      }
    });

    return forkJoin(allSub).pipe(
      map(() => {
        return resultValues;
      }),
    );
  }

  private _evalValue(hv: HistoryValue, serieItem: SeriesItem, alternatives: AlternativeItem[]) {
    hv.color = serieItem.color;
    hv.name = serieItem.name;

    alternatives ||= [];
    alternatives.forEach((alt) => {
      const evalValue = this.valueComparisonService.compare(hv.value, alt.expression);
      if (evalValue && alt.displayValue != null) {
        hv.displayValue = alt.displayValue;
        return;
      }
    });

    if (hv.displayValue == null || hv.displayValue == undefined) {
      hv.displayValue = hv.value;
      let valueF = parseFloat(hv.value);
      if (!Number.isNaN(valueF)) {
        valueF = Math.round((valueF + Number.EPSILON) * 100) / 100;
        hv.displayValue = valueF.toString();
      }
    }
  }

  private _evalValues(hvs: HistoryValue[], serieItem: SeriesItem, alternatives: AlternativeItem[]) {
    hvs.forEach((hv) => {
      this._evalValue(hv, serieItem, alternatives);
    });
  }
}
