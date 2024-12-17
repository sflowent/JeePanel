import { Injectable } from '@angular/core';
import { Dashboard } from '@dashboards/models/dashboard.model';
import { Observable, of } from 'rxjs';
import { DashboardStorageBaseService } from './services/dashboard-storage-base.service';
import { DashboardStorageSettings } from './models/dashboard-storage-settings.model';

@Injectable({
  providedIn: 'root'
})
export class LocalDashboardStorage implements DashboardStorageBaseService {

  static DASHBOARDS_KEY = 'jee-panel-dashboards';
  settings!: DashboardStorageSettings;

  setSettings(settings: DashboardStorageSettings): void {
    this.settings = settings;
    
  }

  openModalConfig(): Observable<DashboardStorageSettings> {
    return of(new DashboardStorageSettings())
  }

  removeDashboard(id: number): Observable<void> {
    const dashboards = this._getDashboards();

    const index = dashboards.findIndex(d => d.id === id)
    if (index>=0){
      dashboards.splice(index, 1);
      this._saveDashboards(dashboards);
    }

    return of(void 0);
  }

  getDashboards(): Observable<Dashboard[]> {
    const dashboards = this._getDashboards();
    return of(dashboards);
  }

  saveDashboards(dashboards: Dashboard[]): Observable<Dashboard[]> {

    dashboards.forEach((d) => this._prepareDashboard(d, dashboards));

    this._saveDashboards(dashboards);

    return of(dashboards);
  }

  saveDashboard(dashboard: Dashboard): Observable<Dashboard> {
   
    const dashboards = this._getDashboards();

    this._prepareDashboard(dashboard, dashboards);

    this._saveDashboards(dashboards);

    return of(dashboard);
  }

  private _getDashboards(): Dashboard[]{
    const dashboardStr = localStorage.getItem(LocalDashboardStorage.DASHBOARDS_KEY) || '[]';
    const dashboardsJSon: Dashboard[] = JSON.parse(dashboardStr);

    const dashboards = dashboardsJSon.map(d => new Dashboard(d));

    return dashboards;
  }

  private _saveDashboards(dashboards: Dashboard[]){
    localStorage.setItem(LocalDashboardStorage.DASHBOARDS_KEY, JSON.stringify(dashboards));
  }

  private _prepareDashboard(dashboard: Dashboard, dashboards: Dashboard[]){

    if (!dashboard.id) {
      const maxId = Math.max(0, ...(dashboards?.map(d => d.id) || [0]));
      dashboard.id = maxId + 1;
      dashboards.push(dashboard);
    } else {
      const existingIndex = dashboards.findIndex(x => x.id === dashboard.id);
      if (existingIndex != -1) {
        dashboards[existingIndex] = dashboard;
      }
    }
  }

}