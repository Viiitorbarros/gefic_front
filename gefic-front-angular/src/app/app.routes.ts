import { Routes } from '@angular/router';
import { Login } from './login/login'; 
import { Dashboard } from './dashboard/dashboard';
import { ClienteLista } from './clientes/cliente-lista';
import { ClienteCadastro } from './clientes/cliente-cadastro'; // <-- 1. Adicione este import

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'clientes', component: ClienteLista },
  
  // 2. Coloque a rota de cadastro de volta aqui:
  { path: 'clientes/novo', component: ClienteCadastro } 
];