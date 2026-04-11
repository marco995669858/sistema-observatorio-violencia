import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-reporte-alerta',
  templateUrl: './reporte-alerta.html',
  styleUrl: './reporte-alerta.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ReporteAlerta {
  private fb = inject(FormBuilder);
  // Opcional: HttpClient para la conexión real.
  // private http = inject(HttpClient);

  // Estados de la UI
  isSubmitting = signal(false);
  successMessage = signal(false);

  // --- DATOS SIMULADOS DE UBIGEO ---
  ubicaciones: Record<string, Record<string, string[]>> = {
    Lima: {
      Lima: ['Cercado de Lima', 'Ate', 'Miraflores', 'San Isidro', 'San Juan de Lurigancho'],
      Cañete: ['San Vicente', 'Asia', 'Mala'],
      Huaral: ['Huaral', 'Chancay'],
    },
    Arequipa: {
      Arequipa: ['Yanahuara', 'Cercado', 'Cayma', 'Jose Luis Bustamante'],
      Islay: ['Mollendo', 'Mejía'],
    },
    Cusco: {
      Cusco: ['Cusco', 'Santiago', 'Wanchaq'],
      Urubamba: ['Urubamba', 'Ollantaytambo'],
    },
    'La Libertad': {
      Trujillo: ['Trujillo', 'Huanchaco', 'Moche', 'Víctor Larco Herrera'],
    },
  };

  departamentos = Object.keys(this.ubicaciones);
  provincias: string[] = [];
  distritos: string[] = [];

  // Formulario Reactivo
  reportForm = this.fb.group({
    destinatario: ['', [Validators.required, Validators.email]],
    asunto: ['Reporte Situacional de Alertas', Validators.required],
    departamento: ['', Validators.required],
    provincia: [{ value: '', disabled: true }, Validators.required],
    distrito: [{ value: '', disabled: true }, Validators.required],
    mensaje: [''],
  });

  constructor() {
    // 1. Lógica de cascada: Departamento -> Provincia
    this.reportForm.get('departamento')?.valueChanges.subscribe((dept) => {
      if (dept) {
        this.provincias = Object.keys(this.ubicaciones[dept]);
        this.reportForm.get('provincia')?.enable();
        this.reportForm.get('provincia')?.setValue('');
        this.distritos = [];
        this.reportForm.get('distrito')?.disable();
        this.reportForm.get('distrito')?.setValue('');

        // Auto-actualizar asunto sugerido
        this.reportForm.patchValue({ asunto: `Reporte de Alertas - Región ${dept}` });
      }
    });

    // 2. Lógica de cascada: Provincia -> Distrito
    this.reportForm.get('provincia')?.valueChanges.subscribe((prov) => {
      const dept = this.reportForm.get('departamento')?.value;
      if (dept && prov) {
        this.distritos = this.ubicaciones[dept][prov];
        this.reportForm.get('distrito')?.enable();
        this.reportForm.get('distrito')?.setValue('');
      }
    });
  }

  enviarReporte() {
    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.successMessage.set(false);

    // 1. Recopilar datos del formulario incluyendo los campos deshabilitados
    const data = this.reportForm.getRawValue();



    /* ===============================================================
      INTEGRACIÓN REAL CON LA API (Descomentar en entorno real)
      ===============================================================
      this.http.post('http://localhost:8080/api/emails/send-alert', payload)
        .pipe(
          catchError(err => {
            console.error('Error enviando el correo', err);
            alert('Hubo un error al enviar el correo.');
            return of(null);
          }),
          finalize(() => this.isSubmitting.set(false))
        )
        .subscribe(response => {
          if (response) {
            this.successMessage.set(true);
            this.reportForm.reset();
          }
        });
    */

    // SIMULACIÓN DE CONEXIÓN (Para que lo pruebes visualmente ahora mismo)
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.successMessage.set(true);
      // Reiniciamos el formulario dejando los selects en estado inicial
      this.reportForm.reset({ departamento: '', provincia: '', distrito: '' });
      this.reportForm.get('provincia')?.disable();
      this.reportForm.get('distrito')?.disable();
    }, 2000); // Simulamos 2 segundos de carga en el servidor
  }
}
