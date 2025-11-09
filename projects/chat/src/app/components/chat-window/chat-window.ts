import { loadRemoteModule } from '@angular-architects/native-federation';
import { AsyncPipe, NgComponentOutlet } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-chat-window',
  imports: [NgComponentOutlet, AsyncPipe],
  templateUrl: './chat-window.html',
  styleUrl: './chat-window.scss',
})
export class ChatWindow {
  currentUser = signal<any>('');
  userListComponent = new BehaviorSubject<any>(null);
  headerComponent = new BehaviorSubject<any>(null);

  async ngOnInit() {
    // 1. Listen for the specific event on the global window object

    // 2. Load header component
    const headerComp = await this.loadRemoteComponent(4201, 'header');
    this.headerComponent.next(headerComp);

    // 3. Load users component
    const usersComp = await this.loadRemoteComponent(4202, 'users');
    this.userListComponent.next(usersComp);

    // Hide users/chat when the current route is /profile

    window.addEventListener('user-selected', this.handleUserSelection as EventListener);
  }
  private handleUserSelection = (event: CustomEvent) => {
    console.log(`Chat Window received user: ${event.detail}`);
    // Now you can update your component state or fetch messages
    this.currentUser.set(event.detail);
  };

  async loadRemoteComponent(
    port: number,
    remoteName: string,
    exposedModule: string = './Component'
  ): Promise<any> {
    try {
      console.log(
        `Attempting to load ${remoteName} from http://localhost:${port}/remoteEntry.json`
      );

      const module = await loadRemoteModule({
        remoteEntry: `http://localhost:${port}/remoteEntry.json`,
        remoteName,
        exposedModule: exposedModule,
      });

      console.log(`Module loaded for ${remoteName}:`, Object.keys(module));

      // For Native Federation, the component is typically the default export
      // or the named export matching the class name
      const component = module.default || module.App || module[Object.keys(module)[0]] || module;

      if (!component) {
        throw new Error(`No valid component found in ${remoteName} module`);
      }

      console.log(
        `Component extracted for ${remoteName}:`,
        component.name || 'Anonymous Component'
      );
      return component;
    } catch (error) {
      console.error(`Failed to load remote component ${remoteName} from port ${port}:`, error);
      throw error;
    }
  }
}
