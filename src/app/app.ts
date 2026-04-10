import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { LoadingSpinner } from "./shared/components/loading-spinner/loading-spinner";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, LoadingSpinner],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  encapsulation: ViewEncapsulation.None
})
export class App {
  private router = inject(Router);

  isDarkMode = signal(false);

  // Lógica para detectar si debemos mostrar el Navbar
  // No queremos mostrarlo en 'login' ni en 'registrar'
  showNavbar = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        const url = this.router.url;
        return !(url.includes('login') || url.includes('registrar') || url === '/');
      })
    ),
    { initialValue: false }
  );

  toggleTheme() {
    this.isDarkMode.update((v) => !v);
  }
}
