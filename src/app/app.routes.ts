import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/welcome/welcome.component').then((m) => m.WelcomeComponent),
    title: 'Главная',
  },
  {
    path: 'menu',
    loadComponent: () => import('./pages/menu/menu.component').then((m) => m.MenuComponent),
    title: 'Меню',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
