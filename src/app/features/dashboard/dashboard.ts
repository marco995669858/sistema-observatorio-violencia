import { CommonModule } from '@angular/common';
import { Component, signal, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
})
export class Dashboard {
  // Usamos signals para un manejo de datos más moderno y eficiente
  chartData = signal([40, 70, 45, 90, 65, 30, 50]);

  // Datos simulados para las alertas recientes
  recentAlerts = signal([
    {
      id: 'AL-902',
      type: 'Incidente Detectado',
      zone: 'Sector Norte',
      time: 'Hace 5 min',
      status: 'high',
      label: 'Crítico',
    },
    {
      id: 'AL-895',
      type: 'Reporte de Seguimiento',
      zone: 'Sector Sur',
      time: 'Hace 2 horas',
      status: 'med',
      label: 'Medio',
    },
    {
      id: 'AL-884',
      type: 'Cierre de Caso',
      zone: 'Zona Centro',
      time: 'Hace 5 horas',
      status: 'low',
      label: 'Bajo',
    },
  ]);
}
