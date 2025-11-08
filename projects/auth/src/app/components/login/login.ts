import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = new FormBuilder();

  // reactive form
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [true],
  });

  // signals for UI
  loading = signal(false);
  showPassword = signal(false);
  errorMessage = signal<string | null>(null);

  // derived values for template
  emailInvalid = computed(() => {
    const ctrl = this.form.get('email');
    return !!(ctrl && ctrl.touched && ctrl.invalid);
  });
  passwordInvalid = computed(() => {
    const ctrl = this.form.get('password');
    return !!(ctrl && ctrl.touched && ctrl.invalid);
  });

  // convenience getters used in template
  showPasswordFn() {
    return this.showPassword();
  }
  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  async submit() {
    // reset
    await this.router.navigateByUrl('/chat');

    this.errorMessage.set(null);
    // remove early navigation; validate form first
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    const { email, password, remember } = this.form.value;
    try {
      await this.auth.login(email, password, !!remember);
      // navigate to dashboard (adjust path)
      await this.router.navigateByUrl('/chat');
    } catch (err: any) {
      // handle error for UX
      const msg = this.mapError(err);
      this.errorMessage.set(msg);
    } finally {
      this.loading.set(false);
    }
  }

  private mapError(err: any): string {
    // Customize mapping using HttpErrorResponse codes if needed
    if (!err) return 'Login failed. Try again.';
    if (err.status === 401) return 'Invalid credentials. Check email and password.';
    if (err.status === 0) return 'Network error. Check your connection.';
    return err.error?.message ?? err.message ?? 'Login failed. Try again.';
  }
}
