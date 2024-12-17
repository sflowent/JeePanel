import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { JeedomConfig } from '../../models/jeedom-config';
import { clone } from '@app/shared/functions/clone';


@Component({
    selector: 'jee-jeedom-configuration-modal',
    imports: [FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatLabel, ReactiveFormsModule, MatInput],
    templateUrl: './jeedom-configuration-modal.component.html',
    styleUrl: './jeedom-configuration-modal.component.scss'
})
export class JeedomConfigurationModalComponent {
  public settings: JeedomConfig;
  public formBuilder = inject(FormBuilder);
  public form: any;

  constructor(
    public dialogRef: MatDialogRef<JeedomConfigurationModalComponent, JeedomConfig |null>,
    @Inject(MAT_DIALOG_DATA)
    private data: { settings: JeedomConfig }
  ) {
    this.settings = clone(data.settings);

    this.form = this.formBuilder.group({
      providerCode: [this.settings.code, [Validators.required]],
      waitTimeBetweenPolls : [this.settings.waitTimeBetweenPolls ?? 1000, [Validators.required]],
      url: [this.settings.url, [Validators.required]],
      apiKey: [this.settings.apiKey, Validators.required]
    });
  }

  onConfirm(): void {
    if (this.form.valid) {
      this.settings.code = this.form.value.providerCode;
      this.settings.waitTimeBetweenPolls = this.form.value.waitTimeBetweenPolls;
      this.settings.apiKey = this.form.value.apiKey;
      this.settings.url = this.form.value.url;
      this.dialogRef.close(this.settings);
    }
  }

  onDismiss(): void {
    this.dialogRef.close(null);
  }
}
