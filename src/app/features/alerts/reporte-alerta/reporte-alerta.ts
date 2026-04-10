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

  // Datos de Ubicación (Simulación de base de datos)
  ubicaciones = {
    Lima: {
      Lima: ['Miraflores', 'San Isidro', 'Cercado de Lima', 'Santiago de Surco'],
      Cañete: ['San Vicente', 'Asia', 'Mala'],
      Huaral: ['Huaral', 'Chancay'],
    },
    Arequipa: {
      Arequipa: ['Yanahuara', 'Cercado', 'Cayma', 'Jose Luis Bustamante'],
      Islay: ['Mollendo', 'Mejía'],
      Camaná: ['Camaná', 'Jose Maria Quimper'],
    },
    Cusco: {
      Cusco: ['Cusco', 'Santiago', 'Wanchaq'],
      Urubamba: ['Urubamba', 'Ollantaytambo', 'Machupicchu'],
    },
  };

  // Opciones de configuración
  tipos = [
    'Violencia Física',
    'Violencia Psicológica',
    'Violencia Económica',
    'Trata de Personas',
    'Ciberacoso',
  ];
  niveles = ['Bajo', 'Medio', 'Alto', 'Crítico'];

  // Listas dinámicas
  departamentos = Object.keys(this.ubicaciones);
  provincias: string[] = [];
  distritos: string[] = [];

  // Definición del formulario reactivo
  alertForm = this.fb.group({
    tipo: ['Violencia Física', Validators.required],
    riesgo: ['Bajo', Validators.required],
    departamento: ['', Validators.required],
    provincia: [{ value: '', disabled: true }, Validators.required],
    distrito: [{ value: '', disabled: true }, Validators.required],
    descripcion: ['', [Validators.required, Validators.minLength(10)]],
  });

  constructor() {
    // Lógica de cascada para Provincias
    this.alertForm.get('departamento')?.valueChanges.subscribe((dept) => {
      if (dept) {
        this.provincias = Object.keys((this.ubicaciones as any)[dept]);
        this.alertForm.get('provincia')?.enable();
        this.alertForm.get('provincia')?.setValue('');
        this.alertForm.get('distrito')?.disable();
        this.alertForm.get('distrito')?.setValue('');
      }
    });

    // Lógica de cascada para Distritos
    this.alertForm.get('provincia')?.valueChanges.subscribe((prov) => {
      const dept = this.alertForm.get('departamento')?.value;
      if (dept && prov) {
        this.distritos = (this.ubicaciones as any)[dept][prov];
        this.alertForm.get('distrito')?.enable();
        this.alertForm.get('distrito')?.setValue('');
      }
    });
  }

  setRiesgo(nivel: string) {
    this.alertForm.patchValue({ riesgo: nivel });
  }

  onSubmit() {
    if (this.alertForm.valid) {
      console.log('Alerta registrada:', this.alertForm.getRawValue());
      alert('¡Alerta enviada con éxito!');
      this.alertForm.reset({ tipo: 'Violencia Física', riesgo: 'Bajo' });
    } else {
      this.alertForm.markAllAsTouched();
    }
  }
}
