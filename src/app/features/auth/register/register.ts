import { CommonModule } from '@angular/common';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DniService } from '../../../core/services/dni-service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { Constantes } from '../../../core/constants/Constantes';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrl: './register.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ToastModule, RippleModule],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService]
})
export class Register {
  private fb = inject(FormBuilder);
  private dniService = inject(DniService);
  private messageService = inject(MessageService);

  // Validador de comparación
  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    return password && confirmPassword && password.value !== confirmPassword.value
      ? { mismatch: true }
      : null;
  };

  registerForm = this.fb.group(
    {
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      nombre: [{ value: '', disabled: true }, [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: [this.passwordMatchValidator],
    },
  );

  get f() {
    return this.registerForm.controls;
  }

  onRegister() {
    if (this.registerForm.valid) {
      console.log('Usuario registrado:', this.registerForm.value);
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  onInput() {
    let dni = this.f['dni'].value;
    if (dni?.length == 8) {
      this.dniService.getConsultarDni(dni).subscribe({
        next: (r) => {
          if (!r?.success) return this.showToast(Constantes.ICON_WARNING, Constantes.TITULO_WARNING, Constantes.MENSAJE_WARNING);

          this.registerForm.patchValue({
            dni: r.dni,
            nombre: `${r.nombres} ${r.apellidoPaterno} ${r.apellidoMaterno}`,
          })

        },
      });
    }
  }

  private showToast(severity:string, summary: string, detail:string){
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
  }
}
