import { inject, Injectable } from '@angular/core';
import { DashboardStorageBaseService } from '@app/core/dashboards-storage/services/dashboard-storage-base.service';
import { ProvidersService } from '@app/core/providers/services/providers.service';
import { DashboardStorageSettings } from '@app/core/dashboards-storage/models/dashboard-storage-settings.model';
import { ModalService } from '@app/shared/features/modals/services/modal.service';
import { Dashboard } from '@dashboards/models/dashboard.model';
import { map, Observable, of, Subject, switchMap } from 'rxjs';
import { JeedomProviderService } from '../services/jeedom-provider.service';
import { JeedomStorageSettingsModalComponent } from './modals/jeedom-storage-settings-modal/jeedom-storage-settings-modal.component';
import { JeedomStorageConfig } from './models/jeedom-storage-config';
import { JeedomResource } from '../resources/jeedom.resource';
import { DashboardStorageService } from '@app/core/dashboards-storage/services/dashboard-storage.service';

@Injectable({
  providedIn: 'root',
})
export class JeedomDashboardRepositoryService implements DashboardStorageBaseService {
  modalService = inject(ModalService);
  providersService = inject(ProvidersService);
  dashboardStorageService = inject(DashboardStorageService);

  config: JeedomStorageConfig = new JeedomStorageConfig();
  jeedomResource!: JeedomResource;

  constructor() {}

  setSettings(specificSettings: JeedomStorageConfig): void {
    this._setSettings(new JeedomStorageConfig(specificSettings));
  }

  private _setSettings(config: JeedomStorageConfig): void {
    this.config = config;

    if (this.config.command?.providerCode) {
      const provider = this.providersService.getProvider(this.config.command.providerCode) as JeedomProviderService;
      if (provider) {
        this.jeedomResource = provider.jeedomResource;
      }
    }
  }

  openModalConfig(): Observable<any> {
    const subject = new Subject<any>();
    this.modalService
      .open(JeedomStorageSettingsModalComponent, {
        settings: this.config,
      })
      .afterClosed()
      .subscribe((result: JeedomStorageConfig) => {
        if (result) {
          this._setSettings(result);
        }
        subject.next(result);
      });

    return subject.asObservable();
  }

  removeDashboard(id: number): Observable<void> {
    return this.getDashboards().pipe(
      switchMap((dashboards) => {
        const index = dashboards.findIndex((d) => d.id === id);
        if (index >= 0) {
          dashboards.splice(index, 1);

          return this.saveDashboards(dashboards).pipe(map(() => {}));
        }

        return of(void 0);
      }),
    );
  }

  getDashboards(): Observable<Dashboard[]> {
    const commandeRef = this.config.command?.commandRef;
    const provider = this.jeedomResource!;
    if (!commandeRef || !provider) {
      return of([]);
    }

    return this.jeedomResource.getCommandValue(commandeRef).pipe(
      map((dashboardStr) => {
        if (!dashboardStr) {
          return [];
        }

        try {
          const dashboardsJSon: Dashboard[] = JSON.parse(dashboardStr);
          const dashboards = dashboardsJSon.map((d) => new Dashboard(d));
          return dashboards;
        } catch (ex) {
          console.error('impossible de recuperer les dashboards', ex);
          return [];
        }
      }),
    );
  }

  saveDashboards(dashboards: Dashboard[]): Observable<Dashboard[]> {
    dashboards.forEach((d) => this._prepareDashboard(d, dashboards));

    return this._saveDashboards(dashboards).pipe(
      map(() => {
        return dashboards;
      }),
    );
  }

  saveDashboard(dashboard: Dashboard): Observable<Dashboard> {
    return this.getDashboards().pipe(
      switchMap((dashboards) => {
        this._prepareDashboard(dashboard, dashboards);

        return this._saveDashboards(dashboards).pipe(
          map(() => {
            return dashboard;
          }),
        );
      }),
    );
  }

  private _saveDashboards(dashboards: Dashboard[]): Observable<Dashboard[]> {
    const commandRef = this.config.command?.commandRef;
    if (commandRef) {
      const dashboardStr = JSON.stringify(dashboards);
      return this.jeedomResource.setCommandValue(commandRef, dashboardStr).pipe(
        map(() => {
          return dashboards;
        }),
      );
    }

    return of([]);
  }

  private _prepareDashboard(dashboard: Dashboard, dashboards: Dashboard[]) {
    if (!dashboard.id) {
      const maxId = Math.max(0, ...(dashboards?.map((d) => d.id) || [0]));
      dashboard.id = maxId + 1;
      dashboards.push(dashboard);
    } else {
      const existingIndex = dashboards.findIndex((x) => x.id === dashboard.id);
      if (existingIndex != -1) {
        dashboards[existingIndex] = dashboard;
      }
    }
  }
}
