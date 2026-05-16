import { computed, Injectable, signal } from '@angular/core';

import { MenuData, MenuSection, SelectionState } from '../models/menu.model';

const STORAGE_KEY = 'menu-selection-spa-state';

interface PersistedMenuState {
  activeSectionId: string | null;
  selection: Record<string, string[]>;
}

@Injectable({ providedIn: 'root' })
export class MenuStateService {
  private initialized = false;

  private readonly sectionsSignal = signal<readonly MenuSection[]>([]);
  private readonly activeSectionIdSignal = signal<string | null>(null);
  private readonly selectionSignal = signal<SelectionState>({});

  readonly sections = this.sectionsSignal.asReadonly();
  readonly activeSectionId = this.activeSectionIdSignal.asReadonly();

  readonly activeSection = computed(() => {
    const id = this.activeSectionIdSignal();
    return this.sectionsSignal().find((section) => section.id === id) ?? null;
  });

  readonly selectedCount = computed(() => {
    const section = this.activeSection();
    if (!section) {
      return 0;
    }

    const selectedIds = this.selectionSignal()[section.id] ?? new Set<string>();
    return selectedIds.size;
  });

  readonly totalValue = computed(() => {
    const section = this.activeSection();
    if (!section) {
      return 0;
    }

    const selectedIds = this.selectionSignal()[section.id] ?? new Set<string>();
    return section.items
      .filter((item) => selectedIds.has(item.id))
      .reduce((sum, item) => sum + item.value, 0);
  });

  init(data: MenuData): void {
    if (this.initialized) {
      return;
    }

    this.initialized = true;
    const sections = data.sections;
    this.sectionsSignal.set(sections);

    const emptySelection = Object.fromEntries(
      sections.map((section) => [section.id, new Set<string>()]),
    );
    this.selectionSignal.set(emptySelection);

    const persisted = this.readPersistedState();
    const firstSectionId = sections[0]?.id ?? null;

    if (persisted?.activeSectionId && sections.some((s) => s.id === persisted.activeSectionId)) {
      this.activeSectionIdSignal.set(persisted.activeSectionId);
    } else {
      this.activeSectionIdSignal.set(firstSectionId);
    }

    if (persisted?.selection) {
      this.selectionSignal.set(this.mergePersistedSelection(sections, persisted.selection));
    }
  }

  setActiveSection(sectionId: string): void {
    if (!this.sectionsSignal().some((section) => section.id === sectionId)) {
      return;
    }

    this.activeSectionIdSignal.set(sectionId);
    this.persistState();
  }

  isSelected(sectionId: string, itemId: string): boolean {
    return this.selectionSignal()[sectionId]?.has(itemId) ?? false;
  }

  toggleItem(sectionId: string, itemId: string): void {
    const section = this.sectionsSignal().find((entry) => entry.id === sectionId);
    if (!section?.items.some((item) => item.id === itemId)) {
      return;
    }

    const current = this.selectionSignal();
    const selected = new Set(current[sectionId] ?? []);

    if (selected.has(itemId)) {
      selected.delete(itemId);
    } else {
      selected.add(itemId);
    }

    this.selectionSignal.set({
      ...current,
      [sectionId]: selected,
    });
    this.persistState();
  }

  private mergePersistedSelection(
    sections: readonly MenuSection[],
    persisted: Record<string, string[]>,
  ): SelectionState {
    return Object.fromEntries(
      sections.map((section) => {
        const validIds = new Set(section.items.map((item) => item.id));
        const saved = persisted[section.id] ?? [];
        return [section.id, new Set(saved.filter((id) => validIds.has(id)))];
      }),
    );
  }

  private readPersistedState(): PersistedMenuState | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as PersistedMenuState) : null;
    } catch {
      return null;
    }
  }

  private persistState(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    const selection = this.selectionSignal();
    const serialized = Object.fromEntries(
      Object.entries(selection).map(([sectionId, ids]) => [sectionId, [...ids]]),
    );

    const payload: PersistedMenuState = {
      activeSectionId: this.activeSectionIdSignal(),
      selection: serialized,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }
}
