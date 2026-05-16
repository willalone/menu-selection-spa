import { MenuStateService } from './menu-state.service';

describe('MenuStateService', () => {
  let service: MenuStateService;

  const sampleMenu = {
    sections: [
      {
        id: 'type-1',
        title: 'Тип 1',
        items: [
          { id: 'item-1', label: 'Item 1', value: 20 },
          { id: 'item-3', label: 'Item 3', value: 40 },
        ],
      },
      {
        id: 'type-2',
        title: 'Тип 2',
        items: [{ id: 'item-1', label: 'Item 1', value: 15 }],
      },
    ],
  };

  beforeEach(() => {
    localStorage.clear();
    service = new MenuStateService();
    service.init(sampleMenu);
  });

  it('calculates selected count and total value for active section', () => {
    service.toggleItem('type-1', 'item-3');

    expect(service.selectedCount()).toBe(1);
    expect(service.totalValue()).toBe(40);
  });

  it('keeps selections per section when switching', () => {
    service.toggleItem('type-1', 'item-1');
    service.setActiveSection('type-2');
    service.toggleItem('type-2', 'item-1');

    service.setActiveSection('type-1');
    expect(service.selectedCount()).toBe(1);
    expect(service.totalValue()).toBe(20);
  });

  it('persists selection to localStorage', () => {
    service.toggleItem('type-1', 'item-3');

    const raw = localStorage.getItem('menu-selection-spa-state');
    expect(raw).toBeTruthy();

    const parsed = JSON.parse(raw!) as { selection: Record<string, string[]> };
    expect(parsed.selection['type-1']).toContain('item-3');
  });

  it('restores selection from localStorage on init', () => {
    localStorage.setItem(
      'menu-selection-spa-state',
      JSON.stringify({
        activeSectionId: 'type-1',
        selection: { 'type-1': ['item-3'], 'type-2': [] },
      }),
    );

    const fresh = new MenuStateService();
    fresh.init(sampleMenu);

    expect(fresh.selectedCount()).toBe(1);
    expect(fresh.totalValue()).toBe(40);
  });
});
