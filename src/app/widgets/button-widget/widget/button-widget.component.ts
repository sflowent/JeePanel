import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DefaultValues } from '@app/shared/default-values';
import { WidgetIconComponent } from '@app/shared/features/icons/components/widget-icon/widget-icon.component';
import { IconSettings } from '@app/shared/features/icons/models/icon-settings.model';
import { TextFont } from '@app/shared/features/text/models/text-font.model';
import { TextFontComponent } from '@app/shared/features/text/text-font/text-font.component';
import { clone } from '@app/shared/functions/clone';
import { ValueComparaisonService as ValueComparisonService } from '@app/shared/services/value-comparison.service';
import { LabelIconValueComponent } from '@dashboards/components/label-icon-value/label-icon-value.component';
import { WidgetBaseComponent } from '@dashboards/components/widget-base/widget-base-component';
import { WidgetBoxComponent } from '@dashboards/components/widget-box/widget-box.component';
import { CommandValue } from '@dashboards/models/command-value.model';
import { BackgroundSettings } from '@dashboards/models/widget-settings.model';
import { DashboardManagerService } from '@dashboards/services/dashboard-manager.service';
import { takeUntil } from 'rxjs';
import { ActionButtonSettings, ButtonActionType, ButtonWidgetConfiguration, LinkType } from '../models/button-widget-configuration';

@Component({
    selector: 'button-widget',
    templateUrl: './button-widget.component.html',
    styleUrls: ['./button-widget.component.scss'],
    standalone: true,
    imports: [CommonModule, WidgetBoxComponent, MatButtonModule, LabelIconValueComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonWidgetComponent extends WidgetBaseComponent implements OnInit {
  override readonly settings = input<ButtonWidgetConfiguration>(new ButtonWidgetConfiguration());

  valueComparisonService = inject(ValueComparisonService);
  changeRef = inject(ChangeDetectorRef);

  label: string = '';
  labelFont: TextFont = DefaultValues.LabelFont();

  current: ActionButtonSettings | null = null;

  highlightIcon: boolean = false;
  background: BackgroundSettings = new BackgroundSettings();
  icon?: IconSettings;
  valueFont: TextFont = DefaultValues.ValueFont();

  // -- NAVIGATE
  navigate = false;
  routerLink?: string;
  href?: string;
  value: any;
  action: ActionButtonSettings | null;
  showButtons: boolean = false;

  get hideValue() {
    return this.navigate || this.settings().hideValue;
  }

  constructor(private dashboardManager: DashboardManagerService) {
    super();
  }

  override onResize(): void {
    //console.log("resize");
    // this.icon = clone(this.icon);
    //this.changeRef.detectChanges();
  }

  ngOnInit(): void {

    const observer = new ResizeObserver(entries => {
      const width = entries[0].contentRect.width;
      console.log(width);
    });

    observer.observe(this.elementRef.nativeElement);

    const settings = this.settings();
    ButtonWidgetConfiguration.ensureSettings(settings);

    this.navigate = settings.actionType === ButtonActionType.Navigate;

    this.showButtons = settings.actionType === ButtonActionType.Toggle && settings.showButtons;

    this.background = clone(settings.background) || new BackgroundSettings();
    this.valueFont = clone(settings.valueFont) || DefaultValues.ValueFont();
    this.labelFont = clone(settings.labelFont) || DefaultValues.LabelFont();
    this.icon = settings.icon;
    this.label = settings.label;

    if (this.navigate) {
      this.initLink();
      return;
    }

    if (settings.valueCommand) {
      this.dashboardManager
        .onCommandUpdate(settings.valueCommand)
        .pipe(takeUntil(this.destroy))
        .subscribe((cv: CommandValue) => {
          
          this.updateValue(cv);

          this.changeRef.detectChanges();
        });
    }
  }

  private updateValue(cv: CommandValue) {
    this.value = cv.value;

    const settings = this.settings();
    if (!settings.valueCommand) {
      return;
    }

    this.action = settings.action;
    this.current = settings.action;
    this.highlightIcon = false;

    if (settings.actionType === ButtonActionType.Toggle) {
      this.current = settings.actionAlt || settings.action;
      this.action = settings.action;

      if (settings.activeValue && this.valueComparisonService.compare(this.value, settings.activeValue)) {
        this.current = settings.action;
        this.action = settings.actionAlt || settings.action;

        this.highlightIcon = true;
      }
    }

    this._setDisplay();

    this.valueFont.unit = cv.unit ?? settings.valueFont.unit;
  }

  actionClick() {
    if (this.action?.command) {
      this.dashboardManager.sendCmd(this.action.command);
    }
  }

  buttonActionClick(event: Event){
    const settings = this.settings();
    if (settings.action?.command) {
      this.dashboardManager.sendCmd(settings.action?.command);
    }
    event.stopPropagation();
  }

  buttonActionAltClick(event: Event){
    const settings = this.settings();
    if (settings.actionAlt?.command) {
      this.dashboardManager.sendCmd(settings.actionAlt?.command);
    }
    event.stopPropagation();
  }

  initLink() {
    const settings = this.settings();
    if (settings.linkType === LinkType.Dashboard) {
      this.dashboardManager.getDashboard(settings.targetDashboardCode).subscribe(dashboard => {
        const settingsValue = this.settings();
        this.label = settingsValue.dashboardName ? dashboard.settings.title : settingsValue.label;

        this.routerLink = dashboard.link;
      });
    } else if (settings.linkType === LinkType.Link) {
      this.label = settings.label;
      this.href = settings.href;
    }
  }

  _setDisplay() {
    const settings = this.settings();
    this.background.bgColor = settings.background?.bgColor;
    this.labelFont.color = settings.labelFont?.color;
    this.valueFont.color = settings.valueFont?.color;

    if (settings.actionType === ButtonActionType.Toggle) {
      this.background.bgColor = this.current?.bgColor || this.background.bgColor;
      this.labelFont.color = this.current?.labelColor || this.labelFont.color;
      this.valueFont.color = this.current?.valueColor || this.valueFont.color;
    }
  }
}
