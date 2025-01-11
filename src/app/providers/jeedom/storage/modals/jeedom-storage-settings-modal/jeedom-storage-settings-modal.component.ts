import { Component, Inject, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SelectCommandSettings } from '@app/core/components/select-command/select-command-settings.model';
import { ProvidersService } from '@app/core/providers/services/providers.service';
import { JeedomProviderService } from '@app/providers/jeedom/services/jeedom-provider.service';
import { JeedomDataLoadingStatus } from '@app/providers/jeedom/services/jeedom.service';
import { Command } from '@dashboards/models/command.model';
import { SelectCommandComponent } from '../../../../../core/components/select-command/select-command.component';
import { JeedomStorageConfig } from '../../models/jeedom-storage-config';

@Component({
  selector: 'jee-jeedom-command-picker-modal',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule, MatButton, SelectCommandComponent],
  templateUrl: './jeedom-storage-settings-modal.component.html',
  styleUrl: './jeedom-storage-settings-modal.component.scss',
})
export class JeedomStorageSettingsModalComponent implements OnInit {
  providersService = inject(ProvidersService);

  settings: JeedomStorageConfig;
  command: Command | undefined;
  loading= true;

  jeedomProviders: JeedomProviderService[];
  providerSelected: JeedomProviderService | undefined;
  
  selectCommandSettings:SelectCommandSettings = {
    placeholder: "Commande"
  }

  constructor(
    public dialogRef: MatDialogRef<JeedomStorageSettingsModalComponent, any>,
    @Inject(MAT_DIALOG_DATA)
    private data: { settings: JeedomStorageConfig },
  ) {
    this.jeedomProviders = this.providersService.providers.filter((p) => p.settings.type === 'jeedom') as JeedomProviderService[];

    this.settings = data.settings;
    

    this.providerSelected = this.command?.providerCode
      ? this.jeedomProviders.find((p) => p.settings.code === this.command?.providerCode)
      : undefined;
    if (!this.providerSelected && this.jeedomProviders.length > 0) {
      this.providerSelected = this.jeedomProviders[0];
    }

    if (this.providerSelected) {
      this.loading = true;
      this.providerSelected.jeedomService.loadJeedomData().pipe(takeUntilDestroyed()).subscribe((result) => {
        if (result.status === JeedomDataLoadingStatus.loaded){
          this.command = this.settings?.command;
          this.loading = false;
        }
      });
    }
  }

  ngOnInit(): void {}

  onProviderSelected() {
    if (this.settings) {
      this.loading = true;
      this.command = undefined;
      this.providerSelected?.jeedomService.loadJeedomData().subscribe((result) => {
       this.loading = false;
      });
    }
  }

  onCommandChange() {
    
  }

  save() {
    this.dialogRef.close(
      new JeedomStorageConfig({
        command: this.command,
      }),
    );
  }
}
