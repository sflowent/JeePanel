
import {
  AfterViewInit,
  Component,
  OnChanges,
  OnInit,
  Renderer2,
  ViewEncapsulation,
  input,
  model,
  output,
  viewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlider, MatSliderModule } from '@angular/material/slider';
import { JeeBigSliderDirective } from './directives/jee-big-slider.directive';
import { JeeTicksLabelSliderDirective } from './directives/jee-ticks-label-slider.directive';

@Component({
    selector: 'jee-slider',
    templateUrl: './jee-slider.component.html',
    styleUrls: ['./jee-slider.component.scss', './jee-big-slider.scss', './jee-ticks-label.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [MatSliderModule, FormsModule, JeeBigSliderDirective, JeeTicksLabelSliderDirective]
})
export class JeeSliderComponent implements OnInit, AfterViewInit, OnChanges {
  readonly bigSlider = input(false);

  readonly min = input(0);

  readonly max = input(100);
  invert = false;

  readonly disabled = input(false);

  readonly step = input(1);

  readonly thumbLabel = input(true);

  readonly tickInterval = input(1);

  readonly vertical = input(false);

  readonly showTicks = input(false);

  readonly showTicksLabel = input(false);

  readonly value = model(0);

  //readonly valueChange = output<number>();

  readonly matSlider = viewChild.required(MatSlider);

  divStart: any;
  divEnd: any;

  constructor() {}

  ngOnChanges(changes: any): void {
    if (changes.min != null && changes.min != undefined  && this.value() == null) {
      this.value.set(this.min());
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      var event = new MouseEvent('mouseover', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      var myTarget = this.matSlider()._elementRef.nativeElement;
      myTarget.dispatchEvent(event);
    });
  }

  ngOnInit(): void {}

  public formatLabel(value: number) {
    return value ? value.toString() : '0';
  }

}
