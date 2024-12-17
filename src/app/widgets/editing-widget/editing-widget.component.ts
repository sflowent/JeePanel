import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalService } from '@app/shared/features/modals/services/modal.service';
import { WidgetBaseComponent } from '@dashboards/components/widget-base/widget-base-component';
import { DashboardManagerService } from '@dashboards/services/dashboard-manager.service';
import { WidgetComponentsTable, WidgetDeclaration } from '../widgets.resolver';
import {MatTooltipModule} from '@angular/material/tooltip'

import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { WidgetBoxComponent } from '@dashboards/components/widget-box/widget-box.component';
import { DynamicFormModal } from '@dashboards/features/dynamic-form/modals/dynamic-form-modal/dynamic-form-modal.component';
import { DynamicForm } from '@dashboards/features/dynamic-form/models/dynamic-form.model';
import { DynamicFormService } from '@dashboards/features/dynamic-form/services/dynamic-form.service';
import { DEFAULT_GRIDSTER_CONFIG } from '@dashboards/pages/dashboards-page/dashboards-page.component';
import { clone } from 'mathjs';

@Component({
    selector: 'editing-widget',
    templateUrl: './editing-widget.component.html',
    standalone: true,
    styleUrls: ['./editing-widget.component.scss'],
    imports: [MatButtonModule, MatMenuModule, MatIconModule, WidgetBoxComponent, MatTooltipModule]})
export class EditingWidgetComponent extends WidgetBaseComponent implements OnInit {

  widgetDeclaration: WidgetDeclaration = new WidgetDeclaration();
  httpClient = inject(HttpClient);
  dynamicFormService = inject(DynamicFormService);

  options = DEFAULT_GRIDSTER_CONFIG;

  constructor(
    private dashboardManager: DashboardManagerService,
    private modalService: ModalService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.widgetDeclaration = WidgetComponentsTable[this.settings().widgetType];
  }

  edit($event: any) {
    const configJsonFile = this.widgetDeclaration.configJsonFile;

    if (configJsonFile) {
      const url = `assets/config/widgets/${configJsonFile as string}`;
      this.httpClient.get<DynamicForm[]>(url).subscribe({
        next: (resultConfig: DynamicForm[]) => {
          if (!resultConfig) {
            return;
          }

          const config: DynamicForm[] = [];
          resultConfig.forEach(cdf => {
            config.push(DynamicForm.newDynamicForm(cdf));
          });

          this._setSettingsValues(config);

          const dialogRef = this.modalService.open(DynamicFormModal, {
            dynamicForms: config,
            title: this.settings().widgetType,
            metadata: this.settings()
          });

          dialogRef.afterClosed().subscribe((dynamicFormsUpdated: DynamicForm[]) => {
            if (dynamicFormsUpdated) {
              this.dynamicFormService.toModel(this.settings(), dynamicFormsUpdated);
            }
          });
        },
        error: (error: any) => {
          console.error(error);
        }
      });
    }
  }

  private _setSettingsValues(config: DynamicForm[]) {
    const allElements = config.flatMap(c => c.rows);
    allElements.forEach(elt => {
      let obj = this.settings();
      let props = elt.name.split('.');

      props.forEach((prop: string, index: number) => {
        const lastIndex = index === props.length - 1;

        if (!obj[prop] && !lastIndex) {
          obj[prop] = {};
        }
        obj = obj[prop];
      });

      elt.value = obj ?? elt.defaultValue;
    });
  }

  delete($event: any) {
    this.dashboardManager.removeWidget(this.settings());
  }

  clone($event: any) {
    const cloneW = clone(this.settings());
    cloneW.id = 0;
    this.dashboardManager.addWidget(cloneW);
  }
}
