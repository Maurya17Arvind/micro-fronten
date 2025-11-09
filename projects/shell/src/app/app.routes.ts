import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: 'http://localhost:4204/remoteEntry.json',
        remoteName: 'auth',
        exposedModule: './routes',
      }).then((m) => m.routes),
  },
  {
    path: 'chat',
    loadChildren: () =>
      loadRemoteModule({
        remoteEntry: 'http://localhost:4203/remoteEntry.json',
        remoteName: 'chat',
        exposedModule: './routes',
      }).then((m) => m.routes),
  },
  {
    path: 'profile',
    loadChildren: () =>
      loadRemoteModule({
        remoteName: 'header',
        exposedModule: './routes',
      }).then((m) => m.routes),
  },
];
