import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, tap, throwError, catchError } from 'rxjs';

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  user?: { id: string; email: string; name?: string };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  // Emits current auth user / token presence
  private _isAuthenticated$ = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this._isAuthenticated$.asObservable();

  // simple storage key - adapt as needed
  private readonly TOKEN_KEY = 'app_access_token';

  // check token presence
  private hasToken(): boolean {
    try {
      const t = localStorage.getItem(this.TOKEN_KEY);
      return !!t;
    } catch {
      return false;
    }
  }

  // login call — adapt URL to your backend
  async login(email: any, password: any, remember = false): Promise<LoginResponse> {
    const body = { email, password };
    const obs = this.http.post<LoginResponse>('/api/auth/login', body).pipe(
      tap((resp) => this.handleLoginSuccess(resp, remember)),
      catchError((err: HttpErrorResponse) => {
        return throwError(() => err);
      })
    );
    return firstValueFrom(obs);
  }

  private handleLoginSuccess(resp: LoginResponse, remember: boolean) {
    const token = resp.accessToken;
    if (!token) {
      throw new Error('No token returned from login endpoint');
    }
    try {
      // choose storage based on remember
      if (remember) {
        localStorage.setItem(this.TOKEN_KEY, token);
      } else {
        sessionStorage.setItem(this.TOKEN_KEY, token);
      }
    } catch {
      // fallback
      sessionStorage.setItem(this.TOKEN_KEY, token);
    }
    this._isAuthenticated$.next(true);
  }

  // logout
  logout() {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.TOKEN_KEY);
    } finally {
      this._isAuthenticated$.next(false);
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY) ?? sessionStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Register a new user.
   * - payload: { name, email, password, acceptTerms }
   * - If backend returns tokens, store them same as login.
   */
  async register(payload: {
    name: any;
    email: any;
    password: any;
    acceptTerms?: any;
  }): Promise<LoginResponse> {
    const body = {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      acceptTerms: !!payload.acceptTerms,
    };

    const obs = this.http.post<LoginResponse>('/api/auth/register', body).pipe(
      tap((resp) => {
        // If your API returns tokens on register, handle them the same way as login.
        if (resp?.accessToken) {
          this.handleLoginSuccess(resp, true); // remember by default after signup
        }
      }),
      catchError((err: HttpErrorResponse) => {
        return throwError(() => err);
      })
    );

    return firstValueFrom(obs);
  }
}
