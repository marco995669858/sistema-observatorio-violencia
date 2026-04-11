import { CommonModule } from '@angular/common';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-mapa-analisis-riesgo',
  templateUrl: './mapa-analisis-riesgo.html',
  styleUrl: './mapa-analisis-riesgo.scss',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None
})
export class MapaAnalisisRiesgo {
  private sanitizer = inject(DomSanitizer);

  // URL de la experiencia de ArcGIS
  private readonly rawUrl = 'https://experience.arcgis.com/experience/9142fc616ad240639cb62b8ea2ae86e3/';

  // Sanitizamos la URL para que Angular permita cargarla en el iframe
  safeUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.rawUrl);
}
