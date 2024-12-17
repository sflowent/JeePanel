import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export const MOBILE_BREAKPOINT = 600;
const TABLET_BREAKPOINT = 960;

@Injectable({
  providedIn: 'root'
})
export class MediaQueryService {
  // private mobileMediaMatcher: MediaQueryList = matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
  // private tabletMediaMatcher: MediaQueryList = matchMedia(`(max-width: ${TABLET_BREAKPOINT - 1}px)`);
  // public mobileObservable$ = new Subject<boolean>();

  constructor() {
    // this.mobileMediaMatcher.onchange = e => {
    //   this.mobileObservable$.next(true);
    // };
  }

  isMobile(): boolean {
    return false; //this.mobileMediaMatcher.matches;
  }

  isTablet(): boolean {
    return false ;//this.tabletMediaMatcher.matches && !this.mobileMediaMatcher.matches;
  }

  isDesktop(): boolean {
    return true; //!this.isMobile() && !this.isTablet();
  }

  cssClass(): string {
    return "";
    //return this.isDesktop() ? 'desktop' : this.isTablet ? 'tablet' : 'mobile';
  }
}
