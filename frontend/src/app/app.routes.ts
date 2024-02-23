import { Routes } from '@angular/router';
import {authGuard} from "./_guard/auth.guard";

export const routes: Routes = [
  { path: '', redirectTo: 'tables', pathMatch: 'full'},
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: 'privacy', loadComponent: () => import('./privacy/privacy.component').then(m => m.PrivacyComponent) },
  { path: 'tables', loadComponent: () => import('./game/tables/tables.component').then(m => m.TablesComponent), canActivate: [authGuard] },
  { path: 'table/:tableId', loadComponent: () => import('./game/table/table.component').then(m => m.TableComponent), canActivate: [authGuard] },
];
