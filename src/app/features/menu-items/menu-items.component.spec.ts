import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MenuStateService } from '../../core/services/menu-state.service';
import { MenuItemsComponent } from './menu-items.component';

describe('MenuItemsComponent', () => {
  let fixture: ComponentFixture<MenuItemsComponent>;
  let menuState: MenuStateService;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [MenuItemsComponent],
      providers: [MenuStateService],
    }).compileComponents();

    menuState = TestBed.inject(MenuStateService);
    menuState.init({
      sections: [
        {
          id: 'type-1',
          title: 'Тип 1',
          items: [
            { id: 'item-1', label: 'Item 1', value: 20 },
            { id: 'item-2', label: 'Item 2', value: 30 },
          ],
        },
      ],
    });

    fixture = TestBed.createComponent(MenuItemsComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should update selection when checkbox change is triggered', () => {
    const checkboxDebug = fixture.debugElement.query(By.css('input[type="checkbox"]'));
    expect(checkboxDebug).toBeTruthy();

    expect(menuState.selectedCount()).toBe(0);

    checkboxDebug.triggerEventHandler('change', null);
    fixture.detectChanges();

    expect(menuState.selectedCount()).toBe(1);
    expect(menuState.totalValue()).toBe(20);
    expect(checkboxDebug.nativeElement.checked).toBe(true);

    checkboxDebug.triggerEventHandler('change', null);
    fixture.detectChanges();

    expect(menuState.selectedCount()).toBe(0);
    expect(menuState.totalValue()).toBe(0);
    expect(checkboxDebug.nativeElement.checked).toBe(false);
  });
});
