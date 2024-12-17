import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  inject,
  input,
  viewChild
} from '@angular/core';
import { LabelWidgetConfiguration } from '@app/widgets/label-widget/models/label-widget-configuration';
import { WidgetBaseComponent } from '@dashboards/components/widget-base/widget-base-component';
import { ChartWidgetConfiguration } from '../models/chart-widget-configuration';
import { WidgetBoxComponent } from '../../../dashboards/components/widget-box/widget-box.component';

import { FormsModule } from '@angular/forms';
import { GenericChartComponent } from '@dashboards/features/charts/components/generic-chart/generic-chart.component';
import { TextFontComponent } from '@app/shared/features/text/text-font/text-font.component';
import { ThermostatWidgetConfiguration } from '@app/widgets/thermostat-widget/models/thermostat-widget-configuration';

@Component({
  selector: 'jee-chart-widget',
  templateUrl: './chart-widget.component.html',
  standalone: true,
  styleUrl: './chart-widget.component.scss',
  imports: [FormsModule, WidgetBoxComponent, TextFontComponent, GenericChartComponent],
})
export class ChartWidgetComponent extends WidgetBaseComponent implements AfterViewInit {
  changeRef = inject(ChangeDetectorRef);

  override settings = input<ChartWidgetConfiguration>( new ChartWidgetConfiguration());

  readonly divChart = viewChild.required<ElementRef>('chart');

  chartHeight: string | number = 0;

  ngAfterViewInit(): void {
    setTimeout(() => {
      const divChart = this.divChart();
      if (divChart) {
        this.chartHeight = divChart.nativeElement.clientHeight;
        this.changeRef.detectChanges();
      }
    });
  }
}
