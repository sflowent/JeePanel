import { AfterViewInit, Directive, ElementRef, OnChanges, OnInit, Renderer2, input } from '@angular/core';

@Directive({
  selector: '[jeeTicksLabelSlider]',
  standalone: true
})
export class JeeTicksLabelSliderDirective implements AfterViewInit, OnInit, OnChanges {
  readonly min = input(0, {
    transform: ((value: number) => value || 0)
  });

  readonly max = input(100, {
    transform: ((value: number) => value || 100)
  });

  readonly step = input(1, {
    transform: ((value: number) => value || 1)
  });

  readonly showTicks = input(false);

  readonly showTicksLabel = input(false);

  readonly vertical = input(false);

  readonly ngModel = input(0);

  readonly displayWith = input((value: any) => value);

  divMatSliderWrapper: any;
  divStart: any;
  divEnd: any;
  divStepsContainer: any;
  sliderInputHTML: any;

  constructor(
    private sliderEl: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnChanges(changes: any): void {

    if (changes.ngModel && this.showTicks()) {
      this.sliderStepThumbSelected(this.ngModel());
    }
  }

  ngOnInit(): void {}

  sliderStepThumbSelected(value: number) {
    const steps = this.sliderEl.nativeElement.querySelectorAll('.jee-slider-step-thumb');
    steps.forEach((step: any) => {
      const dataValue = parseInt(step.attributes['data-value'].value);
      if (dataValue <= value) {
        this.renderer.addClass(step, 'selected');
      } else {
        this.renderer.removeClass(step, 'selected');
      }
    });
  }

  ngAfterViewInit(): void {
    this.renderer.addClass(this.sliderEl.nativeElement, 'jee-ticks-label');

    // -- Ticks
    this.divStepsContainer = this.renderer.createElement('div');
    this.renderer.addClass(this.divStepsContainer, 'jee-slider-steps-container');

    this.divMatSliderWrapper = this.sliderEl.nativeElement.querySelector('.mdc-slider__track');
    this.renderer.appendChild(this.divMatSliderWrapper, this.divStepsContainer);

    const step = this.step() || 1;
    const max = this.max() || 100;
    const min = this.min() || 0;

    const stepCount = (max - min) / step;
    const stepWidth = 100 / stepCount;

    // bornes
    this.createDivStep(0, stepWidth, min || 0, true);
    this.createDivStep(stepCount, stepWidth, max, true);

    if (this.showTicks()) {
      for (let i = 1; i < stepCount; i++) {
        const stepValue = step * i + min;
        this.createDivStep(i, stepWidth, stepValue, this.showTicksLabel());
      }

      // -- recuperation de la valeur en temp reel
      const attributeName = 'aria-valuetext';
      const observer = new MutationObserver(mutations => {
        const attribute = mutations.find(m => attributeName == attributeName);

        if (attribute) {
          const value = this.sliderInputHTML.attributes[attributeName].value;
          this.sliderStepThumbSelected(value);
        }
      });

      var config = {
        attributes: true,
        attributeFilter: ['aria-valuetext']
      };

      this.sliderInputHTML = this.sliderEl.nativeElement.querySelector('.mdc-slider__input');
      observer.observe(this.sliderInputHTML, config);
    }
  }

  private createDivStep(index: number, stepWidth: number, stepValue: number, showLabel: boolean) {
    const width = stepWidth * 2;

    const divStep = this.renderer.createElement('div');
    this.renderer.addClass(divStep, 'jee-slider-step-container');

    const valueToDisplay = showLabel ? this.formatLabel(stepValue) : '&nbsp;';
    this.renderer.setProperty(divStep, 'innerHTML', "<div class='jee-slider-step-label'>" + valueToDisplay + '</div>');

    this.renderer.appendChild(this.divStepsContainer, divStep);

    const divStepRound = this.renderer.createElement('div');
    this.renderer.addClass(divStepRound, 'jee-slider-step-thumb');
    this.renderer.setAttribute(divStepRound, 'data-value', stepValue.toString());
    this.renderer.appendChild(divStep, divStepRound);

    let pos = index * stepWidth - stepWidth;

    this.renderer.setStyle(divStep, 'left', pos + '%');
    this.renderer.setStyle(divStep, 'width', width + '%');

    if (this.vertical()) {
      this.renderer.addClass(this.sliderEl.nativeElement, 'jee-slider-vertical');
    }
  }

  private formatLabel(value: number) {
    const displayWith = this.displayWith();
    let valueFormatted = displayWith ? displayWith(value) : value;
    return valueFormatted || value.toString();
  }
}
