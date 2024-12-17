import { Component, DestroyRef, computed, inject, input, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChartSettings, ChartTypes } from '@dashboards/features/charts/models/chart-settings.model';
import { CommandValue } from '@dashboards/models/command-value.model';
import { DashboardManagerService } from '@dashboards/services/dashboard-manager.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexPlotOptions,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { HistoryValue } from '../../models/history-value.model';
import { ChartService } from '../../services/chart.service';
import { ListValueChartComponent } from '../list-values-chart/list-values-chart.component';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels?: ApexDataLabels;
  grid: ApexGrid;
  plotOptions: ApexPlotOptions;
  stroke: ApexStroke;
  tooltip?: ApexTooltip;
  colors: any[];
  theme: ApexTheme
};

@Component({
  selector: 'jee-generic-chart',
  templateUrl: './generic-chart.component.html',
  styleUrl: './generic-chart.component.scss',
  standalone: true,
  imports: [NgApexchartsModule, ListValueChartComponent],
})
export class GenericChartComponent {
  private chartService = inject(ChartService);
  private dashboardManager = inject(DashboardManagerService);
  private destroyRef = inject(DestroyRef);

  settings = input.required<ChartSettings>();

  readonly chart = viewChild.required<ChartComponent>('chart');

  ChartTypes = ChartTypes;

  chartOptions!: ChartOptions;
  isList = computed(() => {
    const isList = this.settings().type === ChartTypes.list.type;
    if (!isList){
      this._initChart();
    }

    return isList;
  });

  constructor(){
  }


  _initChart() {
    this._initChartOptions();

    if (this.settings().type === ChartTypes.line.type) {
      this.chartOptions.xaxis.type = 'datetime';
      this.chartOptions.tooltip = {
        x: {
          format: 'dd/MM/yyyy HH:mm:ss',
        },
      };

      this.chartService.getChartList(this.settings()).subscribe((values: HistoryValue[][]) => {
        const series: any[] = [];
        values.forEach((hvs) => {
          if (hvs.length) {
            const first = hvs[0];
            series.push({
              name: first.name ?? 'data',
              color: first.color,
              data: hvs.map((hv) => [hv.date.getTime(), hv.numberValue()]),
            });
          }
        });

        const chart = this.chart();
        if (chart) {
          chart.updateSeries(series);
        }
      });
    }

    if (this.settings().type === ChartTypes.bar.type) {
      this._initBarChart();
    }
  }

  _initBarChart() {
    this.chartOptions.plotOptions = {
      bar: {
        columnWidth: '45%',
        distributed: true,
        dataLabels: {
          position: 'top',
        },
      },
    };

    this.chartOptions.dataLabels = {
      enabled: true,
      offsetY: -20,
    };
    this.chartOptions.dataLabels.formatter = function (val) {
      return val + '';
    };

    const series: any[] = [];
    this.settings().series?.forEach((item, index) => {
      if (item.command) {
        this.chartOptions.xaxis.categories.push(item.name);
        this.chartOptions.colors.push(item.color);
        this.dashboardManager
          .onCommandUpdate(item.command)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((value: CommandValue) => {
            series[index] = value.value;

            this._updateSeries([
              {
                name: 'data',
                data: series,
              },
            ]);
          });
      }
    });
  }

  private _updateSeries(newSeries: any) {
    setTimeout(() => {
      const chart = this.chart();
      if (chart) {
        chart.updateSeries(newSeries);
      }
    });
  }

  _initChartOptions() {
    const type: any = this.settings().type;
    this.chartOptions = {
      series: [],
      chart: {
        type: type,
        height:  '100%',
        background: 'transparent',
        zoom: {
          enabled: false,
        },
      },
      stroke: {
        curve: 'straight',
      },
      colors: [],
      grid: {},
      plotOptions: {},
      xaxis: {
        categories: [],
      },
      theme:{
        mode: "dark"
      }
    };
  }
}
