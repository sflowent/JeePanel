import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { JeedomCmd_http, JeedomObject_http } from '../models/http-command';
import { JeedomConfig } from '../models/jeedom-config';
import { jeedomGetHistoryResult_rpc, jeedomHistoryValue_rpc } from '../models/rpc-command';


export class JeedomResource {
  pollingUpdateRunning: boolean = false;
  lastTime: number = 0;

  public settings = new JeedomConfig();

  protected _httpClient: HttpClient;
  loadingItems: any;
  equipments = {};
  objects: any;
  commands: any[] =[];

  private _specificParamNameDict = {
    numeric: 'slider'
  };

  constructor(httpClient: HttpClient) {
    this._httpClient = httpClient;
  }

  private _getJeedomUri() {
    var uri = this.settings.url + '/core/api/jeeApi.php?apikey=' + this.settings.apiKey;
    return uri;
  }

  sendCmd(cmd: any, value: any): Observable<any> {
    var uri = this._getJeedomUri() + '&type=cmd&id=' + cmd.id;
    if (value !== null && value != undefined) {
      var name = cmd.subType;

      uri += '&' + name + '=' + value;
    }

    uri += '&nocache=' + new Date().getTime();
    return this._httpClient.get<any>(uri);
  }

  loadItems(): Observable<JeedomObject_http[]> {
    var uri = this._getJeedomUri() + '&type=fullData&nocache=' + new Date().getTime();
    return this._httpClient.get<JeedomObject_http[]>(uri).pipe(
      map((objs_json: JeedomObject_http[]) => {
        const objets: JeedomObject_http[] = [];
        objs_json.forEach((obj: JeedomObject_http) => objets.push(new JeedomObject_http(obj)));

        return objets;
      })
    );
  }

  setCommandValue(cmdId: string, value:string){

    var uri = this._getJeedomUri() + '&nocache=' + new Date().getTime();
    const formData = new FormData();
    formData.append('type', 'cmd');
    formData.append('id', cmdId);
    formData.append('value', value);

    return this._httpClient.post(uri, formData).pipe(map((result) => {
      return result;
    }));
  }

  getCommandValue(cmdId: string): Observable<string>{
    var uri = this._getJeedomUri() + '&type=cmd&id='+ cmdId +'&nocache=' + new Date().getTime();

    return this._httpClient.get(uri, {responseType:"text"}).pipe(
      map((result: string) => {
        return result;
      })
    );
  }

  getHistory(cmdId: string, start: Date, end: Date): Observable<jeedomHistoryValue_rpc[]> {

    const startDate = this._toLocalIsoTime(start);
    const endDate = this._toLocalIsoTime(end);

    var uri = this.settings.url + '/core/api/jeeApi.php';
    var data = {
      jsonrpc: '2.0',
      method: 'cmd::getHistory',
      params: {
        apikey: this.settings.apiKey,
        id: cmdId,
        startTime: startDate ?? new Date().toISOString(),
        endTime: endDate ?? new Date().toISOString()
      }
    };

    return this._httpClient
      .post<jeedomGetHistoryResult_rpc>(uri, data, {
        headers: {
          'Content-Type': 'text/plain'
        },
        responseType: 'json'
      })
      .pipe(
        map((hv_json) => {
          const values: jeedomHistoryValue_rpc[] = [];
          hv_json.result.forEach((hv:any) => values.push(new jeedomHistoryValue_rpc(hv)));

          return values;
        })
      );
  }

  eventChanges() {
    var uri = this.settings.url + '/core/api/jeeApi.php';
    var data = {
      jsonrpc: '2.0',
      method: 'event::changes',
      params: {
        apikey: this.settings.apiKey,
        longPolling: 30, // un peu mystic
        datetime: this.lastTime
      }
    };

    return this._httpClient
      .post(uri, data, {
        headers: {
          'Content-Type': 'text/plain'
        },
        responseType: 'json'
      })
      .pipe(
        tap((raw: any) => {
          this.lastTime = raw.result.datetime;
        })
      );
  }

  _toLocalIsoTime(date: Date): string{

    date ??= new Date();

    var tzoffset = date.getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(date.getTime() - tzoffset)).toISOString().slice(0, -1);

    return localISOTime;
  }
}
