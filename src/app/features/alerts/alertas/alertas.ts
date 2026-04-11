import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Alerta } from '../../../core/models/alerta';

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.html',
  styleUrl: './alertas.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  encapsulation: ViewEncapsulation.None,
})
export class Alertas implements OnInit {
  private fb = inject(FormBuilder);

  // Estados para los Modales
  showCreateModal = signal(false);
  selectedAlert = signal<Alerta | null>(null); // Para el modal de detalles

  // Filtro activo
  activeFilter = signal('Todas');

  // Datos de Alertas (Se inicializan vacíos, se llenan en el OnInit)
  alertas = signal<Alerta[]>([]);

  // Opciones para el formulario
  tipos = ['Violencia Física', 'Violencia Psicológica', 'Violencia Económica', 'Trata de Personas', 'Ciberacoso'];
  niveles = ['Bajo', 'Medio', 'Alto', 'Crítico'];

  // Formulario Reactivo
  alertForm = this.fb.group({
    tipo: ['Violencia Física', Validators.required],
    departamento: [''],
    provincia: [''],
    distrito: [''],
    riesgo: ['Bajo', Validators.required],
    descripcion: ['', Validators.required]
  });

  ngOnInit() {
    this.loadAlertsFromMemory();
  }

  // --- LÓGICA DE MEMORIA (LocalStorage) ---
  private loadAlertsFromMemory() {
    const saved = localStorage.getItem('observatorio_alertas');
    if (saved) {
      this.alertas.set(JSON.parse(saved));
    } else {
      // Si no hay datos, cargamos los mock iniciales
      const mockInitial: Alerta[] = [
        { id: 'AL-001', type: 'Violencia Física', location: 'Sector Norte', time: 'Hace 10 min', status: 'Crítica', statusClass: 'critical', descripcion: 'Reporte inicial de violencia física.' },
        { id: 'AL-002', type: 'Posible Trata', location: 'Terminal Sur', time: 'Hace 45 min', status: 'Alta', statusClass: 'high', descripcion: 'Movimiento sospechoso en terminal de buses.' },
        { id: 'AL-003', type: 'Acoso Callejero', location: 'Zona Centro', time: 'Hace 2 horas', status: 'Media', statusClass: 'medium', descripcion: 'Acoso verbal repetitivo en plaza principal.' }
      ];
      this.alertas.set(mockInitial);
      this.saveAlertsToMemory();
    }
  }

  private saveAlertsToMemory() {
    localStorage.setItem('observatorio_alertas', JSON.stringify(this.alertas()));
  }

  // --- FILTROS ---
  filteredAlertas = computed(() => {
    const filter = this.activeFilter();
    const alerts = this.alertas();
    if (filter === 'Todas') return alerts;
    return alerts.filter(
      (a) =>
        (filter === 'Críticas' && a.status === 'Crítica') ||
        (filter === 'Alta' && a.status === 'Alta') ||
        (filter === 'Resueltas' && a.status === 'Resuelta')
    );
  });

  filtros = ['Todas', 'Críticas', 'Alta', 'Resueltas'];

  setFilter(filtro: string) {
    this.activeFilter.set(filtro);
  }

  // --- GESTIÓN DE MODALES Y ACCIONES ---
  openCreateModal() {
    this.alertForm.reset({ tipo: 'Violencia Física', riesgo: 'Bajo' });
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  setRiesgo(nivel: string) {
    this.alertForm.patchValue({ riesgo: nivel });
  }

  saveAlert() {
    if (this.alertForm.valid) {
      const formValue = this.alertForm.value;

      // Determinamos la clase CSS basada en el nivel de riesgo
      let sClass = 'medium';
      if (formValue.riesgo === 'Crítico') sClass = 'critical';
      if (formValue.riesgo === 'Alto') sClass = 'high';
      if (formValue.riesgo === 'Bajo') sClass = 'resolved';

      const nuevaAlerta: Alerta = {
        id: 'AL-' + Math.floor(Math.random() * 900 + 100), // ID Aleatorio AL-XXX
        type: formValue.tipo!,
        location: formValue.departamento || 'Sin ubicación específica',
        time: 'Justo ahora',
        status: formValue.riesgo === 'Crítico' ? 'Crítica' : formValue.riesgo!,
        statusClass: sClass,
        descripcion: formValue.descripcion!,
        departamento: formValue.departamento || '',
        provincia: formValue.provincia || '',
        distrito: formValue.distrito || ''
      };

      // Actualizamos el signal y guardamos en memoria
      this.alertas.update(current => [nuevaAlerta, ...current]);
      this.saveAlertsToMemory();

      this.closeCreateModal();
    } else {
      this.alertForm.markAllAsTouched();
    }
  }

  deleteAlert(id: string) {
    if(confirm('¿Estás seguro de eliminar esta alerta?')) {
      this.alertas.update(current => current.filter(a => a.id !== id));
      this.saveAlertsToMemory();
      this.closeDetailsModal(); // Por si se elimina desde los detalles
    }
  }

  openDetailsModal(alerta: Alerta) {
    this.selectedAlert.set(alerta);
  }

  closeDetailsModal() {
    this.selectedAlert.set(null);
  }
}
