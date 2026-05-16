import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MenuStateService } from '../../core/services/menu-state.service';

@Component({
  selector: 'app-menu-header',
  imports: [],
  templateUrl: './menu-header.component.html',
  styleUrl: './menu-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuHeaderComponent {
  readonly menuState = inject(MenuStateService);
}
