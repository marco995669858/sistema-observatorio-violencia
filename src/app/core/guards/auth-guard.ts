import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Verificamos si existe nuestro UUID simulado en el almacenamiento local
  const token = localStorage.getItem('obs_auth_token');

  if (token) {
    // Si existe, permitimos el acceso a la ruta
    return true;
  } else {
    // Si no existe (no está logueado), lo pateamos a la pantalla de login
    router.navigate(['/login']);
    return false;
  }
};
