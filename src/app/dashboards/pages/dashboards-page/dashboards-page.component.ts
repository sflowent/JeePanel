import { coerceBooleanProperty } from '@angular/cdk/coercion';

import { AfterViewInit, Component, DestroyRef, OnDestroy, OnInit, inject, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogComponent } from '@app/shared/features/modals/components/confirm-dialog/confirm-dialog.component';
import { ModalService } from '@app/shared/features/modals/services/modal.service';
import { clone } from '@app/shared/functions/clone';
import { MOBILE_BREAKPOINT } from '@app/shared/services/media-query.service';
import { PageTitleService } from '@app/core/services/page-title-service.service';
import { WidgetComponentsTable } from '@app/widgets/widgets.resolver';
import { DynamicWidgetDirective } from '@dashboards/directives/dynamic-widget/dynamic-widget.directive';
import { DynamicFormModal } from '@dashboards/features/dynamic-form/modals/dynamic-form-modal/dynamic-form-modal.component';
import { DynamicForm } from '@dashboards/features/dynamic-form/models/dynamic-form.model';
import { DynamicFormService } from '@dashboards/features/dynamic-form/services/dynamic-form.service';
import { GridType, GridsterComponent, GridsterConfig, GridsterItem, GridsterModule } from 'angular-gridster2';
import { Dashboard, DashboardSettings } from '../../models/dashboard.model';
import { WidgetBaseSettings } from '../../models/widget-settings.model';
import { DashboardsEvent, DashboardManagerService } from '../../services/dashboard-manager.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProvidersService } from '@app/core/providers/services/providers.service';
import { SideNavService } from '@app/core/services/sidenav.service';
import { WidgetBaseComponent } from '@dashboards/components/widget-base/widget-base-component';

export const DEFAULT_GRIDSTER_CONFIG: GridsterConfig = {
  gridType: GridType.VerticalFixed,
  fixedRowHeight: 50,
  minCols: 10,
  maxCols: 10,
  pushItems: true,
  outerMarginBottom: 10,

  draggable: {
    enabled: true,
  },
  resizable: {
    enabled: true,
  },
};

export const DEFAULT_GRIDSTER_COLUMNS = 12;

