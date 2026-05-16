export interface MenuItem {
  id: string;
  label: string;
  value: number;
}

export interface MenuSection {
  id: string;
  title: string;
  items: MenuItem[];
}

export interface MenuData {
  sections: MenuSection[];
}

export type SelectionState = Record<string, ReadonlySet<string>>;
