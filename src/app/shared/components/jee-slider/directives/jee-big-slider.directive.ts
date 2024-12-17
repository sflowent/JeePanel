import { AfterViewInit, Directive, ElementRef, OnChanges, Renderer2, SimpleChanges, input } from '@angular/core';

@Directive({
  selector: 'mat-slider[JeeBigSlider]',
  standalone: true
})
export class JeeBigSliderDirective implements AfterViewInit, OnChanges {
  readonly JeeBigSlider = input<boolean>(true);

  constructor(
    private sliderEl: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnChanges(changes: SimpleChanges): void {}

  ngAfterViewInit(): void {
    if (this.JeeBigSlider()) {
      this.renderer.addClass(this.sliderEl.nativeElement, 'jee-big-slider');
    }
  }
}
