import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MenuStateService } from '../../core/services/menu-state.service';

@Component({
  selector: 'app-menu-sidebar',
  imports: [],
  templateUrl: './menu-sidebar.component.html',
  styleUrl: './menu-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuSidebarComponent {
  readonly menuState = inject(MenuStateService);

  protected selectSection(sectionId: string): void {
    this.menuState.setActiveSection(sectionId);
  }
}
