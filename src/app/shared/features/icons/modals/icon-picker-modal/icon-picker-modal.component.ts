import { JsonPipe, NgClass } from '@angular/common';
import { Component, ElementRef, Inject, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommandValue } from '@dashboards/models/command-value.model';
import { SvgIconComponent } from 'angular-svg-icon';
import { IconSettings } from '../../models/icon-settings.model';
import { IconSet, IconSetInfo } from '../../models/iconset.model';
import { IconService } from '../../services/icon.service';

@Component({
    selector: 'jee-icon-picker-modal',
    imports: [
        NgClass,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        FormsModule,
        MatCheckboxModule,
        MatDialogModule,
        MatDividerModule,
        MatButtonModule,
        MatIconModule,
        SvgIconComponent
    ],
    standalone: true,
    templateUrl: './icon-picker-modal.component.html',
    styleUrl: './icon-picker-modal.component.scss'
})
export class IconPickerModalComponent {
  dialogRef = inject(MatDialogRef);
  elementRef = inject(ElementRef);

  searchText = '';

  value: IconSettings;
  title: string;

  iconSet: IconSet | null = null;
  command: CommandValue | null = null;
  staticUrl: string | null = null;

  icons: string[] = [];

  iconsService = inject(IconService);
  iconSets: IconSet[] = this.iconsService.iconsets;
  iconType: any;
  iconsLoading = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = data.title;
    this.value = data.iconSettings || new IconSettings();
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.value.iconType ||= 'icon';
    this.iconType = this.value?.iconType;

    if (this.value.iconType === 'icon' && this.value?.iconset) {
      this.iconSet = this.iconSets.find(is => is.id === this.value?.iconset) || null;
      this.iconType = this.iconSet;
      this.iconSetSelected();
    }
  }

  onIconTypeChange(event: any) {
    this.value.iconset = undefined;
    this.value.icon = undefined;
    this.value.staticUrl = undefined;

    switch (this.iconType) {
      case 'staticUrl':
        this.value.iconType = 'staticUrl';
        break;
      default:
        this.value.iconType = 'icon';
        this.iconSet = this.iconType;
        this.iconSetSelected();
        break;
    }
  }

  onSearchIcon() {
    this.icons = this.iconSet?.info?.icons.filter(i => i.indexOf(this.searchText) >= 0) || [];
  }

  iconSetSelected() {
    if (!this.iconSet) {
      this.value.icon = '';
      this.icons = [];
      return;
    }

    this.value ||= new IconSettings();
    this.value.iconset = this.iconSet.id;

    if (!this.iconSet.info) {
      this.iconsLoading = true;
      this.iconsService.getIcons(this.iconSet.id).subscribe((info: IconSetInfo) => {
        this.iconSet.info = info;
        this.icons = info.icons;
        this.iconsLoading = false;
        this._scrollToSelectedIcon();
      });
    } else {
      this.icons = this.iconSet.info.icons;
      this._scrollToSelectedIcon()
    }
  }

  onIconSelected(icon: string) {
    this.value.icon = icon;
  }

  onConfirm(): void {
    this.dialogRef.close(this.value);
  }

  onDismiss(): void {
    this.dialogRef.close();
  }

  private _scrollToSelectedIcon() {
    setTimeout(() => {
      let el = document.getElementsByClassName('selected');
      if (el && el.length >= 1) el[0].scrollIntoView();
    }, 1000);
  }
}
