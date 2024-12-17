import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, inject, InjectionToken, provideAppInitializer, Type } from '@angular/core';
import { provideRouter } from '@angular/router';

import { DOCUMENT, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAngularSvgIcon } from 'angular-svg-icon';
import { ColorPickerModule } from 'ngx-color-picker';
import { routes } from './app.routes';
import { LocalDashboardStorage } from './core/dashboards-storage/local-dashboard-storage';
import { ConfigurationService } from './core/services/configuration.service';
import { APP_CONFIG, JEE_SETTINGS } from './core/settings/models/jeepanel-settings.model';
import { JeedomDashboardRepositoryService } from './providers/jeedom/storage/jeedom-dashboard-storage.service';
import { NoCacheInterceptor } from './shared/interceptors/nocache.interceptor';
import { ProviderDefinition } from './core/providers/models/provider-definition.model';
import { ProviderBaseService } from './core/providers/services/provider-base.service';
import { JeedomProviderService } from './providers/jeedom/services/jeedom-provider.service';
import { provideServiceWorker } from '@angular/service-worker';



export class StorageDefinition {
  storageType!: string;
  storageName!: string;
  description?: string;
  useClass!: Type<any>;
}

export const PROVIDERS_DEFINITION: ProviderDefinition[] = [
  {
    providerType: 'jeedom',
    providerName: 'Jeedom',
    provide: new InjectionToken<ProviderBaseService>('jeedom'),
    useClass: JeedomProviderService,
  },
];

export const PERSISTANT_STORAGE_DEFINITION: {[code:string]: StorageDefinition} = {
  "local":  {
    storageType: 'local',
    storageName: 'Local Storage',
    description: "Les dashboards sont enregistrés pour ce navigateur et cet appareil uniquement. Ils seront conservées tant que vous ne nettoierez pas les données historiques du navigateur.",
    useClass: LocalDashboardStorage
  },
  "jeedom":  {
    storageType: 'jeedom',
    storageName: 'Jeedom',
    description: "Les dashboards sont enregistrés dans une commande Jeedom. Au moins un fournisseur Jeedom doit être configuré.",
    useClass: JeedomDashboardRepositoryService
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(withFetch()),
    provideRouter(routes),
    //provideClientHydration(),
    provideServiceWorker("/ngsw-worker.js"),
    provideAngularSvgIcon(),
    importProvidersFrom(ColorPickerModule),
    {
      // Pour eviter de modifier URL rewrite de Jeedom
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    {
      provide: Window,
      useFactory: (document: Document) => document.defaultView,
      deps: [DOCUMENT],
    },
    provideAppInitializer(() => inject(ConfigurationService).loadConfig(PROVIDERS_DEFINITION)),
    {
      provide: JEE_SETTINGS,
      useFactory: () => APP_CONFIG,
      deps: [APP_INITIALIZER],
    },
    { provide: HTTP_INTERCEPTORS, useClass: NoCacheInterceptor, multi: true },
  ],
};
