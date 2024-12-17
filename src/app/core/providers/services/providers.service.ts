import { Injectable, Injector, inject } from '@angular/core';
import { HistoryValue } from '@dashboards/features/charts/models/history-value.model';
import { CommandValue } from '@dashboards/models/command-value.model';
import { Command } from '@dashboards/models/command.model';
import { DashboardsEvent } from '@dashboards/services/dashboard-manager.service';
import { Observable, Subject, map, of, tap } from 'rxjs';
import { CommandFormElementConfig } from '../models/command-form-element';
import { ProviderSettings } from '../models/provider-settings.model';
import { ProviderBaseService } from './provider-base.service';
import { ProviderSettingsService } from './provider-settings.service';

@Injectable({
  providedIn: 'root',
})
export class ProvidersService {
  static PROVIDER_SEPARATOR = ' - ';

  protected _injector = inject(Injector);
  protected providerSettingsService = inject(ProviderSettingsService);

  protected _providers: { [code: string]: ProviderBaseService } = ({} = {});

  get providers(): ProviderBaseService[] {
    return Object.values(this._providers);
  }

  constructor() {}

  initProviders(): Observable<ProviderBaseService[]> {
    this._providers = {};

    // -- recupération des providers configurés
    return this.providerSettingsService.getProvidersSettings().pipe(
      map((allSettings) => {
        allSettings.forEach((psettings) => {
          try {
            this.getInstanceOf(psettings);
          } catch (err) {
            console.error(err);
          }
        });

        return this.providers;
      })
    )
  }

  // removeProvider(code: string) {
  //   delete this._providers[code];
  //   const index = this.providersSettings.findIndex((p) => p.code === code);
  //   if (index >= 0) {
  //     this.providersSettings.splice(index, 1);
  //   }
  // }

  getProvider(providerCode: string): ProviderBaseService | undefined {
    let provider = this._providers[providerCode];
    return provider;
  }

  getHistory(command: Command, start: Date, end: Date = new Date()): Observable<HistoryValue[]> {
    const provider = this.getProvider(command.providerCode);
    if (provider) {
      return provider.getHistory(command.commandRef, start, end);
    }

    return of([]);
  }

  getValue(command: Command): Observable<CommandValue> {
    const provider = this.getProvider(command.providerCode);
    if (provider) {
      return provider.getValue(command.commandRef);
    }

    return of(new Command());
  }

  openCommandPickerModal(element: CommandFormElementConfig, value: Command): Observable<Command> {
    const cvSubject = new Subject<Command>();

    let providerCode = value?.providerCode;
    if (!providerCode) {
      // -- TODO: multiple providers => show popup selector
      if (this._providers) {
        const currentProviders = Object.keys(this._providers);
        if (currentProviders.length === 1) {
          providerCode = currentProviders[0];
        }
      }
    }

    const provider = this.getProvider(providerCode);
    if (provider) {
      provider.openCommandPickerModal(element, value).subscribe((cv: Command) => {
        cvSubject.next(cv);
      });
    }

    return cvSubject.asObservable();
  }

  openConfigurationModal(psettings: ProviderSettings): Observable<ProviderSettings> {
    const result = new Subject<ProviderSettings>();
    this.getInstanceOf(psettings)
      .openConfigurationModal()
      .subscribe((newSettings) => {
        this.providerSettingsService.saveProviderSettings(newSettings).subscribe(() => {
          result.next(newSettings);
        });
      });

    return result.asObservable();
  }

  broadcastDashboardsEvent(event: DashboardsEvent) {
    if (this._providers) {
      Object.keys(this._providers).forEach((providerCode) => {
        this._providers[providerCode].onDashboardEvent(event);
      });
    }
  }

  deleteIntanceOf(providerCode: string): void {
    if (this._providers[providerCode]) {
      this._providers[providerCode].OnDestroy();
      delete this._providers[providerCode];

    }
  }

  getInstanceOf(psettings: ProviderSettings): ProviderBaseService {
    const type = psettings.type;
    const code = psettings.code;

    if (this._providers[code]) {
      return this._providers[code];
    }

    const providerDefinition = this.providerSettingsService.availableProviders.find((pf) => pf.providerType === type);
    if (providerDefinition) {
      const providerInjector = Injector.create({ providers: [providerDefinition.useClass], parent: this._injector });
      const provider = providerInjector?.get(providerDefinition.useClass);
      if (provider) {
        psettings.label = providerDefinition.providerName;
        provider.setSettings(psettings);

        this._providers[code] = provider;
        return this._providers[code];
      }
    }

    throw new Error('getInstanceOf : no provider with type ' + type);
  }
}
