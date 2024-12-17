import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnChanges, SimpleChanges, afterNextRender, inject, input } from '@angular/core';
import { IconSettings } from '@app/shared/features/icons/models/icon-settings.model';
import { TextFont } from '@app/shared/features/text/models/text-font.model';
import { TextFontComponent } from '@app/shared/features/text/text-font/text-font.component';
import { WidgetIconComponent } from '../../../shared/features/icons/components/widget-icon/widget-icon.component';
import { DefaultValues } from '@app/shared/default-values';

@Component({
    selector: 'label-icon-value',
    imports: [CommonModule, TextFontComponent, WidgetIconComponent],
    templateUrl: './label-icon-value.component.html',
    styleUrl: './label-icon-value.component.scss',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelIconValueComponent implements OnChanges {
  changeRef = inject(ChangeDetectorRef);

  readonly label = input<string | null>(null);

  readonly labelFont = input<TextFont>(DefaultValues.LabelFont());

  readonly hideLabel = input(false);

  readonly value = input<string | null>(null);

  readonly valueFont = input<TextFont>(DefaultValues.ValueFont());

  readonly hideValue = input(false);

  readonly alignHorizontal = input<boolean>(false);

  readonly iconLeft = input<boolean>(false);

  readonly icon = input<IconSettings | null>(null);

  readonly highlightIcon = input<boolean>(false);

  iconShowed: IconSettings | null = null;
  reloadIcon = false;

  showLabel!: boolean;

  ngOnChanges(changes: SimpleChanges): void {
      this.reloadIcon = true;// -- refresh icon size

      this.showLabel = !this.hideLabel() && !!this.label();

      setTimeout(() => {
        const icon = this.icon();
        this.iconShowed = icon?.icon ? icon : null; 
        this.reloadIcon = false;
        this.changeRef.detectChanges();
      });
  }
}
