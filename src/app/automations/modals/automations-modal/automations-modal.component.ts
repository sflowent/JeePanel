import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { JeedomScenariosComponent } from '@app/automations/components/jeedom-scenarios/jeedom-scenarios.component';

@Component({
    selector: 'jee-automations-modal',
    standalone: true,
    imports: [JeedomScenariosComponent, MatDialogModule, MatButtonModule],
    templateUrl: './automations-modal.component.html',
    styleUrl: './automations-modal.component.scss'
})
export class AutomationsModalComponent {

  constructor(
  ) {
  }

}