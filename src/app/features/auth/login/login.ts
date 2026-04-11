import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  encapsulation: ViewEncapsulation.None,
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  private correosPermitidos = [
    'gustavo.salazar@unwomen.org',
    'grace.armijos@unwomen.org',
    'emely.max@unwomen.org',
    'andrea.llerena@unwomen.org',
    'teresa.guerra@unwomen.org',
    'pcarranza@mujeres.gob.mx',
    'carredondo@mujeres.gob.mx',
    'parrieta@mujeres.gob.mx',
    'frodriguez@data4sdgs.org',
  ];

  isLoading = signal(false);
  toast = signal<string | null>(null);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      // 3. Lógica de validación simulada
      if (this.correosPermitidos.includes(email!) && password === '12345678') {
        const uuid = crypto.randomUUID ? crypto.randomUUID() : 'token-' + Date.now();
        localStorage.setItem('obs_auth_token', uuid);
        // Redirigimos al dashboard tras un éxito
        this.router.navigate(['/dashboard']);
      } else {
        // Mostramos error si las credenciales no coinciden
        this.showToast('Correo o contraseña incorrectos.');
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  isInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  private showToast(msg: string) {
    this.toast.set(msg);
    setTimeout(() => this.toast.set(null), 4000);
  }
}
