import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject, input, signal } from '@angular/core';
import { TextFontComponent } from '@app/shared/features/text/text-font/text-font.component';
import { WidgetBaseComponent } from '@dashboards/components/widget-base/widget-base-component';
import { WidgetBoxComponent } from '@dashboards/components/widget-box/widget-box.component';
import { CommandValue } from '@dashboards/models/command-value.model';
import { DashboardManagerService } from '@dashboards/services/dashboard-manager.service';
import { ClockWidgetConfiguration } from '../models/clock-widget-configuration';

@Component({
    selector: 'clock-widget',
    templateUrl: './clock-widget.component.html',
    styleUrls: ['./clock-widget.component.scss'],
    standalone: true,
    imports: [CommonModule, WidgetBoxComponent, TextFontComponent]
})
export class ClockWidgetComponent extends WidgetBaseComponent implements OnInit, OnDestroy {
  changeRef = inject(ChangeDetectorRef);
  
  override settings = input<ClockWidgetConfiguration>(new ClockWidgetConfiguration());

  interval: any;
  now: number;

  constructor(private dashboardManager: DashboardManagerService) {
    super();
    this.now = Date.now();
  }

  ngOnInit(): void {

    this.interval = setInterval(() => {
      this.now = Date.now();
    }, 900);
  }

  override ngOnDestroy() {
    if (this.interval) clearInterval(this.interval);

    super.ngOnDestroy();
  }
}
