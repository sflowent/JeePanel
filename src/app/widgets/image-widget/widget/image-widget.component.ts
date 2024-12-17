
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { TextFontComponent } from '@app/shared/features/text/text-font/text-font.component';
import { WidgetBaseComponent } from '@dashboards/components/widget-base/widget-base-component';
import { WidgetBoxComponent } from '@dashboards/components/widget-box/widget-box.component';
import { CommandValue } from '@dashboards/models/command-value.model';
import { DashboardManagerService } from '@dashboards/services/dashboard-manager.service';
import { takeUntil } from 'rxjs';
import { ImageSource, ImageWidgetConfiguration } from '../models/image-widget-configuration';

@Component({
    selector: 'image-widget',
    templateUrl: './image-widget.component.html',
    styleUrls: ['./image-widget.component.scss'],
    imports: [WidgetBoxComponent, TextFontComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageWidgetComponent extends WidgetBaseComponent implements OnInit, OnDestroy {
  changeRef = inject(ChangeDetectorRef);
  
  override settings = input<ImageWidgetConfiguration>(new ImageWidgetConfiguration());

  hideLabel: boolean;
  url: string;
  interval: any;

  constructor(private dashboardManager: DashboardManagerService) {
    super();
  }

  ngOnInit(): void {
    const settings = this.settings();
    ImageWidgetConfiguration.ensureSettings(settings);
    this.hideLabel = !settings.label;

    if (settings.source === ImageSource.Command) {
      if (settings.valueCommand) {
        this.dashboardManager
          .onCommandUpdate(settings.valueCommand)
          .pipe(takeUntil(this.destroy))
          .subscribe((cv: CommandValue) => {
            this.updateValue(cv);
          });
      }
    } else {
      this.refreshUrl(settings.staticUrl);
    }

    if (settings.refreshInterval > 0) {
      this.interval = setInterval(() => {
        const settingsValue = this.settings();
        if (settingsValue.source === ImageSource.Command) {
          // JeeDom.refresh
        } else {
          this.refreshUrl(settingsValue.staticUrl);
        }
      }, settings.refreshInterval * 1000);
    }
  }

  override ngOnDestroy() {
    if (this.interval) clearInterval(this.interval);

    super.ngOnDestroy();
  }

  private refreshUrl(url: string) {
    var urlObj = new URL(url);

    urlObj.searchParams.append('nocache', new Date().getTime().toString());

    this.url = urlObj.toString();

    this.changeRef.detectChanges();
  }

  private updateValue(cv: CommandValue) {
    this.refreshUrl(cv.value);
  }
}
