import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, effect, ElementRef, input, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-mapa-riesgo',
  templateUrl: './mapa-riesgo.html',
  styleUrl: './mapa-riesgo.scss',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None
})
export class MapaRiesgo implements AfterViewInit, OnDestroy{
  // Recibimos el estado del tema como un input para evitar errores de importación circular
  isDarkMode = input<boolean>(false);

  private map: any;
  private tileLayer: any;

  @ViewChild('mapContainer') mapContainer!: ElementRef;

  constructor() {
    // Escuchamos el cambio de modo noche para actualizar los Tiles del mapa
    effect(() => {
      this.updateMapTheme(this.isDarkMode());
    });
  }

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap() {
    // Usamos la instancia global 'L' de Leaflet
    const L = (window as any).L;
    if (!L) {
      console.error('Leaflet no encontrado en window.L. Asegúrate de incluirlo en index.html');
      return;
    }

    // Coordenadas iniciales (Ejemplo: Lima, Perú)
    const center: [number, number] = [-12.046374, -77.042793];

    this.map = L.map('map', {
      center: center,
      zoom: 13,
      zoomControl: true,
      attributionControl: false,
    });

    this.updateMapTheme(this.isDarkMode());

    // Añadir marcadores de prueba (Alertas)
    this.addMockAlerts(L);
  }

  private updateMapTheme(isDark: boolean) {
    const L = (window as any).L;
    if (!this.map || !L) return;

    if (this.tileLayer) {
      this.map.removeLayer(this.tileLayer);
    }

    // Usamos CartoDB Voyager para Light y CartoDB Dark Matter para Dark
    const style = isDark ? 'dark_all' : 'light_all';
    const url = `https://{s}.basemaps.cartocdn.com/${style}/{z}/{x}/{y}{r}.png`;

    this.tileLayer = L.tileLayer(url, {
      maxZoom: 19,
    }).addTo(this.map);
  }

  private addMockAlerts(L: any) {
    const alerts = [
      { coords: [-12.046, -77.042], type: 'Crítico', color: '#ef4444' },
      { coords: [-12.055, -77.035], type: 'Medio', color: '#f59e0b' },
      { coords: [-12.06, -77.05], type: 'Bajo', color: '#6366f1' },
    ];

    alerts.forEach((a) => {
      L.circleMarker(a.coords, {
        radius: 10,
        fillColor: a.color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      })
        .addTo(this.map)
        .bindPopup(`<b>Alerta Nivel ${a.type}</b><br>Zona de monitoreo preventivo.`);
    });
  }

  recenterMap() {
    if (this.map) {
      this.map.setView([-12.046374, -77.042793], 13);
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }
}
