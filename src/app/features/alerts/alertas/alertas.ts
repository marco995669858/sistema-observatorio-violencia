import { CommonModule } from '@angular/common';
import { Component, computed, signal, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.html',
  styleUrl: './alertas.scss',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
})
export class Alertas {
  // Filtro activo
  activeFilter = signal('Todas');

  // Datos Mock de Alertas
  alertas = signal([
    {
      id: 'AL-001',
      type: 'Violencia Física',
      location: 'Sector Norte',
      time: 'Hace 10 min',
      status: 'Crítica',
      statusClass: 'critical',
    },
    {
      id: 'AL-002',
      type: 'Posible Trata',
      location: 'Terminal Sur',
      time: 'Hace 45 min',
      status: 'Alta',
      statusClass: 'high',
    },
    {
      id: 'AL-003',
      type: 'Acoso Callejero',
      location: 'Zona Centro',
      time: 'Hace 2 horas',
      status: 'Media',
      statusClass: 'medium',
    },
    {
      id: 'AL-004',
      type: 'Violencia Psicológica',
      location: 'Sector Este',
      time: 'Ayer',
      status: 'Resuelta',
      statusClass: 'resolved',
    },
    {
      id: 'AL-005',
      type: 'Ciberviolencia',
      location: 'Plataforma Digital',
      time: 'Ayer',
      status: 'Alta',
      statusClass: 'high',
    },
    {
      id: 'AL-006',
      type: 'Violencia Económica',
      location: 'Sector Oeste',
      time: 'Hace 2 días',
      status: 'Resuelta',
      statusClass: 'resolved',
    },
  ]);

  // Computed para filtrar alertas dinámicamente
  filteredAlertas = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'Todas') return this.alertas();
    return this.alertas().filter(
      (a) =>
        (filter === 'Críticas' && a.status === 'Crítica') ||
        (filter === 'Alta' && a.status === 'Alta') ||
        (filter === 'Resueltas' && a.status === 'Resuelta'),
    );
  });

  filtros = ['Todas', 'Críticas', 'Alta', 'Resueltas'];

  setFilter(filtro: string) {
    this.activeFilter.set(filtro);
  }
}
