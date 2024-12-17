import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit, inject, input } from '@angular/core';

import { WidgetBaseComponent } from '@dashboards/components/widget-base/widget-base-component';
import { WidgetBoxComponent } from '@dashboards/components/widget-box/widget-box.component';
import { SliderWidgetConfiguration } from '../models/slider-widget-configuration';
import { JeeSliderComponent } from '@app/shared/components/jee-slider/jee-slider.component';
import { TextFontComponent } from '@app/shared/features/text/text-font/text-font.component';
import { DashboardManagerService } from '@dashboards/services/dashboard-manager.service';
import { takeUntil } from 'rxjs';
import { CommandValue } from '@dashboards/models/command-value.model';

@Component({
    selector: 'slider-widget',
    templateUrl: './slider-widget.component.html',
    styleUrls: ['./slider-widget.component.scss'],
    standalone: true,
    imports: [CommonModule, JeeSliderComponent, WidgetBoxComponent, TextFontComponent]
})
export class SliderWidgetComponent extends WidgetBaseComponent implements OnInit {
  override settings= input(new SliderWidgetConfiguration());

  dashboardManager = inject(DashboardManagerService);  
  changeRef = inject(ChangeDetectorRef);

  value: number = 0;

  constructor() {
    super();
  }

  ngOnInit(): void {
    SliderWidgetConfiguration.ensureSettings(this.settings());

    if (this.settings().valueCommand) {
      this.dashboardManager
        .onCommandUpdate(this.settings().valueCommand)
        .pipe(takeUntil(this.destroy))
        .subscribe((cv: CommandValue) => {
            this.value = cv.value;

            this.changeRef.detectChanges();

          // this.settings().valueFont.unit =
          //   this.settings().valueFont.unit ?? cv.unit;
        });
    }
  }

  onValueChange(newValue: number) {
    if (this.settings().actionCommand) {
      this.dashboardManager.sendCmd(this.settings().actionCommand, newValue);
    }
  }
}