@Component({
  selector: 'dashboards-page',
  templateUrl: './dashboards-page.component.html',
  styleUrls: ['./dashboards-page.component.scss'],
  imports: [GridsterModule, DynamicWidgetDirective],
})
export class DashboardsPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private dashboard: Dashboard;

  widgets: Array<WidgetBaseSettings> = [];
  options: GridsterConfig;
  isEditing: boolean = false;

  destroyRef = inject(DestroyRef);
  providersService = inject(ProvidersService);
  dynamicFormService = inject(DynamicFormService);
  modalService = inject(ModalService);
  sidenavService = inject(SideNavService);

  dashboardCode!: string;
  originalDashboard?: Dashboard;

  readonly gridster = viewChild.required(GridsterComponent);

  constructor(
    private dashboardManager: DashboardManagerService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected pageTitleService: PageTitleService,
  ) {
    this.options = { ...DEFAULT_GRIDSTER_CONFIG };

    this.options.itemResizeCallback = (x, gridsterItemComponent: any) => {

      const widget = gridsterItemComponent["jeepanel-widget"] as WidgetBaseComponent;
      widget?.onResize();
    }

    this.options.draggable = {
      enabled: true,
      start: (item, event, itemIndex) => this.onDragStart(item as WidgetBaseSettings),
      stop: (item, event, itemIndex) => this.onDragStop(item as WidgetBaseSettings),
    };

    this.sidenavService
      .onPinned()
      ?.pipe(takeUntilDestroyed())
      .subscribe(() => {
          this.gridster()!.calculateLayout$.next(void 0);
      });
  }

  ngOnDestroy(): void {
    this.dashboardManager.Close();
  }

  ngOnInit(): void {
    this.route.params.subscribe((queryParams) => {
      this.isEditing = coerceBooleanProperty(this.route.snapshot.queryParams['edit']);

      this.dashboardCode = queryParams['code'];
      this.refreshDasboardSettings();
    });

    this.dashboardManager
      .onDashboardsUpdated()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((dashboards) => {
        const dashboard = dashboards.find((d) => d.id === this.dashboard.id);
        if (!dashboard) {
          this.router.navigate(['dashboards']);
          return;
        }

        if (!dashboard?.hasCode(this.dashboardCode)) {
          this.router.navigate(['dashboards', dashboard?.settings.code]);
        }
      });
  }

  ngAfterViewInit(): void {}

  refreshDasboardSettings() {
    this.pageTitleService.editMode.set(this.isEditing);

    const getDashboard = this.dashboardCode
      ? this.dashboardManager.getDashboard(this.dashboardCode)
      : this.dashboardManager.getRootDashboard();

    getDashboard.subscribe((dashboard) => {
      this.dashboardCode = dashboard.settings.code;
      this.originalDashboard = dashboard;
      this.dashboard = new Dashboard(clone(this.originalDashboard));
      this.initialize();
    });
  }

  initialize() {
    this.dashboardManager.dashboard = this.dashboard;

    this.dashboard.widgets ??= [];
    this.widgets = this.dashboard.widgets;

    let actions = [];

    let addWidgetsActions = Object.keys(WidgetComponentsTable)
      .filter((key) => !WidgetComponentsTable[key].hide)
      .map((key: string) => {
        const wc = WidgetComponentsTable[key];
        return {
          text: wc.label,
          action: () => this.addWidget(key),
        };
      })
      .sort((a, b) => (a?.text >= b?.text ? 1 : -1));

    if (this.isEditing) {
      actions = [
        {
          icon: 'close',
          text: 'Quitter le mode édition',
          action: () => this.changeMode(),
        },
        {
          icon: 'save',
          text: 'Enregistrer',
          mobilePinned: true,
          action: () => this.saveDashboard(),
        },
        {
          icon: 'settings',
          text: 'Paramètres',
          action: () => this.showSettings(),
        },
        {
          icon: 'add',
          text: 'Ajouter',
          actions: addWidgetsActions,
        },
      ];
    } else {
      actions = [
        {
          icon: 'edit',
          action: () => this.changeMode(),
        },
      ];
    }

    this.pageTitleService.actions = actions;
    this.pageTitleService.hideExtra = this.isEditing;

    this.refreshSettings(this.dashboard.settings);

    setTimeout(() => {
      this.providersService.broadcastDashboardsEvent(this.isEditing ? DashboardsEvent.Edit : DashboardsEvent.View);
    });
  }

  addWidget(widgetType: string) {

    const minHeight = 200;
    const minWidth = 200;
    let cols = 1;
    let rows = 1;

    const currentColHeight = this.options.fixedRowHeight ?? DEFAULT_GRIDSTER_CONFIG.fixedRowHeight!;

    if (currentColHeight < minHeight){
      rows = (minHeight / currentColHeight);
    }

    this.widgets.push(
      new WidgetBaseSettings({
        id: 0,
        x: 0,
        y: 0,
        cols: cols,
        rows: rows,
        widgetType: widgetType,
        dashboardId: this.dashboard.id,
      }),
    );
  }

  showSettings() {
    const formGeneral = new DynamicForm('Général', [
      {
        name: 'title',
        type: 'text',
        label: 'Titre',
        value: this.dashboard.settings.title,
        validators: {
          required: true,
        },
      },
      {
        name: 'code',
        type: 'text',
        label: 'Code',
        value: this.dashboard.settings.code,
        validators: {
          required: true,
        },
      },
    ]);

    const formDashboard = new DynamicForm('Dashboard', [
      {
        name: 'columns',
        type: 'number',
        label: 'Nb colonnes',
        ui: { min: 1, max: 24 },
        value: this.dashboard.settings.columns,
      },
      {
        name: 'rowsHeight',
        type: 'number',
        label: 'Hauteur des lignes',
        ui: { min: 1, max: 200 },
        value: this.dashboard.settings.rowsHeight,
      },
      {
        name: 'oneColumnOnMobile',
        type: 'bool',
        label: 'Vue mobile',
        ui: { text: 'Une seule colonne' },
        value: this.dashboard.settings.oneColumnOnMobile,
      },
    ]);

    const dynamicForms = [formGeneral, formDashboard];

    const dialogRef = this.modalService.open(DynamicFormModal, {
      title: 'Paramètres du dashboard',
      dynamicForms: dynamicForms,
    });
    dialogRef.afterClosed().subscribe((newDynamicForms) => {
      if (newDynamicForms) {
        this.dynamicFormService.toModel(this.dashboard.settings, newDynamicForms);
        this.dashboardManager.saveDashboard(this.dashboard);
        this.refreshSettings(this.dashboard.settings);
      }
    });
  }

  saveDashboard() {
    this.dashboardManager.saveDashboard(this.dashboard).subscribe(() => {
      this.originalDashboard = new Dashboard(clone(this.dashboard));
    });
  }

  changeMode() {
    const _changeMode = () => {
      this.isEditing = !this.isEditing;
      const query = this.isEditing ? { edit: true } : null;
      this.router.navigate(['.'], {
        relativeTo: this.route,
        queryParams: query,
      });

      this.refreshDasboardSettings();
    };

    if (this.isEditing) {
      const dashboardUpdated = JSON.stringify(this.dashboard) !== JSON.stringify(this.originalDashboard);
      if (dashboardUpdated) {
        this.modalService
          .open(ConfirmDialogComponent, {
            title: 'Confirmation',
            message: 'Attention : vos changements vont être perdus. Voulez vous continuer ?',
            actions: [
              {
                text: 'Non',
                value: false,
              },
              {
                text: 'Oui',
                value: true,
              },
              {
                text: 'Sauver et quitter',
                value: null,
              },
            ],
          })
          .afterClosed()
          .subscribe((result: any) => {
            if (result) {
              _changeMode();
            } else if (result === null) {
              this.dashboardManager.saveDashboard(this.dashboard).subscribe(() => {
                _changeMode();
              });
            }
          });
      } else {
        _changeMode();
      }

      return;
    }

    _changeMode();
  }

  refreshSettings(settings: DashboardSettings) {
    // Refresh Title
    this.pageTitleService.pageTitle = settings.title;

    if (this.options) {
      // Refresh Gridster
      if (this.options.draggable) {
        this.options.draggable.enabled = this.isEditing;
      }

      this.options.fixedRowHeight = settings.rowsHeight ?? DEFAULT_GRIDSTER_CONFIG.fixedRowHeight;

      // -- hack to scroll with mobile
      this.options.outerMarginRight = this.isEditing ? 30 : 0;

      this.options.resizable.enabled = this.isEditing;

      this.options.minCols = settings.columns || DEFAULT_GRIDSTER_COLUMNS;
      this.options.maxCols = settings.columns || DEFAULT_GRIDSTER_COLUMNS;
      this.options.mobileBreakpoint = settings.oneColumnOnMobile ? MOBILE_BREAKPOINT : 0;

      if (this.options?.api?.optionsChanged) {
        this.options?.api?.optionsChanged();
      }
    }
  }

  // --------------------------------------------
  // -- Experimental Grouping
  currentGroupId: string | null = null;
  currentItem: { item: WidgetBaseSettings; originalX: number; originalY: number } | null = null;
  initialPositions: Array<{ item: WidgetBaseSettings; originalX: number; originalY: number }> = [];
  dragInterval: any;

  onDragStart(item: WidgetBaseSettings) {
    if (!item.groupId) {
      return;
    }

    this.initialPositions = this.widgets
      .filter((dashboardItem) => dashboardItem != item && dashboardItem.groupId === item.groupId)
      .map((dashboardItem) => ({
        item: dashboardItem,
        originalX: dashboardItem.x,
        originalY: dashboardItem.y,
      }));

    if (!this.initialPositions.length) {
      return;
    }

    this.currentGroupId = item.groupId;
    this.currentItem = {
      item: item,
      originalX: item.x,
      originalY: item.y,
    };
    this.dragInterval = setInterval(() => this.onDragMove(item), 50);
  }

  onDragMove(item: WidgetBaseSettings) {
    const movingItem = this.gridster().movingItem;
    if (this.currentGroupId && this.currentItem && movingItem) {
      item.x = movingItem.x;
      item.y = movingItem.y;

      const deltaX = movingItem.x - this.currentItem.originalX;
      const deltaY = movingItem.y - this.currentItem.originalY;
      console.log(deltaX);

      if (!deltaX && !deltaY) {
        return;
      }

      this.initialPositions.forEach((position) => {
        if (position.item !== item) {
          position.item.x = position.originalX + deltaX;
          position.item.y = position.originalY + deltaY;
        }
      });
      if (this.options.api && this.options.api.optionsChanged) {
        this.gridster()!.calculateLayout$.next(void 0);
        this.options.api.optionsChanged();
      }
    }
  }

  onDragStop(item: WidgetBaseSettings) {
    this.currentGroupId = null;
    this.currentItem = null;
    clearInterval(this.dragInterval);
  }
}
