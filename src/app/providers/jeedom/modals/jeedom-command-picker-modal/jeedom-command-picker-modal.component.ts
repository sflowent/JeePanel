import { Component, Inject, OnInit, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { JeedomService } from '../../services/jeedom.service';
import { JeedomCmd_http, JeedomEquipement_http, JeedomObject_http } from '../../models/http-command';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormElementConfig } from '@dashboards/features/dynamic-form/models/dynamic-form.model';
import { Command } from '@dashboards/models/command.model';
import { CommandFormElementConfig } from '@app/core/providers/models/command-form-element';

@Component({
    selector: 'jee-jeedom-command-picker-modal',
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule, MatButton],
    templateUrl: './jeedom-command-picker-modal.component.html',
    styleUrl: './jeedom-command-picker-modal.component.scss'
})
export class JeedomCommandPickerModalComponent implements OnInit {
  jeedomService :JeedomService;

  objects: JeedomObject_http[];

  objectSelected: JeedomObject_http | null = null;
  equipmentSelected: JeedomEquipement_http | null = null;
  commandSelected: JeedomCmd_http | null = null;

  commandValue: Command | null = null;
  jeedomCommandValue: JeedomCmd_http | null = null;

  commands: JeedomCmd_http[] = [];
  type: any;
  subType: any;
  isHistorized: boolean = false;

  commandLabelId: string | null = '';
  formElement: CommandFormElementConfig;

  constructor(
    public dialogRef: MatDialogRef<JeedomCommandPickerModalComponent, JeedomCmd_http>,
    @Inject(MAT_DIALOG_DATA)
    private data: { element: FormElementConfig; commandId: string; jeedomService:JeedomService }
  ) {
    this.formElement = data.element;
    this.jeedomService = data.jeedomService;
    
    this.commandSelected = this.jeedomService.getJeedomCommand(data.commandId);

    this.type = this.formElement.ui?.type;
    this.isHistorized = this.formElement.ui?.isHistorized ?? false;
    this.subType = this.formElement.ui?.subType;
    this.objects = this.jeedomService.objects;
  }

  ngOnInit(): void {
    if (this.commandSelected) {
      this.equipmentSelected = this.jeedomService.equipments.find(e => e.id === this.commandSelected?.eqLogic_id) || null;
      this.onEquipmentSelected();
    }

    if (this.equipmentSelected) {
      this.objectSelected = this.jeedomService.objects.find(o => o.id === this.equipmentSelected?.object_id) || null;
    }
  }

  onEquipmentSelected() {
    if (this.equipmentSelected == null) {
      return;
    }

    this.commands = this.equipmentSelected.cmds;
    if (this.type) {
      this.commands = this.commands.filter(x => {
        return x.type === this.type;
      });
    }

    if (this.subType) {
      this.commands = this.commands.filter(x => {
        return x.subType === this.subType || (x.eqType === 'virtual' && x.subType === 'other');
      });
    }

    if (this.isHistorized) {
      this.commands = this.commands.filter(x => {
        return x.isHistorized;
      });
    }
  }

  onCommandSelected() {
    //this.commandLabelId = this.commandSelected?.labelId;
    //updateModel();

    this.dialogRef.close(this.commandSelected || undefined);
  }
}
