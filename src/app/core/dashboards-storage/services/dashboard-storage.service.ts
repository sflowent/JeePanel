import { inject, Injectable, Injector } from '@angular/core';
import { PERSISTANT_STORAGE_DEFINITION } from '@app/app.config';
import { Dashboard } from '@dashboards/models/dashboard.model';
import { map, Observable, ReplaySubject, switchMap, tap } from 'rxjs';
import { DashboardStorageSettings } from '../models/dashboard-storage-settings.model';
import { DashboardStorageBaseService } from './dashboard-storage-base.service';
import { DashboardStorageSettingsService } from './dashboard-storage-settings.service';
import { Command } from '@dashboards/models/command.model';
import { APP_CONFIG, JEE_SETTINGS } from '@app/core/settings/models/jeepanel-settings.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardStorageService {
  storageSettingsService = inject(DashboardStorageSettingsService);
  injector = inject(Injector);

  app_settings = inject(JEE_SETTINGS);

  protected _currentDashboardStorage!: DashboardStorageBaseService;
  protected get currentDashboardStorage() {
    if (!this._currentDashboardStorage) {
      const type = this.storageSettingsService.getCurrentSettings().code;
      this._setStorage(type);
    }

    return this._currentDashboardStorage;
  }

  switchStorageTo(storageType: string) {
    this._setStorage(storageType);
    this.storageSettingsService.saveStoragesSettings();
  }

  protected _setStorage(storageType: string) {
    const settings = this.storageSettingsService.setStorage(storageType);

    this._currentDashboardStorage = this.injector.get(PERSISTANT_STORAGE_DEFINITION[storageType].useClass) as DashboardStorageBaseService;
    this._currentDashboardStorage.setSettings(settings?.data || {});
  }

  getDashboards(): Observable<Dashboard[]> {
    return this.currentDashboardStorage.getDashboards().pipe(
      tap((dashboards) => {
        this.app_settings.dashboards = dashboards;
      }),
    );
  }

  saveDashboards(dashboards: Dashboard[]): Observable<Dashboard[]> {
    return this.currentDashboardStorage.saveDashboards(dashboards).pipe(
      tap((dashboards) => {
        this.app_settings.dashboards = dashboards;
      }),
    );
  }

  saveDashboard(dashboard: Dashboard): Observable<Dashboard> {
    return this.currentDashboardStorage.saveDashboard(dashboard).pipe(
      switchMap(() => this.getDashboards()),
      map(() => dashboard)
    );
  }

  removeDashboard(id: number): Observable<void> {
    return this.currentDashboardStorage.removeDashboard(id).pipe(
      tap((dashboards) => {
        var index = this.app_settings.dashboards.findIndex((d) => d.id === id);
        if (index >= 0) {
          this.app_settings.dashboards.slice(index, 1);
        }
      }),
    );
  }

  openModalConfig(storageType: string): Observable<DashboardStorageSettings> {
    const resource = this.injector.get(PERSISTANT_STORAGE_DEFINITION[storageType].useClass) as DashboardStorageBaseService;
    const settings = this.storageSettingsService.getStorageSettings(storageType)!;
    resource.setSettings(settings.data);
    return resource.openModalConfig().pipe(
      tap((data) => {
        if (data) {
          settings.data = data;
          this.storageSettingsService.saveStorageSettings(settings);
        }
      }),
    );
  }

  updateProviderCode(oldCode: string, newCode: string): Observable<void> {
    const result = new ReplaySubject<void>(1);
    let modified = false;
    this.getDashboards().subscribe((dashboards) => {
      dashboards.forEach((dashboard) => {
        const providersCommand = dashboard.getCommands().filter((c) => c.providerCode === oldCode);
        if (providersCommand.length > 0) {
          modified = true;
          providersCommand.forEach((c: Command) => (c.providerCode = newCode));
        }
      });

      if (modified) {
        this.saveDashboards(dashboards).subscribe(() => {
          result.next();
        });
        return;
      }

      result.next();
    });

    return result.asObservable();
  }
}
