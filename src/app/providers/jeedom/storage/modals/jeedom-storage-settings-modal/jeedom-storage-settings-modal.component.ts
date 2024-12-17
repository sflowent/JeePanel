import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommandFormElementConfig } from '@app/core/providers/models/command-form-element';
import { ProvidersService } from '@app/core/providers/services/providers.service';
import { JeedomCmd_http } from '@app/providers/jeedom/models/http-command';
import { JeedomProviderService } from '@app/providers/jeedom/services/jeedom-provider.service';
import { FormElementConfig } from '@dashboards/features/dynamic-form/models/dynamic-form.model';
import { Command } from '@dashboards/models/command.model';
import { JeedomStorageConfig } from '../../models/jeedom-storage-config';
import { clone } from '@app/shared/functions/clone';

@Component({
    selector: 'jee-jeedom-command-picker-modal',
    imports: [FormsModule, MatFormFieldModule, MatIconButton, MatInputModule, MatSelectModule, MatDialogModule, MatButton, MatIcon],
    templateUrl: './jeedom-storage-settings-modal.component.html',
    styleUrl: './jeedom-storage-settings-modal.component.scss'
})
export class JeedomStorageSettingsModalComponent implements OnInit {
  providersService = inject(ProvidersService);

  settings: JeedomStorageConfig;
  command: Command | undefined;

  jeedomProviders: JeedomProviderService[];
  providerSelected: JeedomProviderService | undefined;
  commandLabel: string = '';

  constructor(
    public dialogRef: MatDialogRef<JeedomStorageSettingsModalComponent, any>,
    @Inject(MAT_DIALOG_DATA)
    private data: { settings: JeedomStorageConfig },
  ) {
    this.jeedomProviders = this.providersService.providers.filter((p) => p.settings.type === 'jeedom') as JeedomProviderService[];

    this.settings = data.settings;
    this.command = this.settings?.command;

    this.providerSelected = this.command?.providerCode ? this.jeedomProviders.find((p) => p.settings.code === this.command?.providerCode) : undefined;
    if (!this.providerSelected && this.jeedomProviders.length > 0) {
      this.providerSelected = this.jeedomProviders[0];
    }

    if (this.providerSelected) {
      this.providerSelected.jeedomService.loadJeedomData().subscribe((result) => {
        if (this.command) {
          this._updateCommandLabel();
        }
      });
    }
  }

  ngOnInit(): void {}

  onProviderSelected() {
    if (this.settings) {
      this.command = undefined;
      this.providerSelected?.jeedomService.loadJeedomData();
    }
  }

  openCommandPicker() {
    if (!this.providerSelected) {
      return;
    }

    this.providerSelected
      .openCommandPickerModal(CommandFormElementConfig.newDynamicForm(new FormElementConfig()), this.command)
      .subscribe((cv: Command) => {
        if (cv) {
          this.command = cv;
          this._updateCommandLabel();
        }
      });
  }

  save() {
    this.dialogRef.close(
      new JeedomStorageConfig({
        command: this.command
      }),
    );
  }

  private _updateCommandLabel(): void {
    this.commandLabel = '';
    if (this.providerSelected && this.command) {
      const label = this.providerSelected.getCommandLabelId(this.command);
      if (label) {
        this.commandLabel = label;
      }
    }
  }
}
