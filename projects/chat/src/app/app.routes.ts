import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/chat-window/chat-window').then((c) => c.ChatWindow),
  },
];
