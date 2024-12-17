import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  model,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
  viewChild
} from '@angular/core';
import pureknob from './pure-knob.js';
import { MatIcon } from '@angular/material/icon';
import { JeeValueUnitComponent } from '../jee-value-unit/jee-value-unit.component.js';

@Component({
  selector: 'jee-knob',
  imports: [MatIcon, JeeValueUnitComponent],
  templateUrl: './jee-knob.component.html',
  styleUrl: './jee-knob.component.scss',
})
export class JeeKnobComponent implements OnInit, OnChanges {
  private renderer = inject(Renderer2);
  elementRef = inject(ElementRef);

  value = model.required<number>();
  
  label = input<string>("");
  unit = input<string>("");
  valMin = input<number>(0);
  valMax = input<number>(100);
  textColor = input<string>("white");
  trackColor = input<string>("rgba(0, 0, 0, 0.3)");
  fillingColor = input<string>("#883E1C");
  
  readonly divKnobContainer = viewChild.required<ElementRef>('divKnobContainer');
  readonly divActionsContainer = viewChild.required<ElementRef>('divActionsContainer');
  readonly divActions = viewChild.required<ElementRef>('divActions');
  readonly addBtn = viewChild.required<ElementRef>('addBtn');
  readonly minBtn = viewChild.required<ElementRef>('minBtn');
  knob: any;

  showKnob = false;
  showAddRemove = false;

  constructor() {
    effect(() => {
      this.setValue(this.value());
    });
  }
  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit(): void {
    setTimeout(() => {
      this.init();
    }, 1000);
  }

  ngAfterViewInit(): void {}

  add($event: Event) {
    this.setValue(this.value() + 1);
    $event.stopPropagation();
  }

  remove($event: Event) {
    this.setValue(this.value() - 1);
    $event.stopPropagation();
  }

  private setValue(value: number){
   if (this.knob){
    this.knob.setValue(value);
    return;
   }

   this.value.set(value);
  }

  private init(){
    const height = this.elementRef.nativeElement.offsetHeight;
    const width = this.elementRef.nativeElement.offsetWidth;
    
    const smaller = width < height ? width : height;

    if (smaller < 150){
      this.initAddRemove();
      return;
    }

    setTimeout(() => {
      this.initKnob();
    })
  }

  private initAddRemove(){
    this.showAddRemove = true;

  }

  private initKnob() {

      this.showKnob = true;
    const height = this.elementRef.nativeElement.offsetHeight;
    const width = this.elementRef.nativeElement.offsetWidth;

    this.showKnob = true;

    const smaller = width < height ? width : height;
    this.knob = pureknob.createKnob(smaller, smaller);

    // Set properties.
    var knob = this.knob;
    knob.setProperty('angleStart', -0.75 * Math.PI);
    knob.setProperty('angleEnd', 0.75 * Math.PI);

    knob.setProperty('colorFG', this.fillingColor());
    knob.setProperty('colorBG', this.trackColor());
    knob.setProperty('colorText', this.textColor());
    knob.setProperty('trackWidth', 0.15);
    knob.setProperty('valMin', this.valMin());
    knob.setProperty('valMax', this.valMax());
    knob.setProperty('label', this.label());
    knob.setProperty('unitValue', this.unit());

    knob.setValue(this.value());

    const self = this;
    const listener = function (knob: any, value: any) {
      self.value.set(value);
    };

    knob.addListener(listener);

    const node = knob.node();

    const elem = this.divKnobContainer().nativeElement;
    elem.insertBefore(node, elem.firstChild);

    const divKnobContainer = this.divKnobContainer();
    this.renderer.setStyle(divKnobContainer.nativeElement, "height", smaller + "px");
    this.renderer.setStyle(divKnobContainer.nativeElement, "width", smaller + "px");

    // -- Automatic buttons Size
    let buttonsSize = Math.min(smaller * 0.15, 40);
    
    const addBtn = this.addBtn();
    this.renderer.setStyle(addBtn.nativeElement, "height", buttonsSize + "px");
    this.renderer.setStyle(addBtn.nativeElement, "width", buttonsSize + "px");
    
    const minBtn = this.minBtn();
    this.renderer.setStyle(minBtn.nativeElement, "height", buttonsSize + "px");
    this.renderer.setStyle(minBtn.nativeElement, "width", buttonsSize + "px");

    // -- Automatic buttons position
    this.adjustActionsPosition(smaller);
  }

  private adjustActionsPosition(displayedHeight: number) {
    // if image 100x100, actions position : 75 from top
    const imageHeight = 100;
    const position = 75;

    const top = (position / imageHeight) * displayedHeight;

    this.renderer.setStyle(this.divActionsContainer().nativeElement, "top", top + "px");
    
  }
}
