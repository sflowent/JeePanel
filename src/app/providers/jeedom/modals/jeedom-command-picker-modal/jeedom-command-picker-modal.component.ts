import { Component, effect, Inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SelectCommandSettings } from '@app/core/components/select-command/select-command-settings.model';
import { Command } from '@dashboards/models/command.model';
import { JeedomCmd_http, JeedomEquipement_http, JeedomObject_http } from '../../models/http-command';
import { JeedomDataLoadingStatus, JeedomService } from '../../services/jeedom.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { MAT_SELECTSEARCH_DEFAULT_OPTIONS, MatSelectSearchOptions, NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { debounceTime } from 'rxjs';
import { sortBy } from '@app/shared/functions/sort';
import { search } from '@app/shared/functions/string';

@Component({
  selector: 'jee-jeedom-command-picker-modal',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatButton,
    NgxMatSelectSearchModule,
    NgTemplateOutlet,
  ],
  templateUrl: './jeedom-command-picker-modal.component.html',
  styleUrl: './jeedom-command-picker-modal.component.scss',
  providers: [
    {
      provide: MAT_SELECTSEARCH_DEFAULT_OPTIONS,
      useValue: <MatSelectSearchOptions>{
        closeIcon: 'delete',
        noEntriesFoundLabel: 'Aucun résultat',
        placeholderLabel: 'Rechercher',
      },
    },
  ],
})
export class JeedomCommandPickerModalComponent implements OnInit {
  jeedomService: JeedomService;

  objects: JeedomObject_http[] = [];

  objectSelected: JeedomObject_http | null = null;
  equipmentSelected: JeedomEquipement_http | null = null;
  commandSelected: JeedomCmd_http | null = null;

  commandValue: Command | null = null;
  jeedomCommandValue: JeedomCmd_http | null = null;

  availableCommands: JeedomCmd_http[] = [];

  commandLabelId: string | null = '';
  settings: SelectCommandSettings;

  hierarchicalObjects: any[] = [];

  objectFilterControl: FormControl<string | null> = new FormControl<string>('');
  equipmentFilterControl: FormControl<string | null> = new FormControl<string>('');
  commandFilterControl: FormControl<string | null> = new FormControl<string>('');

  equipments: JeedomEquipement_http[] = [];
  commands: JeedomCmd_http[] = [];

  constructor(
    public dialogRef: MatDialogRef<JeedomCommandPickerModalComponent, JeedomCmd_http>,
    @Inject(MAT_DIALOG_DATA)
    private data: { settings: SelectCommandSettings; commandId: string; jeedomService: JeedomService },
  ) {
    this.settings = data.settings;
    this.jeedomService = data.jeedomService;

    this.jeedomService
      .loadJeedomData()
      .pipe(takeUntilDestroyed())
      .subscribe((result) => {
        if (result.status !== JeedomDataLoadingStatus.loaded) {
          return;
        }

        this.objects = this.jeedomService.objects();

        this.hierarchicalObjects = this.buildHierarchy(this.objects);

        this.commandSelected = this.jeedomService.getJeedomCommand(data.commandId);
        if (this.commandSelected) {
          this.equipmentSelected = this.jeedomService.equipments.find((e) => e.id === this.commandSelected?.eqLogic_id) || null;
        }

        if (this.equipmentSelected) {
          this.objectSelected = this.objects.find((o) => o.id === this.equipmentSelected?.object_id) || null;

          this.onEquipmentSelected();
          this.commands = this.availableCommands;
          this.equipments = this.objectSelected?.eqLogics ?? [];
          
        }
      });
  }

  ngOnInit(): void {
    this.objectFilterControl.valueChanges.pipe(debounceTime(500)).subscribe((filter) => {
      let objects = this.objects;
      if (filter) {
        filter = filter.toLocaleLowerCase();
        objects = this.objects.filter((o) => search(o.name, filter!));
      }

      this.hierarchicalObjects = this.buildHierarchy(objects);
    });

    this.equipmentFilterControl.valueChanges.pipe(debounceTime(500)).subscribe((filter) => {
      let equipments = this.objectSelected?.eqLogics ?? [];
      if (filter) {
        filter = filter.toLocaleLowerCase();
        equipments = equipments.filter((o) => search(o.name, filter!));
      }

      this.equipments = sortBy(equipments, (e) => e.name);
    });

    this.commandFilterControl.valueChanges.pipe(debounceTime(500)).subscribe((filter) => {
      let commands = this.availableCommands ?? [];
      if (filter) {
        filter = filter.toLocaleLowerCase();
        commands = commands.filter((o) => search(o.name, filter!));
      }

      this.commands = sortBy(commands, (e) => e.name);
    });
  }

  onObjectSelected() {
    this.equipmentFilterControl.setValue(null);
    this.availableCommands = [];
  }

  onEquipmentSelected() {
    if (this.equipmentSelected == null) {
      return;
    }

    this.availableCommands = this.equipmentSelected.cmds;
    if (this.settings.type) {
      this.availableCommands = this.availableCommands.filter((x) => {
        return x.type === this.settings.type;
      });
    }

    if (this.settings.subType) {
      this.availableCommands = this.availableCommands.filter((x) => {
        return x.subType === this.settings.subType || (x.eqType === 'virtual' && x.subType === 'other');
      });
    }

    if (this.settings.isHistorized) {
      this.availableCommands = this.availableCommands.filter((x) => {
        return x.isHistorized;
      });
    }

    this.commandFilterControl.setValue(null);
  }

  onSave() {
    //this.commandLabelId = this.commandSelected?.labelId;
    //updateModel();

    this.dialogRef.close(this.commandSelected || undefined);
  }

  private buildHierarchy(items: JeedomObject_http[], parentId: string | null = null): JeedomObject_http[] {
    // Étape 1 : Construire un dictionnaire des parents disponibles
    const availableParentIds = new Set(items.map((item) => item.id));

    // Étape 2 : Filtrer les éléments en fonction du parentId ou de la non-existence de leur parent
    return items
      .filter((item) => item.father_id === parentId || (parentId === null && !availableParentIds.has(item.father_id)))
      .map((item) => {
        // Étape 3 : Construire les enfants pour chaque élément
        item.children = this.buildHierarchy(items, item.id);
        return item;
      });
  }

  private alphabeticOrder() {}


}
