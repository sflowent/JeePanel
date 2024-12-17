import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'jee-confirm-dialog',
    imports: [FormsModule, MatDialogModule, MatButtonModule],
    templateUrl: './confirm-dialog.component.html',
    styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  static panelClass = ""

  title: string;
  message: string;
  actions: { text: string; value: any; }[] | null | undefined;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel
  ) {
    this.title = data.title;
    this.message = data.message;
    this.actions = data.actions;
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }

  clickAction(value: any){
    this.dialogRef.close(value);
  }
}

export class ConfirmDialogModel {    
  public title: string = "";
  public message: string = "";
  public actions?: {text: string, value: any}[] | null = null;

  constructor(
  ) {}
}
