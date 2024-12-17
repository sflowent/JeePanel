import { OverlayModule } from '@angular/cdk/overlay';
import { NgTemplateOutlet } from '@angular/common';
import { Component, input, model, TemplateRef, contentChild } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'jee-select',
  imports: [MatButton, OverlayModule, NgTemplateOutlet],
  templateUrl: './jee-select.component.html',
  styleUrl: './jee-select.component.scss',
})
export class JeeSelectComponent {
  isOpen = false;

  selectedItem = model<any>();
  items = input.required<any[]>();

  itemTemplate = contentChild.required<TemplateRef<any>>('itemTemplate');
  selectedTemplate = contentChild.required<TemplateRef<any>>('selectedTemplate');

  close() {
    this.isOpen = false;
  }

  onItemSelected(item: any) {
    this.selectedItem.set(item);
    this.close();
  }
}
