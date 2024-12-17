import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IconSet, IconSetInfo } from '../models/iconset.model';

@Injectable({
  providedIn: 'root'
})
export class IconService {
  iconPath = 'assets/icons';
  iconsets: IconSet[] = [
    { id: 'freepik-household', name: 'Builtin: Freepik Household', type: 'builtin', colorize: true },
    { id: 'freepik-gadgets', name: 'Builtin: Freepik Gadgets', type: 'builtin', colorize: true },
    { id: 'freepik-housethings', name: 'Builtin: Freepik House Things', type: 'builtin', colorize: true },
    { id: 'smarthome-set', name: 'Builtin: Smart Home Set', type: 'builtin', colorize: true },
    { id: 'eclipse-smarthome', name: 'Builtin: Eclispe Smarthome', type: 'builtin', colorize: true }

  ];

  constructor(private http: HttpClient) {}

  getIconUrl(iconset: string, icon: string) {
    return 'assets/icons/' + iconset + '/' + icon + '.svg';
  }

  getIcons(iconset: string): Observable<IconSetInfo> {
    return this.http.get<IconSetInfo>('assets/icons/' + iconset + '.list.json').pipe(
      map(info => {
        info.basePath = 'assets/icons/' + iconset + '/';

        return info;
      })
    );
  }
}
