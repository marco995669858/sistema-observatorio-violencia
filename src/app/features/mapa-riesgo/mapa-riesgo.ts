import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, effect, ElementRef, input, OnDestroy, signal, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-mapa-riesgo',
  templateUrl: './mapa-riesgo.html',
  styleUrl: './mapa-riesgo.scss',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None
})
export class MapaRiesgo implements AfterViewInit, OnDestroy {
  // Estado del tema y contador dinámico
  isDarkMode = input<boolean>(false);
  alertCount = signal<number>(0);

  private map: any;
  private tileLayer: any;
  private markersLayerGroup: any; // Para agrupar y limpiar marcadores al refrescar

  @ViewChild('mapContainer') mapContainer!: ElementRef;

  constructor() {
    effect(() => {
      this.updateMapTheme(this.isDarkMode());
    });
  }

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap() {
    const L = (window as any).L;
    if (!L) {
      console.error('Leaflet no encontrado en window.L. Asegúrate de incluirlo en index.html');
      return;
    }

    // Centro inicial: Lima
    const center: [number, number] = [-12.046374, -77.042793];

    this.map = L.map('map', {
      center: center,
      zoom: 12,
      zoomControl: true,
      attributionControl: false,
    });

    this.markersLayerGroup = L.layerGroup().addTo(this.map);
    this.updateMapTheme(this.isDarkMode());

    // Cargar alertas desde la memoria
    this.loadAlertsFromMemory(L);
  }

  private updateMapTheme(isDark: boolean) {
    const L = (window as any).L;
    if (!this.map || !L) return;

    if (this.tileLayer) {
      this.map.removeLayer(this.tileLayer);
    }

    const style = isDark ? 'dark_all' : 'light_all';
    const url = `https://{s}.basemaps.cartocdn.com/${style}/{z}/{x}/{y}{r}.png`;

    this.tileLayer = L.tileLayer(url, { maxZoom: 19 }).addTo(this.map);
  }

  private loadAlertsFromMemory(L: any) {
    const savedData = localStorage.getItem('observatorio_alertas');

    if (savedData) {
      const alertas: AlertaData[] = JSON.parse(savedData);
      this.alertCount.set(alertas.length);

      // Limpiar marcadores antiguos si recargamos
      this.markersLayerGroup.clearLayers();

      alertas.forEach((alerta) => {
        // Simulamos coordenadas aleatorias dispersas alrededor del centro (Lima)
        // ya que el formulario no captura GPS real todavía
        const offsetLat = (Math.random() - 0.5) * 0.15;
        const offsetLng = (Math.random() - 0.5) * 0.15;
        const coords: [number, number] = [-12.046374 + offsetLat, -77.042793 + offsetLng];

        // Mapeamos el color según el estado almacenado
        let markerColor = '#4f46e5'; // Default (Medio / Bajo)
        if (alerta.statusClass === 'critical') markerColor = '#ef4444';
        else if (alerta.statusClass === 'high') markerColor = '#f59e0b';
        else if (alerta.statusClass === 'resolved') markerColor = '#10b981';

        // Estructura HTML para el Popup
        const popupContent = `
          <div style="font-family: inherit; padding: 5px;">
            <div style="font-size: 0.7rem; font-weight: bold; color: #64748b; margin-bottom: 2px;">${alerta.id}</div>
            <strong style="color: ${markerColor}; font-size: 1.1rem; display: block; margin-bottom: 8px;">${alerta.type}</strong>
            <div style="font-size: 0.85rem; margin-bottom: 4px;"><b>📍 Zona:</b> ${alerta.location}</div>
            <div style="font-size: 0.85rem; margin-bottom: 8px;"><b>⚠️ Estado:</b> ${alerta.status}</div>
            <p style="margin: 0; font-size: 0.8rem; opacity: 0.8; border-top: 1px solid #e2e8f0; padding-top: 8px;">
              ${alerta.descripcion || 'Sin descripción detallada.'}
            </p>
          </div>
        `;

        L.circleMarker(coords, {
          radius: 10,
          fillColor: markerColor,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        })
          .addTo(this.markersLayerGroup)
          .bindPopup(popupContent);
      });
    }
  }

  recenterMap() {
    if (this.map) {
      this.map.setView([-12.046374, -77.042793], 12);
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }
}
