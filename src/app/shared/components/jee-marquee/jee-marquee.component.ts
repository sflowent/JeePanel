import { NgTemplateOutlet } from '@angular/common';
import { Component, contentChild, TemplateRef } from '@angular/core';
import { v4 } from 'uuid';

@Component({
  selector: 'jee-marquee',
  imports: [NgTemplateOutlet],
  templateUrl: './jee-marquee.component.html',
  styleUrl: './jee-marquee.component.scss'
})
export class JeeMarqueeComponent {
  marqueeTemplate = contentChild.required<TemplateRef<any>>('marqueeTemplate');

  iterations:string[] = [];
  constructor(){
    for(let i =0; i< 15; i++){
      this.iterations.push(v4().toString())
    }
  }
}
