import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
interface UserData {
  userId: string | null;
  isAuthenticated: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class SharedStateService {
  private userSource = new BehaviorSubject<UserData>({ userId: null, isAuthenticated: false });
  user$ = this.userSource.asObservable();

  setUserData(data: UserData): void {
    this.userSource.next(data);
  }
}
