import { AfterViewInit, Component, OnInit, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ModalService } from '@app/shared/features/modals/services/modal.service';
import { clone } from '@app/shared/functions/clone';
import { IconPickerModalComponent } from '../../modals/icon-picker-modal/icon-picker-modal.component';
import { IconSettings } from '../../models/icon-settings.model';
import { WidgetIconComponent } from '../widget-icon/widget-icon.component';

@Component({
    selector: 'icon-picker',
    templateUrl: './icon-picker.component.html',
    styleUrls: ['./icon-picker.component.scss'],
    standalone: true,
    // changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => IconPickerComponent),
            multi: true
        }
    ],
    imports: [
        MatFormFieldModule,
        MatButtonModule,
        FormsModule,
        MatCheckboxModule,
        WidgetIconComponent
    ]
})
export class IconPickerComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  modalService = inject(ModalService);

  value?: IconSettings;

  onChange: any = () => {};
  onTouch: any = () => {};
  disabled: boolean = false;

  noValue = false;

  previewIcon: IconSettings;

  ngAfterViewInit(): void {}

  ngOnInit(): void {}

  writeValue(value: IconSettings): void {
    this.value = value || new IconSettings();
    this._setPreview();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  updateValue(): void {
    this.onChange(this.value);
    this.onTouch();

    this._setPreview();
  }

  openIconPickerModal() {
    this.modalService
      .open(IconPickerModalComponent, {
        iconSettings: clone(this.value || new IconSettings())
      })
      .afterClosed()
      .subscribe(newIcon => {
        if (newIcon) {
          this.value = newIcon;
          this.updateValue();
        }
      });
  }

  private _setPreview() {
    this.previewIcon = new IconSettings({size: 88});
    this.previewIcon.iconType = this.value?.iconType || 'icon';
    this.previewIcon.icon = this.value?.icon;
    this.previewIcon.iconset = this.value?.iconset;
    this.previewIcon.staticUrl = this.value?.staticUrl;
  }
}
