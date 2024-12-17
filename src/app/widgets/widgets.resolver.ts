import { ComponentType } from '@angular/cdk/portal';
import { WidgetBaseComponent } from '@dashboards/components/widget-base/widget-base-component';
import { ButtonWidgetComponent } from './button-widget/widget/button-widget.component';
import { EditingWidgetComponent } from './editing-widget/editing-widget.component';
import { ImageWidgetComponent } from './image-widget/widget/image-widget.component';
import { LabelWidgetComponent } from './label-widget/widget/label-widget.component';
import { SelectionWidgetComponent } from './selection-widget/widget/selection-widget.component';
import { SliderWidgetComponent } from './slider-widget/widget/slider-widget.component';
import { ChartWidgetComponent } from './chart-widget/widget/chart-widget.component';
import { ClockWidgetComponent } from './clock-widget/widget/clock-widget.component';
import { ThermostatWidgetComponent } from './thermostat-widget/widget/thermostat-widget.component';

export class WidgetDeclaration {
  type!: ComponentType<WidgetBaseComponent>;
  configJsonFile?: string | ComponentType<WidgetBaseComponent>;
  label?: string;
  hide = false;

  constructor(init?: Partial<WidgetDeclaration>) {
    Object.assign(this, init);
  }
}

export const WidgetComponentsTable: { [key: string]: WidgetDeclaration } = {
  EditingWidgetComponent: { type: EditingWidgetComponent, hide: true },
  LabelWidgetComponent: { type: LabelWidgetComponent, label: 'Label', hide: false, configJsonFile: 'label-settings.json' },
  SliderWidgetComponent: { type: SliderWidgetComponent, label: 'Curseur/Slider', hide: false, configJsonFile: 'slider-settings.json' },
  ButtonWidgetComponent: { type: ButtonWidgetComponent, label: 'Bouton', hide: false, configJsonFile: 'button-settings.json' },
  SelectionWidgetComponent: { type: SelectionWidgetComponent, label: 'Selection/Mode', hide: false, configJsonFile: 'selection-settings.json' },
  ImageWidgetComponent: { type: ImageWidgetComponent, label: 'Image', hide: false, configJsonFile: 'image-settings.json' },
  ChartWidgetComponent: { type: ChartWidgetComponent, label: 'Graphique', hide: false, configJsonFile: 'chart-settings.json' },
  ClockWidgetComponent: { type: ClockWidgetComponent, label: 'Horloge', hide: false, configJsonFile: 'clock-settings.json' },
  ThermostatWidgetComponent: { type: ThermostatWidgetComponent, label: 'Thermostat', hide: false, configJsonFile: 'thermostat-settings.json' }

};

export const WidgetComponentsList: WidgetDeclaration[] = Object.values(WidgetComponentsTable);
