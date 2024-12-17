import { Component, OnInit, inject, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CodeEditorComponent } from '@app/shared/features/code-editor/components/code-editor/code-editor.component';
import { LocalDashboardStorage } from '@app/core/dashboards-storage/local-dashboard-storage';
import { ProviderSettings } from '@app/core/providers/models/provider-settings.model';

@Component({
    selector: 'jee-local-config-page',
    imports: [FormsModule, MatSelectModule, MatButtonModule, MatDividerModule, MatIcon, MatFormFieldModule, CodeEditorComponent],
    templateUrl: './local-config-page.component.html',
    styleUrl: './local-config-page.component.scss'
})
export class LocalConfigPage implements OnInit {
  jeeLocalStorage = inject(LocalDashboardStorage);
  settings: ProviderSettings[] = [];

  configType = '';

  config: any;
  readonly btnSave = viewChild.required<MatButton>('btnSave');

  btnSaveLabel = 'Enregistrer';

  ngOnInit(): void {
    // this.jeeLocalStorage.getSettings().subscribe(settings => {
    //   this.settings = settings;
    // });
  }

  onConfigTypeChanged() {
    // switch (this.configType) {
    //   case 'local-settings':
    //     this.config = this.toJSON(this.jeeLocalStorage.getLocalSettings());
    //     break;
    //   case 'settings':
    //     this.config = this.toJSON(this.settings);
    //     break;
    //   default:
    //     this.jeeLocalStorage.getDashboards().subscribe(panel => {
    //       this.config = this.toJSON(panel);
    //     });
    // }
  }

  save() {
    // const configObj = JSON.parse(this.config);

    // switch (this.configType) {
    //   case 'local-settings':
    //     this.jeeLocalStorage.saveLocalSettings(configObj);
    //     this._saved();
    //     break;
    //   case 'settings':
    //     this.jeeLocalStorage.saveSettings(configObj).subscribe((settings) => {
    //       this.settings = settings;
    //       this.config = this.toJSON(this.settings);
    //       this._saved();
    //     } );
    //     break;
    //   default:
    //     this.jeeLocalStorage.saveDashboards(configObj).subscribe((panel) => {
    //       this.config = this.toJSON(panel);
    //       this._saved();
    //     } );
    // }


  }

  toJSON(obj: any): string{
    return JSON.stringify(obj, null, 4);
  };

  _saved(){
    this.btnSaveLabel = 'Enregistré !';
    setTimeout(() => (this.btnSaveLabel = 'Enregistrer'), 1000);
  }
}
