import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/login/login').then((c) => c.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./components/sign-up/sign-up').then((c) => c.SignUp),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
