import { Component, OnInit } from '@angular/core';
import { MediaQueryService } from '../../services/media-query.service';
import { PageAction, PageTitleService } from '../../../core/services/page-title-service.service';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { takeUntil } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'toolbar-actions',
    templateUrl: './toolbar-actions.component.html',
    styleUrls: ['./toolbar-actions.component.scss'],
    imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule]
})
export class ToolbarActionsComponent implements OnInit {
  actions: PageAction[];
  actionsPinned: PageAction[];
  constructor(
    public pageTitleService: PageTitleService,   public mediaQuery: MediaQueryService
  ) {

    this.pageTitleService.actions$.pipe(takeUntilDestroyed()).subscribe((actions) => {
      this.actions = actions;
      this.actionsPinned = actions.filter(a => a.mobilePinned);
    })

  }

  ngOnInit(): void {
  }
}
