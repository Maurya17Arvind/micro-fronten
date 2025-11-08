import { loadRemoteModule } from '@angular-architects/native-federation';
import { Component, inject, Injector, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private injector = inject(Injector);
  protected readonly title = signal('header');

  isAuthenticated$!: Observable<boolean>;


  async ngOnInit() {
    // 1. Dynamically load the service class from the remote
    const remoteModule = await loadRemoteModule('shell', './SharedStateService');
    const RemoteSharedStateService = remoteModule.SharedStateService;

    // 2. Get the INSTANCE of the service from the Shell's injector
    // (This is only safe because the service is {providedIn: 'root'} in the Shell)
    const sharedStateService:any = this.injector.get(RemoteSharedStateService);

    // 3. Now you can use the service as if it were local
    this.isAuthenticated$ = sharedStateService.user$.pipe(map((u:any) => u.isAuthenticated));
    console.log(this.isAuthenticated$,'this.isAuthenticated$');

  }
}

