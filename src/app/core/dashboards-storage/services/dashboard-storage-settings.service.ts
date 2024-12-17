import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DashboardStorageSettings } from '../models/dashboard-storage-settings.model';

const DEFAULT_STORAGE: DashboardStorageSettings = new DashboardStorageSettings({
  code: 'local',
  selected: true,
});

@Injectable({
  providedIn: 'root',
})
export class DashboardStorageSettingsService {
  /**************************************
   *    Storages settings
   */
  static STORAGE_KEY = 'jee-panel-storages';

  public storagesSettings: DashboardStorageSettings[] = [];
  protected currentStorage: DashboardStorageSettings | null = null;

  getCurrentSettings(): DashboardStorageSettings {
    if (!this.currentStorage) {
      this.currentStorage = this.storagesSettings.find((st) => st.selected)!;

      this.currentStorage ??= this.storagesSettings[0];
    }

    return this.currentStorage;
  }

  getStorageSettings(storageType: string): DashboardStorageSettings | undefined {
    let storage = this.storagesSettings.find((st) => st.code === storageType);
    return storage;
  }

  setStorage(storageType: string): DashboardStorageSettings {
    
    this.storagesSettings.forEach(s => s.selected = false);

    let storage = this.storagesSettings.find((st) => st.code === storageType);

    if (!storage) {
      storage = new DashboardStorageSettings({
        code: storageType,
      });
      this.storagesSettings.push(storage);
    }

    storage.selected = true;

    this.currentStorage = storage;

    this.saveStoragesSettings();

    return storage;
  }

  getStoragesSettings(): Observable<DashboardStorageSettings[]> {
    return of(this._getStorageSettings());
  }

  private _getStorageSettings(): DashboardStorageSettings[] {
    const storageConfigStr = localStorage.getItem(DashboardStorageSettingsService.STORAGE_KEY) || '[]';
    const storageConfig: DashboardStorageSettings[] = JSON.parse(storageConfigStr);
    const storagesSettings = storageConfig.map((ss) => new DashboardStorageSettings(ss));

    if (!storagesSettings.length) {
      storagesSettings.push(new DashboardStorageSettings(DEFAULT_STORAGE));
      this.saveStoragesSettings(storageConfig);
    }

    this.storagesSettings = storagesSettings;

    return this.storagesSettings;
  }

  saveStoragesSettings(settings?: DashboardStorageSettings[]): Observable<DashboardStorageSettings[]> {
    if (settings) {
      this.storagesSettings = settings;
    }

    const dataToSave = this.storagesSettings.map(ss => ss?.toJSON ? ss.toJSON(): ss)
    localStorage.setItem(DashboardStorageSettingsService.STORAGE_KEY, JSON.stringify(dataToSave));
    return of(this.storagesSettings);
  }

  saveStorageSettings(storageSettings: DashboardStorageSettings): Observable<DashboardStorageSettings> {
    const allSettings = this._getStorageSettings();
    const oldSettings = allSettings.find((ls) => ls.code === storageSettings.code);
    if (oldSettings) {
      Object.assign(oldSettings, storageSettings);
    } else {
      allSettings.push(storageSettings);
    }

    this.saveStoragesSettings(allSettings);

    return of(storageSettings);
  }
}
