import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('users');
  users = [
    {
      id: 1,
      name: 'Alice Maxwell',
      initials: 'AL',
      lastMessage: 'Hey, got a minute?',
      time: '2:03 PM',
      online: true,
    },
    {
      id: 2,
      name: 'John S.',
      initials: 'JS',
      lastMessage: 'Shared a file — design_v3.sketch',
      time: 'Yesterday',
      online: false,
    },
    {
      id: 3,
      name: 'Team Group',
      initials: 'ME',
      lastMessage: '3 new messages',
      time: 'Fri',
      online: false,
    },
    {
      id: 4,
      name: 'Ravi Kumar',
      initials: 'RK',
      lastMessage: 'I’ll send it by EOD.',
      time: '11:12 AM',
      online: true,
    },
    {
      id: 5,
      name: 'Nora Patel',
      initials: 'NP',
      lastMessage: 'Thanks for the update!',
      time: 'Mon',
      online: false,
    },
  ];

  ngOnInit(): void {
    setTimeout(() => {
      this.selectUser(this.users[0]);
    }, 1000);
  }
  selectUser(user: any): void {
    // 1. Create a CustomEvent with a unique name
    const event = new CustomEvent('user-selected', {
      detail: user,
      bubbles: true, // Allow the event to bubble up the DOM
      composed: true, // Allow it to cross shadow DOM boundaries (good practice)
    });

    // 2. Dispatch the event on the global window object
    window.dispatchEvent(event);
  }
}
