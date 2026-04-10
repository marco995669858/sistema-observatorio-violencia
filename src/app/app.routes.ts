import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { Alertas } from './features/alerts/alertas/alertas';
import { ReporteAlerta } from './features/alerts/reporte-alerta/reporte-alerta';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { MapaRiesgo } from './features/mapa-riesgo/mapa-riesgo';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'registrar', component: Register },
  { path: 'dashboard', component: Dashboard },
  { path: 'alertas', component: Alertas },
  { path: 'reportar', component: ReporteAlerta},
  { path: 'mapa', component: MapaRiesgo}

];
