import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MenuItemsComponent } from '../../features/menu-items/menu-items.component';
import { MenuSidebarComponent } from '../../features/menu-sidebar/menu-sidebar.component';
import { MenuHeaderComponent } from '../../layout/menu-header/menu-header.component';
import { MenuDataService } from '../../core/services/menu-data.service';

@Component({
  selector: 'app-menu',
  imports: [AsyncPipe, RouterLink, MenuHeaderComponent, MenuSidebarComponent, MenuItemsComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  readonly menuReady$ = inject(MenuDataService).ensureLoaded();
}
