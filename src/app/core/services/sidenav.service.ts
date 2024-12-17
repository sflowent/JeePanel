import { Injectable } from '@angular/core';
import { MatDrawerContainer, MatSidenav } from '@angular/material/sidenav';
import { ReplaySubject, Subject } from 'rxjs';
import { LocalDashboardStorage } from '../dashboards-storage/local-dashboard-storage';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Injectable({
  providedIn: 'root',
})
export class SideNavService {

  static PINNED_KEY = "jee-panel-sidenav";

  hasBackdrop = true;
  pinned = false;

  private _onPinned = new ReplaySubject<boolean>(1);

  private _sidenav?: MatSidenav;
  private _drawerContainer?: MatDrawerContainer;

  constructor() {}

  configure(sidenav: MatSidenav, drawerContainer: MatDrawerContainer) {
    this._sidenav = sidenav;
    this._drawerContainer = drawerContainer;

    const pinned = coerceBooleanProperty(localStorage.getItem(SideNavService.PINNED_KEY + '-pinned'));
    if (pinned) {
      this.pinned = pinned;
      this._sidenav.open().then(() => {
        this._setAlwaysOpened();

        setTimeout(() => {
          this._onPinned.next(this.pinned);
        });
      });
    }
  }

  animationEnd() {
    return this._sidenav?._animationEnd;
  }

  onPinned() {
    return this._onPinned.asObservable();
  }

  togglePin() {
    if (!this._sidenav) {
      return;
    }

    if (this.pinned) {
     this._setFloated();
    } else {
      this._setAlwaysOpened();
    }

    this.pinned = !this.pinned;

    localStorage.setItem(SideNavService.PINNED_KEY + '-pinned', this.pinned.toString());
    setTimeout(() => {
      this._onPinned.next(this.pinned);
    });
  }

  _setAlwaysOpened(){
    this._sidenav!.mode = 'side';
    this._sidenav!.disableClose = true;
    this.hasBackdrop = false;
  }

  _setFloated(){
    this._sidenav!.mode = 'over';
    this._sidenav!.disableClose = false;
    this.hasBackdrop = true;
  }
}
