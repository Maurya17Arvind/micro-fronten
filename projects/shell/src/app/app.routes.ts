import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
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
        exposedModule: './Component',
      }).then((m) => m.App),
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
