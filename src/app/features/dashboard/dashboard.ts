import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
})
export class Dashboard implements OnInit {
  // Signals para KPIs
  kpiTotales = signal(0);
  kpiCriticas = signal(0);
  kpiTrata = signal(0);

  // Datos dinámicos para el gráfico
  chartData = signal<number[]>([0, 0, 0, 0, 0, 0, 0]);

  // Lista de alertas recientes
  recentAlerts = signal<AlertaData[]>([]);

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Leemos la memoria compartida que guarda el componente Alertas
    const savedData = localStorage.getItem('observatorio_alertas');

    if (savedData) {
      const alertas: AlertaData[] = JSON.parse(savedData);

      // 1. Calculamos los KPIs
      this.kpiTotales.set(alertas.length);
      this.kpiCriticas.set(alertas.filter((a) => a.statusClass === 'critical').length);
      this.kpiTrata.set(alertas.filter((a) => a.type.toLowerCase().includes('trata')).length);

      // 2. Extraemos las últimas 4 alertas para la lista reciente
      this.recentAlerts.set(alertas.slice(0, 4));

      // 3. Generamos datos dinámicos para el gráfico basados en el total de reportes
      this.generateDynamicChart(alertas.length);
    }
  }

  // Simula una distribución de datos en los últimos 7 días
  private generateDynamicChart(totalAlerts: number) {
    if (totalAlerts === 0) {
      this.chartData.set([0, 0, 0, 0, 0, 0, 0]);
      return;
    }

    // Algoritmo simple para distribuir el total y generar porcentajes para las barras visuales
    const pattern = [0.15, 0.25, 0.1, 0.3, 0.05, 0.05, 0.1];
    const randomVariations = pattern.map((p) => {
      // Calculamos un estimado de barras de 0 a 100
      let value = Math.floor(p * totalAlerts * 10 + Math.random() * 20);
      return Math.min(100, Math.max(10, value)); // Aseguramos que se vean bien visualmente
    });

    this.chartData.set(randomVariations);
  }
}
