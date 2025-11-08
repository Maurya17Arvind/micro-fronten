import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('chat');
  currentUser = signal<any>('');

  ngOnInit(): void {
    // 1. Listen for the specific event on the global window object
    window.addEventListener('user-selected', this.handleUserSelection as EventListener);

    // Don't forget to clean up the listener when the component is destroyed
    // This is a must-have for Angular Standalone components:
    // this.destroyRef.onDestroy(() => {
    //   window.removeEventListener('user-selected', this.handleUserSelection as EventListener);
    // });
  }

  private handleUserSelection = (event: CustomEvent) => {

    console.log(`Chat Window received user: ${event.detail}`);
    // Now you can update your component state or fetch messages
    this.currentUser.set(event.detail);
  };
}
