import { ComponentType } from '@angular/cdk/portal';
import { Injectable, Injector, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MediaQueryService } from '../../../services/media-query.service';
import { composition } from 'mathjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(
    private dialog: MatDialog,
    private mediaQuery: MediaQueryService
  ) {}

  open<T = any, R = any>(component: ComponentType<T> | TemplateRef<T>, data: any, config: MatDialogConfig = {}): MatDialogRef<any, any> {
    

    const configModal:MatDialogConfig  = {
      disableClose: true,
      panelClass: config.panelClass ?? (component as any).panelClass ?? "modal-responsive"
    }

    Object.assign(configModal, config);

    configModal.data = data;

    this.removeActiveFocus();
    const dialogRef = this.dialog.open<T, R>(component, configModal);
    return dialogRef;
  }

  private removeActiveFocus() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }
}
