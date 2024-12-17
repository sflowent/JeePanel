import { NgModule } from '@angular/core';
import { WidgetComponentsTable, WidgetDeclaration } from './widgets.resolver';

@NgModule({
  imports: [],
  providers: []
})
export class WidgetsModule {
  constructor() {}

  public resolveWidgetComponent(widgetType: string): WidgetDeclaration {
    return WidgetComponentsTable[widgetType];
  }
}
