import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  standalone: true,
  imports: [CommonModule,RouterLink, RouterLinkActive]
})
export class Navbar {
  private router = inject(Router)
  // Recibe el estado del tema desde app.ts
  isDarkMode = input<boolean>(false);

  // Emite el evento de clic hacia app.ts
  onToggleTheme = output<void>();

  logout(){
    localStorage.clear();
    this.router.navigate(["/login"])
  }
}
