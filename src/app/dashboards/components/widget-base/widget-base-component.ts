import { Component, ElementRef, inject, input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
    template: '',
    standalone: false
})
export class WidgetBaseComponent implements OnDestroy {

  settings = input<any>(null);
  protected destroy: Subject<void> = new Subject<void>();

  elementRef = inject(ElementRef);
  
  ngOnDestroy() {
    this.destroy.next();
  }

  onResize() {
    
  }
}
