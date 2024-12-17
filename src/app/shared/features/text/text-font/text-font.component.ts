import { Component, OnChanges, OnInit, SimpleChanges, input } from '@angular/core';
import { TextFont } from '../models/text-font.model';

import { DefaultValues } from '@app/shared/default-values';
import { TextTransformation } from '../models/text-transformation.model';
import { JeeValueUnitComponent } from "../../../components/jee-value-unit/jee-value-unit.component";

@Component({
  selector: 'text-font',
  templateUrl: './text-font.component.html',
  styleUrls: ['./text-font.component.scss'],
  standalone: true,
  imports: [JeeValueUnitComponent],
})
export class TextFontComponent implements OnInit, OnChanges {
  readonly font = input(DefaultValues.LabelFont(), {
    transform: (value:TextFont) => value || DefaultValues.LabelFont()
  });

  readonly text = input('', {
    transform: (value:string) => value != null && value != undefined ? value : ""
  });

  value: string = '';
  fontSize: string = '';

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    const font = this.font();
    font.tranform = font.tranform || new TextTransformation();

    this.value = this.transform();
    if (font.size) {
      this.fontSize = font.size ? font.size + (font.sizeUnit || 'px') : '';
    }
    else{
      this.fontSize = `min(${font.cqmin}cqmin, ${font.maxSize}px)`;
    }

    this.fontSize = font.size ? font.size + (font.sizeUnit || 'px') : '';


    //this.fontSize = "30cqmin";
  }

  ngOnInit(): void {}

  transform() {
    const font = this.font();
    if (font.tranform) {
      return font.tranform.mask.replace('%value%', this.text());
    }

    return this.text();
  }
}
