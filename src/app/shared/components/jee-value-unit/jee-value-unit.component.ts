import { Component, input } from '@angular/core';

@Component({
  selector: 'jee-value-unit',
  imports: [],
  templateUrl: './jee-value-unit.component.html',
  styleUrl: './jee-value-unit.component.scss'
})
export class JeeValueUnitComponent {

  value = input.required<string>();

  unit = input<string>("");

}
