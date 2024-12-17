import { FormElementConfig } from "@dashboards/features/dynamic-form/models/dynamic-form.model";
import { TextTransformation } from "./text-transformation.model";

export class TextFont {
  size?: number;

  cqmin?: number;
  maxSize?: number;
  
  sizeUnit: string = 'px';
  color: string;
  tranform?: TextTransformation;
  unit: string;

  font?: string;
  weight: string;
  decoration: string;

  [key: string]: any;

  constructor(init?: Partial<TextFont>){
    Object.assign(this, init);
  }

  /**
   * 
   * @param cqmin cqmin css
   * @param maxSize max font-size in pt
   * @returns 
   */
  static fromAutoSize(cqmin?: number, maxSize?: number) {
    return new TextFont({cqmin: cqmin, maxSize: maxSize});
  }

  static fromSize(size: number) {
    return new TextFont({size: size});
  }
}

export class TextFontFormElement extends FormElementConfig<TextFont> {
  override ui: { hideFormat?: boolean } = {};
}
