import { InjectionToken } from '@angular/core';
import { ProviderSettings } from '@app/core/providers/models/provider-settings.model';
import { Dashboard } from '@dashboards/models/dashboard.model';
import { DashboardStorageSettings } from '../../dashboards-storage/models/dashboard-storage-settings.model';

export const JEE_SETTINGS = new InjectionToken<JeePanelSettings>('settings');

export class JeePanelSettings {
  
  storagesSettings: DashboardStorageSettings[] = [];
  get currentStorage(): DashboardStorageSettings {
    return this.storagesSettings.find(st => st.selected)!;
  }
  
  providersSettings: ProviderSettings[] = [];
  
  dashboards: Dashboard[] = [];

  constructor(init?: Partial<JeePanelSettings>){
    Object.assign(this, init);

  }
}

export const APP_CONFIG: JeePanelSettings = new JeePanelSettings();
