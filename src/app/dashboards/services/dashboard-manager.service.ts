import { inject, Injectable } from '@angular/core';
import { DashboardStorageService } from '@app/core/dashboards-storage/services/dashboard-storage.service';
import { ProvidersService } from '@app/core/providers/services/providers.service';
import { JEE_SETTINGS } from '@app/core/settings/models/jeepanel-settings.model';
import { Observable, of, ReplaySubject, Subject, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CommandValue } from '../models/command-value.model';
import { Dashboard } from '../models/dashboard.model';
import { WidgetBaseSettings } from '../models/widget-settings.model';
import { Command } from '@dashboards/models/command.model';

export enum DashboardsEvent {
  Edit,
  View,
  Close
}

@Injectable({
  providedIn: 'root'
})
export class DashboardManagerService {


  private dasboardsUpdatedSubject: Subject<Dashboard[]> = new Subject<Dashboard[]>();

  private dashboardsEventSource: Subject<DashboardsEvent> = new Subject<DashboardsEvent>();
  onDashboardsEvent = this.dashboardsEventSource.asObservable();

  persistantDashboardStorage = inject(DashboardStorageService);
  providersService = inject(ProvidersService);
  jeeSettings = inject(JEE_SETTINGS);

  private get _dashboards(): Dashboard[]{
    return this.jeeSettings.dashboards;
  }

  constructor() {
  }

  Close() {
    this.providersService.broadcastDashboardsEvent(DashboardsEvent.Close);
  }

  getRootDashboard(): Observable<Dashboard> {
    let rootDashboard = this._dashboards?.find(d => d.default);

    if (!rootDashboard) {
      rootDashboard = new Dashboard({
        default: true,
        settings: { title: 'Dashboard', code: "root"}
      });
      return this.persistantDashboardStorage.saveDashboard(rootDashboard).pipe(
        tap(rd => {
          this._dashboards.push(rd);
          return rd;
        })
      );
    }

    return of(rootDashboard);
  }

  onDashboardsUpdated(): Observable<Dashboard[]> {
    return this.dasboardsUpdatedSubject.asObservable();
  }

  getDashboard(dashboardCode: string): Observable<Dashboard> {
    const dashboardJson = this._dashboards.find(x => x.hasCode(dashboardCode));
    const dashboard = new Dashboard(dashboardJson);
    //dashboard.widgets = this._dashboards1_ws;

    return of(dashboard);
  }

  saveDashboard(dashboard: Dashboard): Observable<Dashboard> {

    if (!dashboard){
      return throwError(() => new Error('dashboard is null'));
    }

    const result = new ReplaySubject<Dashboard>(1);

    this.persistantDashboardStorage.saveDashboard(dashboard).subscribe((newDashboard: Dashboard) => {
      const existingIndex = this._dashboards.findIndex(x => x.id === dashboard.id);

      if (existingIndex != -1) {
        this._dashboards[existingIndex] = newDashboard;
      } else {
        this._dashboards.push(newDashboard);
      }

      this.dasboardsUpdatedSubject.next(this._dashboards);
      result.next(newDashboard);
    });

    return result.asObservable();
  }

  removeDashboard(id: number): Observable<void> {
    const index = this._dashboards.findIndex(d => d.id === id)

    if (index < 0){
      return new Observable<void>();
    }

    return this.persistantDashboardStorage.removeDashboard(id).pipe(
      tap(() => {
          this._dashboards.splice(index, 1);

        this.dasboardsUpdatedSubject.next(this._dashboards);
      })
    )
  }

  /******************************************
    Current DashBoard
  */

  private _dashboard: Dashboard = new Dashboard();

  private commandsSub: {
    [key: string]: { [key: string]: ReplaySubject<Command> };
  } = {};

  get dashboard(): Dashboard {
    return this._dashboard;
  }

  set dashboard(dashboard: Dashboard) {
    this._dashboard = dashboard;
    this.init();
  }

  addWidget(widget: WidgetBaseSettings) {
    this.dashboard.widgets?.push(widget);
  }

  removeWidget(widget: WidgetBaseSettings) {
    if (this.dashboard.widgets) {
      const index = this.dashboard.widgets.findIndex(w => w && w === widget);

      if (index >= 0) {
        this.dashboard.widgets.splice(index, 1);
      }
    }
  }

  private init() {
    this.reset();
  }

  /**
   *  Update command value
   * @param command
   * @param value
   */
  broadcastCommandValue(command: Command, value: any) {
    if (this.commandsSub[command.providerCode] && this.commandsSub[command.providerCode][command.commandRef]) {
      this.commandsSub[command.providerCode][command.commandRef].next(command);
    }
  }

  /**
   * Subscribe command value
   * @param command
   * @returns
   */
  onCommandUpdate(command: Command): Observable<CommandValue> {
    const provider = this.providersService.getProvider(command.providerCode);
    if (provider) {
      return provider.onCommandUpdate(command);
    }

    return throwError(() => new Error('unknown provider'));
  }

  sendCmd(command: Command, value: any = null) {
    const provider = this.providersService.getProvider(command.providerCode);
    if (provider) {
      return provider.sendCmd(command, value);
    }

    return throwError(() => new Error('unknown provider'));
  }

  getHistory(command: Command, start: Date, end: Date): Observable<any> {
    const provider = this.providersService.getProvider(command.providerCode);
    if (provider) {
      return provider.getHistory(command.commandRef, start, end);
    }

    return throwError(() => new Error('unknown provider'));
  }

  broadcastDashboardEvent(event: DashboardsEvent) {
    this.dashboardsEventSource.next(event);
  }

  reset() {
    //Object.values(this.commandsSub).forEach((x) => x && x.unsubscribe());
    this.commandsSub = {};
  }
}
