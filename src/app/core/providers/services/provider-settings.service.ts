import { inject, Injectable } from '@angular/core';
import { ProviderSettings } from '@app/core/providers/models/provider-settings.model';
import { concat, EMPTY, iif, map, Observable, of, switchMap, tap } from 'rxjs';
import { ProviderSettingsResource } from '../resources/provider-settings.resource';
import { DashboardStorageService } from '@app/core/dashboards-storage/services/dashboard-storage.service';
import { ProviderDefinition } from '../models/provider-definition.model';
import { concatMap, concatWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProviderSettingsService {
  providerSettingsResource = inject(ProviderSettingsResource);
  dashboardsStorageService = inject(DashboardStorageService);

  public availableProviders: ProviderDefinition[] = [];

  getAvailableProviders(): Observable<ProviderDefinition[]> {
    return of(this.availableProviders);
  }

  getProvidersSettings(): Observable<ProviderSettings[]> {
    return this.providerSettingsResource.getProvidersSettings().pipe(
      tap((settings) => {
        settings.forEach((s) => {
          s.label = this.availableProviders.find((p) => p.providerType === s.type)?.providerName;
        });
      }),
    );
  }

  saveProviderSettings(settings: ProviderSettings): Observable<ProviderSettings> {
    return iif(() => !!settings.id, this.providerSettingsResource.getProviderSettingsById(settings.id), of(void undefined)).pipe(
      switchMap((existingSettings: ProviderSettings | undefined) => {
        if (existingSettings) {
          const oldCode = existingSettings.code;
          Object.assign(existingSettings, settings);

          return iif(
            () => oldCode !== settings.code,
            this.dashboardsStorageService.updateProviderCode(oldCode, settings.code),
            of(void 0),
          ).pipe(
            concatMap(() => this.providerSettingsResource.saveProviderSettings(settings)),
            map((settingsUpdated: ProviderSettings) => {
              // Met à jour `existingSettings` avec les nouvelles valeurs
              Object.assign(existingSettings, settingsUpdated);
              return existingSettings;
            }),
          );
        }

        return this.providerSettingsResource.saveProviderSettings(settings);
      }),
    );
  }

  removeProviderSettings(id: number): Observable<void> {
    return this.providerSettingsResource.removeProviderSettings(id);
  }
}
