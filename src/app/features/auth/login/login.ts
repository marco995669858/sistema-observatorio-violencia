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
  encapsulation: ViewEncapsulation.None
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  isLoading = signal(false);
  toast = signal<string | null>(null);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit() {
    /* onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('Sesión activa:', user.uid);
      }
    }); */
  }

  async handleLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    try {
      /* await signInAnonymously(auth); */
      this.showToast('Acceso validado. Iniciando entorno...');
      this.router.navigate(["/dashboard"])
    } catch (error) {
      this.showToast('Error de conexión. Intente de nuevo.');
    } finally {
      this.isLoading.set(false);
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
