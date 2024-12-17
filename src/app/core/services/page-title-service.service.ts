import { Injectable, signal } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';

export class PageAction {
  icon?: string;
  text?: string;
  action?: any;
  actions?: PageAction[];
  mobilePinned?: boolean = false
}

@Injectable({
  providedIn: 'root'
})
export class PageTitleService {
  hideExtra = false;

  editMode = signal(false);

  private pageTitleSubject: Subject<string> = new ReplaySubject<string>(1);
  pageTitle$: Observable<string> = this.pageTitleSubject.asObservable().pipe(delay(0)); // prevent ExpressionChangedAfterItHasBeenCheckedError

  private _pageTitle: string = '';
  set pageTitle(pageTitle: string) {
    this._pageTitle = pageTitle;
    this.pageTitleSubject.next(pageTitle);
  }
  get pageTitle() {
    return this._pageTitle;
  }

  private actionsSubject: Subject<PageAction[]> = new ReplaySubject<PageAction[]>(1);
  actions$: Observable<PageAction[]> = this.actionsSubject.asObservable().pipe(delay(0)); // prevent ExpressionChangedAfterItHasBeenCheckedError
  set actions(actions: PageAction[]) {
    this._actions = actions;
    this.actionsSubject.next(actions);
  }
  get actions() {
    return this._actions;
  }
  private _actions?: PageAction[];
}
