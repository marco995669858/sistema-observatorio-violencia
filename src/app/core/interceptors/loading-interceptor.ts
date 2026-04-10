import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { LoadingService } from '../services/loading-service';

export const loadingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const loadingService = inject(LoadingService);

  // Activamos el loading al iniciar la petición
  loadingService.show();

  return next(req).pipe(
    // Agregamos un delay opcional para evitar parpadeos en redes ultra rápidas
    // delay(400),
    finalize(() => {
      // Desactivamos el loading al finalizar (éxito o error)
      loadingService.hide();
    }),
  );
};
