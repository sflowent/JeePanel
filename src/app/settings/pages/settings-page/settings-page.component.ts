import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { PERSISTANT_STORAGE_DEFINITION, StorageDefinition } from '@app/app.config';
import { DashboardStorageSettingsService } from '@app/core/dashboards-storage/services/dashboard-storage-settings.service';
import { DashboardStorageService } from '@app/core/dashboards-storage/services/dashboard-storage.service';
import { ProviderDefinition } from '@app/core/providers/models/provider-definition.model';
import { ProviderSettings } from '@app/core/providers/models/provider-settings.model';
import { ProviderBaseService } from '@app/core/providers/services/provider-base.service';
import { ProviderSettingsService } from '@app/core/providers/services/provider-settings.service';
import { ProvidersService } from '@app/core/providers/services/providers.service';
import { PageTitleService } from '@app/core/services/page-title-service.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/shared/features/modals/components/confirm-dialog/confirm-dialog.component';
import { ModalService } from '@app/shared/features/modals/services/modal.service';
import { clone } from '@app/shared/functions/clone';
import { v4 as uuidv4 } from 'uuid';

export class StorageViewModel extends StorageDefinition {
  selected: boolean = false;
}

@Component({
  selector: 'jee-settings-page',
  imports: [MatButton, RouterModule],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
})
export class SettingsPage {
  providersService = inject(ProvidersService);
  providersSettingsService = inject(ProviderSettingsService);

  dashboardStorageSettingsService = inject(DashboardStorageSettingsService);
  dashboardStorageService = inject(DashboardStorageService);
  modalService = inject(ModalService);

  pageTitleService = inject(PageTitleService);

  availableStorages: StorageViewModel[] = [];

  constructor() {
    this.pageTitleService.actions = [];

    this.initStorage();
    this.initProviders();
  }

  /*************************************************
   * Storage
   */

  initStorage() {
    const storageSettings = this.dashboardStorageSettingsService.storagesSettings;
    this.availableStorages = Object.values(PERSISTANT_STORAGE_DEFINITION).map((pss) => {
      const vm = clone(pss) as StorageViewModel;
      vm.selected = storageSettings.find((ss) => ss.code === pss.storageType)?.selected ?? false;
      return vm;
    });
  }

  switchStorageTo(storageDefinition: StorageViewModel) {
    this.dashboardStorageService.openModalConfig(storageDefinition.storageType).subscribe((data: any) => {
      if (data) {
        this.modalService
          .open(ConfirmDialogComponent, {
            title: 'Configuration',
            message:
              'Voulez vous enregistrer le dashboard actuel dans ce stockage ? (Attention cela écrasera les données actuellement dans le stockage)',
              actions: [{
                text: "Enregistrer le dashboard actuel",
                value: "erase"
              },
              {
                text: "Non, je veux récupérer le dashboard enregistré dans le stockage",
                value: "get"
              }]
          })
          .afterClosed()
          .subscribe((result) => {
            if (result === "erase"){
              this.dashboardStorageService.getDashboards().subscribe((dashboards) => {
                this._switchTo(storageDefinition);
                this.dashboardStorageService.saveDashboards(dashboards).subscribe({
                  next: () => {
                    
                  }
                });
              });

            }
            else{
              this._switchTo(storageDefinition);
            }
          });
      }
    });
  }

  openStorageConfig(storageDefinition: StorageViewModel) {
    this.dashboardStorageService.openModalConfig(storageDefinition.storageType).subscribe((data: any) => {
      if (data && storageDefinition.selected) {
        this.dashboardStorageService.getDashboards().subscribe();
      }
    });
  }

  /*************************************************
   * Provider
   */

  availableProviders: ProviderDefinition[] = [];
  providersSettings: ProviderSettings[] = [];

  initProviders() {
    this.providersSettingsService.getAvailableProviders().subscribe((providers) => {
      this.availableProviders = providers;
    });

    this.refreshProviders();
  }

  refreshProviders() {
    this.providersSettingsService.getProvidersSettings().subscribe((providersSettings) => {
      this.providersSettings = providersSettings;
    });
  }

  /**
   *
   * @param provider
   */
  addProvider(provider: ProviderDefinition) {
    const settings = new ProviderSettings({
      code: uuidv4(),
      type: provider.providerType,
      label: provider.providerName,
    });
    this.providersSettingsService.saveProviderSettings(settings).subscribe((newSettings) => {
      //this.providersSettings.push(newSettings);
      this.refreshProviders();
    });
  }

  editProviderSettings(settings: ProviderSettings) {
    // provider.openConfigurationModal().subscribe((settings: ProviderSettings) => {
    //   if (settings) {
    //     this.providersSettingsService.saveProviderSettings(settings);
    //   }
    // });

    this.providersService.openConfigurationModal(settings).subscribe();
  }

  deleteProviderSettings(provider: ProviderSettings) {
    this.modalService
      .open<any, boolean>(ConfirmDialogComponent, {
        title: 'Suppression',
        message: `Voulez vous supprimer ce fournisseur : ${provider.label} (${provider.code})`,
      })
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          this.providersSettingsService.removeProviderSettings(provider.id).subscribe(() => {
            this.providersService.deleteIntanceOf(provider.code);
            this.refreshProviders();
          });
        }
      });
  }

  private _switchTo(storageDefinition: StorageDefinition){
    this.dashboardStorageService.switchStorageTo(storageDefinition.storageType);
    this.initStorage();
    this.dashboardStorageService.getDashboards().subscribe();
  }
}
