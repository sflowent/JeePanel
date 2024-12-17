import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { DashboardStorageSettingsService } from '@app/core/dashboards-storage/services/dashboard-storage-settings.service';
import { DashboardStorageService } from '@app/core/dashboards-storage/services/dashboard-storage.service';
import { CommandFormElementConfig } from '@app/core/providers/models/command-form-element';
import { ProviderSettings } from '@app/core/providers/models/provider-settings.model';
import { ProviderBaseService } from '@app/core/providers/services/provider-base.service';
import { ModalService } from '@app/shared/features/modals/services/modal.service';
import { HistoryValue } from '@dashboards/features/charts/models/history-value.model';
import { CommandValue } from '@dashboards/models/command-value.model';
import { Command } from '@dashboards/models/command.model';
import { DashboardsEvent } from '@dashboards/services/dashboard-manager.service';
import { Observable, ReplaySubject, Subject, map, of } from 'rxjs';
import { JeedomCommandPickerModalComponent } from '../modals/jeedom-command-picker-modal/jeedom-command-picker-modal.component';
import { JeedomConfigurationModalComponent } from '../modals/jeedom-configuration-modal/jeedom-configuration-modal.component';
import { JeedomCmd_http } from '../models/http-command';
import { JeedomConfig } from '../models/jeedom-config';
import { jeedomHistoryValue_rpc } from '../models/rpc-command';
import { JeedomResource } from '../resources/jeedom.resource';
import { JeedomPresetsService } from './jeedom-presets.service';
import { JeedomDataLoadingStatus, JeedomService } from './jeedom.service';

@Injectable()
export class JeedomProviderService implements ProviderBaseService, OnDestroy {
  static PROVIDER_NAME = 'jeedom';

  jeedomService: JeedomService;
  jeedomResource: JeedomResource;

  jeedomPresets = inject(JeedomPresetsService);

  modalService = inject(ModalService);
  dashboardsRepository = inject(DashboardStorageService);
  dashboardStoringSettingsService = inject(DashboardStorageSettingsService);
  httpClient = inject(HttpClient);

  lastCommandSelected: JeedomCmd_http | null = null;
  settings: JeedomConfig = new JeedomConfig();

  constructor() {
    this.jeedomResource = new JeedomResource(this.httpClient);
    this.jeedomService = new JeedomService(this.jeedomResource);

    this.setSettings(new JeedomConfig());
  }

  ngOnDestroy(): void {
    this.OnDestroy();
  }


  /************************ */
  
  OnDestroy(): void {
    debugger;
    this.jeedomService.stopLongPolling();  
  }

  setSettings(providerSettings: ProviderSettings): ProviderSettings {
    this.settings = new JeedomConfig(providerSettings);

    this.jeedomResource.settings = this.settings;
    this.jeedomService.settings = this.settings;

    return this.settings;
  }

  getSettings(): JeedomConfig {
    return this.settings;
  }

  onDashboardEvent(event: DashboardsEvent): void {

    if (event === DashboardsEvent.Close) {
      this.jeedomService.stopLongPolling();
      return;
    }

    if (event === DashboardsEvent.Edit) {
      this.jeedomService.stopLongPolling();
    }

    if (!this.settings.isValid()) {
      console.error(`Provider ${this.settings.code} settings invalid`);
      return;
    }

    this.jeedomService.loadJeedomData().subscribe((result) => {
      if (result.status === JeedomDataLoadingStatus.loaded) {
        if (event === DashboardsEvent.View) {
          this.jeedomService.registerLongPolling();
        }
      } else if (result.status === JeedomDataLoadingStatus.error) {
        console.error('Error loading jeedom items... retrying in 5 seconds', result.error);
        setTimeout(() => this.onDashboardEvent(event), 5000);
      }
    });
  }

  getCommandByLabelId(labelId: string): Command | null {
    const command = this.jeedomService.commands.find((c) => c.labelId.trim().toLowerCase() === labelId.trim().toLowerCase());
    if (command) {
      const result = command.toCommand(this.settings.code);
      return result;
    }

    return null;
  }

  getCommandLabelId(value: Command): string | null {
    if (value?.commandRef) {
      return this.jeedomService.getJeedomCommand(value.commandRef)?.labelId || null;
    }

    return null;
  }

  openCommandPickerModal(element: CommandFormElementConfig, command: Command | undefined): Observable<Command> {
    const cvSubject = new Subject<Command>();
    const dialogRef = this.modalService.open(JeedomCommandPickerModalComponent, {
      jeedomService: this.jeedomService,
      element: element,
      commandId: command?.commandRef || this.lastCommandSelected?.id,
    });

    dialogRef.afterClosed().subscribe((newCommand: JeedomCmd_http) => {
      if (newCommand) {
        this.lastCommandSelected = newCommand;
        const result = newCommand.toCommand(this.settings.code);
        cvSubject.next(result);
        this.jeedomPresets.presetForm(this.jeedomService, element, newCommand);
      }
    });

    return cvSubject.asObservable();
  }

  openConfigurationModal(): Observable<JeedomConfig> {
    const oldCode = this.settings.code;
    const confSubject = new Subject<JeedomConfig>();
    const dialogRef = this.modalService.open(JeedomConfigurationModalComponent, {
      settings: this.settings,
    });

    dialogRef.afterClosed().subscribe((settings: JeedomConfig) => {
      if (settings) {
        this.setSettings(settings);
        if (oldCode !== this.settings.code) {
          const jeedomStorageSettings = this.dashboardStoringSettingsService.getStorageSettings('jeedom');
          if (jeedomStorageSettings && jeedomStorageSettings.data?.command?.providerCode === oldCode) {
            jeedomStorageSettings.data.command.providerCode = this.settings.code;
            this.dashboardStoringSettingsService.saveStorageSettings(jeedomStorageSettings).subscribe(() => {
              confSubject.next(this.settings);
            });

            return;
          }
        }

        confSubject.next(this.settings);
      }
    });

    return confSubject.asObservable();
  }

  onCommandUpdate(command: Command): Observable<CommandValue> {
    if (!this.jeedomService.commandsSubSource[command.commandRef]) {
      this.jeedomService.commandsSubSource[command.commandRef] = new ReplaySubject<CommandValue>(1);
    }

    return this.jeedomService.commandsSubSource[command.commandRef].asObservable();
  }

  /**
   * Sends command to Jeedom
   */
  sendCmd(command: Command, value: any): void {
    var cmd = this.jeedomService.getJeedomCommand(command.commandRef);
    if (cmd == null) {
      return;
    }

    let transactionId = new Date().getTime();
    //self.loadingCmd[item] = transactionId;

    this.jeedomResource.sendCmd(cmd, value).subscribe({
      next: (result: any) => {},
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  getHistory(commandRef: string, start: Date, end: Date): Observable<HistoryValue[]> {
    return this.jeedomResource.getHistory(commandRef, start, end).pipe(
      map((values: jeedomHistoryValue_rpc[]) => {
        const history: HistoryValue[] = [];
        return values.map((v) => v.toHistoryValue());
      }),
    );
  }

  getValue(commandRef: string): Observable<CommandValue> {
    const jeedomCmd = this.jeedomService.commands.find((c) => c.id === commandRef);
    const command = jeedomCmd?.toCommandValue() || new CommandValue();
    command.providerCode = this.settings.code;

    return of(command);
  }

  /*************************** */
}
