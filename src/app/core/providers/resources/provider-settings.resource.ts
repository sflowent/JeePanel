import { Injectable } from '@angular/core';
import { ProviderSettings } from '@app/core/providers/models/provider-settings.model';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProviderSettingsResource {
  static PROVIDERS_KEY = 'jee-panel-providers';

  public providersSettings: ProviderSettings[] = [];

  getProviderSettingsById(id: number): Observable<ProviderSettings | undefined> {
    return of(this._getProvidersSettings().find(ps => ps.id === id));
  }

  getProvidersSettings(): Observable<ProviderSettings[]> {
    return of(this._getProvidersSettings());
  }

  private _getProvidersSettings(): ProviderSettings[] {
    if (this.providersSettings?.length) {
      return this.providersSettings;
    }

    const providersConfigStr = localStorage.getItem(ProviderSettingsResource.PROVIDERS_KEY) || '{}';
    const providersConfig: ProviderSettings[] = [];

    let settingsObj = JSON.parse(providersConfigStr);
    settingsObj = settingsObj ?? [];
    if (!Array.isArray(settingsObj)) {
      settingsObj = [];
    }

    settingsObj.forEach((ps: ProviderSettings) => {
      providersConfig.push(new ProviderSettings(ps));
    });

    this.providersSettings = providersConfig;

    return providersConfig;
  }

  private saveProvidersSettings(settings?: ProviderSettings[]): Observable<ProviderSettings[]> {
    if (settings) {
      this.providersSettings = settings;
    }

    

    //const providersSettingsToSaved = this.providersSettings.map(ps=> ps?.toJSON ? ps.toJSON() : ps);
    localStorage.setItem(ProviderSettingsResource.PROVIDERS_KEY, JSON.stringify(this.providersSettings));
    return of(this.providersSettings);
  }

  saveProviderSettings(settings: ProviderSettings): Observable<ProviderSettings> {
    const all = this._getProvidersSettings();
debugger;
    if (settings.id) {
      const existingSettings = all.find((s) => s.id === settings.id);
      if (existingSettings) {
        Object.assign(existingSettings, settings);
      }
    }
    else{
      const maxId = Math.max(0, ...(all?.map((d) => d.id) || [0]));

      settings.id = maxId + 1;
      all.push(settings)
    }

    return this.saveProvidersSettings().pipe(
      map(() => {
        return settings;
      }),
    );
  }

  removeProviderSettings(id: number): Observable<void> {
    this.providersSettings = this.providersSettings.filter(ps => ps.id !== id);
    return this.saveProvidersSettings(this.providersSettings).pipe(map(()=> {
      return;
    }))
  }
}
