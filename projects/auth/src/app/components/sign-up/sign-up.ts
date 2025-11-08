import { Component, computed, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router, RouterLink } from '@angular/router';

function matchPasswords(control: AbstractControl): ValidationErrors | null {
  const pw = control.get('password')?.value;
  const cpw = control.get('confirmPassword')?.value;
  if (pw !== cpw) {
    return { passwordsMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
})
export class SignUp {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = new FormBuilder();

  form = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]],
    },
    { validators: matchPasswords }
  );

  loading = signal(false);
  showPassword = signal(false);
  errorMessage = signal<string | null>(null);

  // computed helpers
  nameInvalid = () => {
    const c = this.form.get('name');
    return !!(c && c.touched && c.invalid);
  };
  emailInvalid = () => {
    const c = this.form.get('email');
    return !!(c && c.touched && c.invalid);
  };
  passwordInvalid = () => {
    const c = this.form.get('password');
    return !!(c && c.touched && c.invalid);
  };
  confirmPasswordInvalid = () => {
    const c = this.form.get('confirmPassword');
    const mismatch = this.form.errors?.['passwordsMismatch'];
    return !!((c && c.touched && c.invalid) || (c && c.touched && mismatch));
  };
  termsInvalid = () => {
    const c = this.form.get('acceptTerms');
    return !!(c && c.touched && c.invalid);
  };

  // password strength computed value
  passwordStrength = computed(() => {
    const pw = this.form.get('password')?.value || '';
    // simple strength heuristic
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (pw.length >= 12) score++;
    if (score <= 2) return 'Weak';
    if (score === 3 || score === 4) return 'Medium';
    return 'Strong';
  });

  passwordStrengthLabel() {
    return this.passwordStrength();
  }

  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  async submit() {
    this.errorMessage.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const { name, email, password, acceptTerms } = this.form.value;

    try {
      const resp = await this.auth.register({ name, email, password, acceptTerms });
      // If backend returned token, AuthService already handled it (see register implementation).
      if (resp?.accessToken) {
        // logged in — go to dashboard
        await this.router.navigate(['/dashboard']);
        return;
      }
      // else navigate to verification page
      await this.router.navigate(['/verify-email'], { queryParams: { email } });
    } catch (err: any) {
      if (!err) {
        this.errorMessage.set('Registration failed. Try again.');
      } else if (err.status === 409) {
        // conflict - already exists
        this.errorMessage.set('An account with this email already exists.');
      } else if (err.status === 0) {
        this.errorMessage.set('Network error. Check your connection.');
      } else {
        this.errorMessage.set(
          err.error?.message ?? err.message ?? 'Registration failed. Try again.'
        );
      }
    } finally {
      this.loading.set(false);
    }
  }
}
