import { CommandValue } from '@dashboards/models/command-value.model';
import { Observable, ReplaySubject, Subject, finalize, of } from 'rxjs';
import { JeedomCmd_http, JeedomEquipement_http, JeedomObject_http } from '../models/http-command';
import { JeedomConfig } from '../models/jeedom-config';
import { JeedomResource } from '../resources/jeedom.resource';

export class JeedomDataLoadingResult{
  status: JeedomDataLoadingStatus;
  error: any
}

export enum JeedomDataLoadingStatus{
loading,
loaded,
error
}

export class JeedomService {
  static PROVIDER_NAME = 'jeedom';

  jeedomResource: JeedomResource;

  settings: JeedomConfig = new JeedomConfig();
  reconnecting: boolean = false;
  loadingItems: any;

  equipments: JeedomEquipement_http[] = [];
  objects: JeedomObject_http[] = [];
  commands: JeedomCmd_http[] = [];

  pollingUpdateRunning: any;

  commandsSubSource: { [key: string]: ReplaySubject<CommandValue> } = {};

  private _longPollingNodeJSTimeout: NodeJS.Timeout | null = null;
  private _stopLongPolling: boolean = false;

  constructor(jeedomResource: JeedomResource) {
    this.jeedomResource = jeedomResource;
  }

  loadJeedomData(): Observable<JeedomDataLoadingResult> {

    const result = new JeedomDataLoadingResult()

    if (this.loadingItems) {
      result.status = JeedomDataLoadingStatus.loading;
      return of(result);
    }

    const resultSubject = new Subject<JeedomDataLoadingResult>();

    this.loadingItems = true;
    this.jeedomResource.loadItems().subscribe({
      next: (objects: JeedomObject_http[]) => {
        this.loadingItems = false;
        if (Array.isArray(objects)) {
          console.log('Loaded ' + objects.length + ' jeedom Objects');
          this.reconnecting = false;

          this.objects = objects;
          this.equipments = objects.flatMap(o => o.eqLogics);
          this.commands = this.equipments.flatMap(e => e.cmds);

          this.commands.forEach(cmd => {
            cmd.labelId = '#[' + cmd.equipment.object.name + '][' + cmd.equipment.name + '][' + cmd.name + ']#';
            if (cmd.type === 'info') {
              this._updateCommandValue(cmd.toCommandValue());
            }
          });

          console.log('Loaded ' + Object.keys(this.equipments).length + ' jeedom Equipments');
          console.log('Loaded ' + this.commands.length + ' jeedom Commands');
          //this.registerLongPolling();
          result.status = JeedomDataLoadingStatus.loaded;
          return resultSubject.next(result);
        } else {
          console.error('Items not found');

          this.loadingItems = false;
          this.objects = [];
          this.commands = [];
          //setTimeout(() => this.loadJeedomData(), 5000);
          result.error = "Items not found";
          result.status = JeedomDataLoadingStatus.error;
          return resultSubject.next(result);
        }
        
      },
      error: (err: any) => {
        this.loadingItems = false;
        result.error = err;
        result.status = JeedomDataLoadingStatus.error;
        return resultSubject.next(result);
      }
    });

    return resultSubject;
  }

  registerLongPolling() {
    if (this.pollingUpdateRunning) {
      return;
    }

    this.pollingUpdateRunning = true;
    this.jeedomResource
      .eventChanges()
      .pipe(
        finalize(() => {
          this.pollingUpdateRunning = false;
          if (this._stopLongPolling) {
            this._stopLongPolling = false;
            return;
          }
          this._longPollingNodeJSTimeout = setTimeout(() => this.registerLongPolling(), this.settings.waitTimeBetweenPolls ?? 1000 );
        })
      )
      .subscribe({
        next: (raw: any) => {
          var updates = raw.result.result;
          updates.forEach((update: any) => {
            this._updateCommandValue(this._rpcCommandToCommandValue(update.option));
          });
        },
        error: error => console.log(error)
      });
  }

  stopLongPolling() {
    if (this._longPollingNodeJSTimeout) {
      clearTimeout(this._longPollingNodeJSTimeout);
      this._stopLongPolling = true;
    }
  }

  getJeedomCommand(commandRef: string): JeedomCmd_http | null {
    const cmd = this.commands.find(c => c.id === commandRef);
    return cmd || null;
  }

  private _updateCommandValue(cmd: CommandValue) {

    const command = this.commands.find(x => x.id === cmd.commandRef);
    if (command){
      command.value = cmd.value;
    }

    const cmdSub = this.commandsSubSource[cmd.commandRef];
    if (cmdSub) {
      cmdSub.next(cmd);
    }
  }

  private _rpcCommandToCommandValue(rpcCommand: any): CommandValue {
    return new CommandValue({
      providerCode: JeedomService.PROVIDER_NAME,
      commandRef: rpcCommand.cmd_id,
      value: rpcCommand.value,
      unit: rpcCommand.unit,
    });
  }
}
