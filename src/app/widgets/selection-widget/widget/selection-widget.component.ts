import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, OnInit, signal, TemplateRef, input, viewChild } from '@angular/core';
import { DefaultValues } from '@app/shared/default-values';
import { WidgetIconComponent } from '@app/shared/features/icons/components/widget-icon/widget-icon.component';
import { IconSettings } from '@app/shared/features/icons/models/icon-settings.model';
import { ModalService } from '@app/shared/features/modals/services/modal.service';
import { TextFont } from '@app/shared/features/text/models/text-font.model';
import { TextFontComponent } from '@app/shared/features/text/text-font/text-font.component';
import { clone } from '@app/shared/functions/clone';
import { LabelIconValueComponent } from '@dashboards/components/label-icon-value/label-icon-value.component';
import { WidgetBaseComponent } from '@dashboards/components/widget-base/widget-base-component';
import { WidgetBoxComponent } from '@dashboards/components/widget-box/widget-box.component';
import { CommandListItem } from '@dashboards/models/command-list-item.model';
import { CommandValue } from '@dashboards/models/command-value.model';
import { BackgroundSettings } from '@dashboards/models/widget-settings.model';
import { DashboardManagerService } from '@dashboards/services/dashboard-manager.service';
import { takeUntil } from 'rxjs';
import { SelectionWidgetConfiguration } from '../models/selection-widget-configuration';

@Component({
    selector: 'selection-widget',
    templateUrl: './selection-widget.component.html',
    styleUrls: ['./selection-widget.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, WidgetBoxComponent, TextFontComponent, LabelIconValueComponent]
})
export class SelectionWidgetComponent extends WidgetBaseComponent implements OnInit {
  readonly selectionModalTemplate = viewChild.required<TemplateRef<any>>('selectionTemplateModal');

  override readonly settings = input<SelectionWidgetConfiguration>(new SelectionWidgetConfiguration());

  label: string = '';
  labelFont: TextFont = DefaultValues.LabelFont();
  valueFont: TextFont = DefaultValues.ValueFont();

  currentCommand = signal<CommandListItem | null>(null);
  background: BackgroundSettings = new BackgroundSettings();
  icon: IconSettings | null = null;

  value = computed(() => this.currentCommand()?.value);

  get hideLabel() {
    const settings = this.settings();
    return settings.hideLabel || !settings.label;
  }

  get hideValue() {
    return this.settings().hideValue;
  }

  constructor(private dashboardManager: DashboardManagerService, private modalService: ModalService, private changeRef: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this.labelFont = clone(this.settings().labelFont) || DefaultValues.LabelFont();
    this.background = clone(this.settings().background) || new BackgroundSettings();
    this.valueFont = clone(this.settings().valueFont) || DefaultValues.ValueFont();
    this.icon = clone(this.settings().icon) || {};

    const settings = this.settings();
    SelectionWidgetConfiguration.ensureSettings(settings);

    if (settings.valueCommand && settings.valueCommand) {
      this.dashboardManager
        .onCommandUpdate(settings.valueCommand)
        .pipe(takeUntil(this.destroy))
        .subscribe((cv: CommandValue) => {
          this.updateValue(cv);
        });
    }
  }

  private updateValue(cv: CommandValue) {
    const settings = this.settings();
    this.background.bgColor = settings.background?.bgColor;
    this.valueFont.color = settings.valueFont.color;
    this.labelFont.color = settings.labelFont.color;

    let currentCommand = this.currentCommand();
    if (currentCommand) {
      currentCommand.selected = false;
    }

    currentCommand = settings.commands.find(x => x.value === cv.value) ?? null;

    if (currentCommand) {
      currentCommand.selected = true;

      this.background.bgColor = currentCommand.bgColor ?? this.background.bgColor;
      this.labelFont.color = currentCommand.labelColor ?? settings.labelFont.color;
      this.valueFont.color = currentCommand.valueColor ?? settings.valueFont.color;
    }

    this.currentCommand.set(currentCommand);
    this.changeRef.detectChanges();
  }

  openSelection() {
    const data = {
      columns: this.settings().columns,
      commands: this.settings().commands,
      defaultFont: this.settings().valueFont,
      select: (command: CommandListItem) => {
        this.selectionSelected(command);
        if (!this.settings().keepOpen) {
          dialogRef.close();
        }
      }
    };

    const dialogRef = this.modalService.open(this.selectionModalTemplate(), data, {
      panelClass: '',
      width: '900px',
      position: { top: '20px' },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(() => {});
  }

  selectionSelected(command: CommandListItem) {
    if (command.command) {
      this.dashboardManager.sendCmd(command.command);
    }
  }
}
