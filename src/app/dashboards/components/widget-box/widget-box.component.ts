import { Component, OnInit, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetIconComponent } from '@app/shared/features/icons/components/widget-icon/widget-icon.component';
import { BackgroundSettings } from '@dashboards/models/widget-settings.model';

@Component({
    selector: 'widget-box',
    templateUrl: './widget-box.component.html',
    styleUrls: ['./widget-box.component.scss'],
    standalone: true,
    imports: [CommonModule, WidgetIconComponent]
})
export class WidgetBoxComponent implements OnInit {
  readonly background = input<BackgroundSettings>();

  readonly center = input<boolean>(true);

  constructor() {}

  ngOnInit(): void {}
}
