import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { Alertas } from './features/alerts/alertas/alertas';
import { ReporteAlerta } from './features/alerts/reporte-alerta/reporte-alerta';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { MapaRiesgo } from './features/mapa-riesgo/mapa-riesgo';
import { MapaAnalisisRiesgo } from './features/mapa-analisis-riesgo/mapa-analisis-riesgo';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'alertas', component: Alertas, canActivate: [authGuard] },
  { path: 'reportar', component: ReporteAlerta, canActivate: [authGuard]},
  { path: 'mapa', component: MapaRiesgo, canActivate: [authGuard]},
  { path: 'mapa-analisis', component: MapaAnalisisRiesgo, canActivate: [authGuard]}

];
