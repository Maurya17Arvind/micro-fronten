import { AsyncPipe, NgComponentOutlet } from '@angular/common';
import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { LoadProjects } from './service/load-projects';
import { SharedStateService } from './service/shared-state-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgComponentOutlet, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private loadProjects = inject(LoadProjects);
  private SharedStateService = inject(SharedStateService);
  private router = inject(Router);

  protected readonly title = signal('shell');

  // Use BehaviorSubject to manage component loading state
  headerComponent = new BehaviorSubject<any>(null);
  userListComponent = new BehaviorSubject<any>(null);
  chatWindowComponent = new BehaviorSubject<any>(null);

  // Signal to control visibility of users/chat micro-frontends
  showMicroFrontends = signal(true);

  async ngOnInit() {
    try {
      // Load components sequentially to avoid overwhelming the system
      console.log('Loading header component...');
      const headerComp = await this.loadProjects.loadRemoteComponent(4201, 'header');
      this.headerComponent.next(headerComp);

      console.log('Loading users component...');
      const usersComp = await this.loadProjects.loadRemoteComponent(4202, 'users');
      this.userListComponent.next(usersComp);

      console.log('Loading chat component...');
      const chatComp = await this.loadProjects.loadRemoteComponent(4203, 'chat');
      this.chatWindowComponent.next(chatComp);

      console.log('All components loaded successfully');
    } catch (error) {
      console.error('Error loading micro-frontends:', error);
    }

    // Hide users/chat when the current route is /profile
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects ?? (event as any).url;
        const isProfile = url.includes('/profile');
        console.log('NavigationEnd event:', url, 'isProfile:', isProfile);

        this.showMicroFrontends.set(!isProfile);
      }
    });

    this.SharedStateService.setUserData({ userId: '1', isAuthenticated: true });
  }
}
