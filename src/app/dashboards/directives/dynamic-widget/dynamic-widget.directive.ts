import { Directive, OnChanges, ViewContainerRef, SimpleChanges, NgModuleRef, createNgModule, Type, input } from '@angular/core';
import { WidgetBaseSettings } from '../../models/widget-settings.model';
import { WidgetBaseComponent } from '@dashboards/components/widget-base/widget-base-component';
import { WidgetDeclaration } from '@app/widgets/widgets.resolver';
import { clone } from '@app/shared/functions/clone';
import { GridsterComponent, GridsterItem } from 'angular-gridster2';

@Directive({
  selector: '[dynamic-widget]',
  standalone: true
})
export class DynamicWidgetDirective implements OnChanges {
  readonly configuration = input<WidgetBaseSettings>();

  readonly isEditing = input<boolean>(false);

  readonly gridsterItemComponent = input.required<any>();

  constructor(private viewRef: ViewContainerRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.configuration()) {
      this.createDynamicWidget();
    }
  }

  async createDynamicWidget() {
    this.viewRef.clear();

    let widgetName = 'EditingWidgetComponent';
    let settings = this.configuration();

    if (!this.isEditing()) {
      widgetName = this.configuration().widgetType;
      settings = clone(this.configuration());
    }

    const importWidgetModule = await import(/* webpackChunkName: 'widgets' */ '@app/widgets/widgets.module');
    const elementModule = importWidgetModule.WidgetsModule;

    const elementModuleRef: NgModuleRef<any> = createNgModule(elementModule);
    const componentType = elementModuleRef.instance.resolveWidgetComponent(widgetName) as WidgetDeclaration;

    const widgetRef = this.viewRef.createComponent(componentType.type, {
      index: 0,
      injector: this.viewRef.injector
    });

    const widget = widgetRef.instance as WidgetBaseComponent;

    widgetRef.setInput("settings", settings);

    this.gridsterItemComponent()["jeepanel-widget"] = widget;
  }
}
