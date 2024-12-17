import { Routes } from '@angular/router';
import { DashboardsPageComponent } from '@dashboards/pages/dashboards-page/dashboards-page.component';
import { LocalConfigPage } from './settings/pages/local-config/local-config-page.component';
import { SettingsPage } from './settings/pages/settings-page/settings-page.component';

export const routes: Routes = [
  {
    pathMatch: 'full',
    path: '',
    redirectTo: 'dashboards'
  },
  {
    pathMatch: 'full',
    path: 'dashboards',
    component: DashboardsPageComponent
  },
  {
    pathMatch: 'full',
    path: 'dashboards/:code',
    component: DashboardsPageComponent
  },
  {
    path: 'settings',
    component: SettingsPage
  },
  {
    path: 'settings/localconfig',
    component: LocalConfigPage
  }
];
