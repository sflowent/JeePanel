import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject, input } from '@angular/core';
import { IconSettings } from '@app/shared/features/icons/models/icon-settings.model';
import { TextFont } from '@app/shared/features/text/models/text-font.model';
import { clone } from '@app/shared/functions/clone';
import { ValueComparaisonService } from '@app/shared/services/value-comparison.service';
import { LabelIconValueComponent } from '@dashboards/components/label-icon-value/label-icon-value.component';
import { WidgetBaseComponent } from '@dashboards/components/widget-base/widget-base-component';
import { WidgetBoxComponent } from '@dashboards/components/widget-box/widget-box.component';
import { SeriesItem } from '@dashboards/features/charts/models/series-item.model';
import { ChartService } from '@dashboards/features/charts/services/chart.service';
import { CommandValue } from '@dashboards/models/command-value.model';
import { BackgroundSettings } from '@dashboards/models/widget-settings.model';
import { DashboardManagerService } from '@dashboards/services/dashboard-manager.service';
import { takeUntil } from 'rxjs';
import { LabelWidgetConfiguration } from '../models/label-widget-configuration';
import { JeeMarqueeComponent } from '@app/shared/components/jee-marquee/jee-marquee.component';
import { AlternativeSettings } from '@dashboards/models/alternative-settings.model';

@Component({
    selector: 'label-widget',
    standalone: true,
    templateUrl: './label-widget.component.html',
    styleUrls: ['./label-widget.component.scss'],
    imports: [CommonModule, WidgetBoxComponent, LabelIconValueComponent, JeeMarqueeComponent]
})
export class LabelWidgetComponent extends WidgetBaseComponent implements OnInit {
  override settings = input<LabelWidgetConfiguration>(new LabelWidgetConfiguration());

  valueComparisonService = inject(ValueComparaisonService);
  chartService = inject(ChartService);
  changeRef = inject(ChangeDetectorRef);

  isHistorized: boolean = false;
  background: BackgroundSettings = new BackgroundSettings();
  labelFont: TextFont = new TextFont();
  valueFont: TextFont = new TextFont();
  displayValue: any;
  value: CommandValue;
  icon?: IconSettings;
  highlightIcon: boolean = false;
  alternativesSettings: AlternativeSettings;

  get hideLabel() {
    const settings = this.settings();
    return settings.hideLabel || !settings.label;
  }

  get hideValue() {
    return this.settings().hideValue;
  }

  constructor(private dashboardManage: DashboardManagerService) {
    super();
  }

  ngOnInit(): void {
    const settings = this.settings();
    LabelWidgetConfiguration.ensureSettings(settings);

    this.background = clone(settings.background);
    this.labelFont = clone(settings.labelFont);
    this.valueFont = clone(settings.valueFont);
    this.icon = settings.icon ? clone(settings.icon) : null;
    this.highlightIcon = settings.highlightIcon;
    this.alternativesSettings = this.settings().marquee ? this.settings().alternativesMarquee : this.settings().alternatives;

    if (settings.valueCommand) {
      this.isHistorized = settings.showHistory;

      this.dashboardManage
        .onCommandUpdate(settings.valueCommand)
        .pipe(takeUntil(this.destroy))
        .subscribe((cv: CommandValue) => {
          const settingsValue = this.settings();
          if (settingsValue.valueCommand) {
            this.value = cv;

            this.evalAlternatives();
          }

          settingsValue.valueFont.unit = settingsValue.valueFont.unit || cv.unit || '';

          this.changeRef.detectChanges();
        });
    }
  }

  evalAlternatives() {
    const settings = this.settings();
    this.icon = settings.icon;
    this.background.bgColor = settings.background?.bgColor;
    this.background.backdropIcon = settings.background?.backdropIcon;
    this.labelFont.color = settings.labelFont.color;
    this.valueFont.color = settings.valueFont.color;
    this.highlightIcon = settings.highlightIcon;
    this.displayValue = this.value.value;

    if (!this.alternativesSettings || !this.alternativesSettings.alternatives?.length) {
      return;
    }

    const alternatives = this.alternativesSettings.alternatives;
    alternatives.forEach(alt => {
      const evalValue = this.valueComparisonService.compare(this.value.value, alt.expression);
      if (evalValue) {
        this.background.backdropIcon = alt.bgIcon || this.background.backdropIcon;
        this.background.bgColor = alt.bgColor || this.background.bgColor;
        this.icon = alt.icon || this.icon;
        this.labelFont.color = alt.labelColor || this.labelFont.color;
        this.valueFont.color = alt.valueColor || this.valueFont.color;
        this.displayValue = alt.displayValue || this.displayValue;
        this.highlightIcon = alt.hightlightIcon || this.highlightIcon;
        return;
      }
    });
  }

  showHistory() {
    const settings = this.settings();
    if (!this.isHistorized || !settings.showHistory || !settings.valueCommand) {
      return;
    }

    settings.history.alternatives = this.alternativesSettings;
    settings.history.title = settings.label;
    settings.history.series = [new SeriesItem({ name: settings.label, command: settings.valueCommand })];
    this.chartService.openModalChart(settings.history);
  }
}
