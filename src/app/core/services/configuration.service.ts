import { Injectable, inject } from '@angular/core';
import { APP_CONFIG, JeePanelSettings } from '@app/core/settings/models/jeepanel-settings.model';
import { Dashboard } from '@dashboards/models/dashboard.model';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { DashboardStorageSettings } from '../dashboards-storage/models/dashboard-storage-settings.model';
import { DashboardStorageSettingsService } from '../dashboards-storage/services/dashboard-storage-settings.service';
import { DashboardStorageService } from '../dashboards-storage/services/dashboard-storage.service';
import { ProviderDefinition } from '../providers/models/provider-definition.model';
import { ProviderSettings } from '../providers/models/provider-settings.model';
import { ProviderSettingsService } from '../providers/services/provider-settings.service';
import { ProvidersService } from '../providers/services/providers.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  window = inject(Window);
  dashboardStorageSettingsService = inject(DashboardStorageSettingsService);
  providerSettingsService = inject(ProviderSettingsService);
  providersService = inject(ProvidersService);
  dashboardStorageService = inject(DashboardStorageService);
  constructor() {}

  loadConfig(providersDefinitions: ProviderDefinition[]): Observable<JeePanelSettings> {
    this.providerSettingsService.availableProviders = providersDefinitions;

    return forkJoin([this.dashboardStorageSettingsService.getStoragesSettings(), this.providerSettingsService.getProvidersSettings()]).pipe(
      switchMap((result) => {
        return this.providersService.initProviders().pipe(
          map(() => {
            return result;
          }),
        );
      }),
      switchMap(([storageSettings, providersSettings]: [DashboardStorageSettings[], ProviderSettings[]]) => {
        APP_CONFIG.providersSettings = providersSettings;
        APP_CONFIG.storagesSettings = storageSettings;

        return this.dashboardStorageService.getDashboards();
      }),
      map((dashboards: Dashboard[]) => {
        APP_CONFIG.dashboards = dashboards;

        return APP_CONFIG;
      }),
    );
  }
}
