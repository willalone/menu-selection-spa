import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MenuStateService } from '../../core/services/menu-state.service';

@Component({
  selector: 'app-menu-items',
  imports: [],
  templateUrl: './menu-items.component.html',
  styleUrl: './menu-items.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuItemsComponent {
  readonly menuState = inject(MenuStateService);

  protected toggleItem(itemId: string): void {
    const sectionId = this.menuState.activeSectionId();
    if (!sectionId) {
      return;
    }

    this.menuState.toggleItem(sectionId, itemId);
  }

  protected isChecked(itemId: string): boolean {
    const sectionId = this.menuState.activeSectionId();
    return sectionId ? this.menuState.isSelected(sectionId, itemId) : false;
  }
}
