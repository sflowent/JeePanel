import { Injectable } from '@angular/core';
import { Dashboard } from '@dashboards/models/dashboard.model';
import { Observable } from 'rxjs';
import { DashboardStorageSettings } from '../models/dashboard-storage-settings.model';


export interface DashboardStorageBaseService {
  
  setSettings(specificSettings: any): void;

  getDashboards(): Observable<Dashboard[]>;
  saveDashboards(dashboards: Dashboard[]): Observable<Dashboard[]>;
  saveDashboard(dashboard: Dashboard): Observable<Dashboard>;
  removeDashboard(id: number): Observable<void>;
  
  openModalConfig(): Observable<any>;
  
}
