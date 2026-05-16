import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, shareReplay, tap } from 'rxjs';

import { MenuData } from '../models/menu.model';
import { MenuStateService } from './menu-state.service';

@Injectable({ providedIn: 'root' })
export class MenuDataService {
  private readonly http = inject(HttpClient);
  private readonly menuState = inject(MenuStateService);

  private readonly menuData$ = this.http.get<MenuData>('assets/menu.json').pipe(
    tap((data) => this.menuState.init(data)),
    shareReplay({ bufferSize: 1, refCount: false }),
  );

  loadMenu(): Observable<MenuData> {
    return this.menuData$;
  }

  ensureLoaded(): Observable<boolean> {
    return this.menuData$.pipe(map(() => true));
  }
}
