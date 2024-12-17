import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
  afterNextRender,
  inject,
  input,
  viewChild
} from '@angular/core';
import { IconSettings } from '../../models/icon-settings.model';
import { NgClass } from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';
import { IconService } from '@app/shared/features/icons/services/icon.service';

@Component({
  selector: 'widget-icon',
  templateUrl: './widget-icon.component.html',
  styleUrls: ['./widget-icon.component.scss'],
  imports: [NgClass, SvgIconComponent],
  standalone: true,
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetIconComponent implements OnInit, AfterViewInit, OnChanges {
  readonly div = viewChild<ElementRef>('div');

  renderer = inject(Renderer2);
  elementRef = inject(ElementRef);

  readonly settings = input<IconSettings>( new IconSettings());

  readonly backdrop = input(false);

  readonly color = input<string>();

  readonly off = input<boolean>(true);

  readonly height = input<number>();

  url: string;
  colorize: string;
  iconHeight: number;
  private _interval: NodeJS.Timeout;
  hide: boolean;
  private _resizeObserver!: ResizeObserver;

  get svgColor() {
    return this.color() || this.settings().color;
  }

  constructor(
    private iconService: IconService,
    private changeRef: ChangeDetectorRef,
  ) {
    afterNextRender(() => {
      this._resizeObserver = new ResizeObserver(() => {
        //this._calculIconHeight();
      });
      this._resizeObserver.observe(this.elementRef.nativeElement);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.url = '';

    const settings = this.settings();
    switch (settings.iconType) {
      case 'staticUrl':
        this._initStaticUrl();
        break;
      default:
        if (settings.icon && settings.iconset) {
          this.url = this.iconService.getIconUrl(settings.iconset, settings.icon);
          this._refreshIconHeight();
        }
    }

    this.changeRef.detectChanges();
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {}

  private _refreshIconHeight(): void {
    const settings = this.settings();
    if (settings.size && !this.backdrop()) {
      this.iconHeight = settings.size;

      this.renderer.setStyle(this.elementRef.nativeElement, 'width', settings.size + 'px');
      this.renderer.setStyle(this.elementRef.nativeElement, 'height', settings.size + 'px');
      return;
    }
  }

  private _calculIconHeight() {
    const element = this.div().nativeElement;

    this.iconHeight = Math.min(element.clientHeight, element.clientWidth);

    this.hide = false;
    this.changeRef.detectChanges();
  }

  private _initStaticUrl() {
    const settings = this.settings();
    if (settings?.staticUrl) {
      this._refreshUrl(settings.staticUrl);

      if (settings.refreshInterval) {
        this._interval = setInterval(() => {
          this._refreshUrl(this.settings().staticUrl);
        }, settings.refreshInterval * 1000);
      }
    }
  }

  private _refreshUrl(url: string) {
    var urlObj = new URL(url);

    urlObj.searchParams.append('nocache', new Date().getTime().toString());

    this.url = urlObj.toString();

    this.changeRef.detectChanges();
  }
}
