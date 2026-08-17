import { Routes } from '@angular/router';
import { Login } from './login/login'; // <-- Mude de Login para LoginComponent
import { Dashboard } from './dashboard/dashboard';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard }
];