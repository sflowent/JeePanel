import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'jee-prompt-dialog',
    imports: [FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
    templateUrl: './prompt-dialog.component.html',
    styleUrl: './prompt-dialog.component.scss'
})
export class PromptDialogComponent {
  title: string;
  message: string;
  value!: string;

  constructor(
    public dialogRef: MatDialogRef<PromptDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PromptDialogModel
  ) {
    this.title = data.title;
    this.message = data.message;
  }

  onConfirm(): void {
    this.dialogRef.close(this.value);
  }

  onDismiss(): void {
    this.dialogRef.close();
  }
}

export class PromptDialogModel {
  constructor(
    public title: string,
    public message: string
  ) {}
}
