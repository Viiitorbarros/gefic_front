import { Routes } from '@angular/router';
import { Login } from './login/login'; 
import { Dashboard } from './dashboard/dashboard';
import { ClienteLista } from './clientes/cliente-lista';
import { ClienteCadastro } from './clientes/cliente-cadastro'; 
import { VendaCadastroComponent } from './vendas/venda-cadastro.component';

// 1. Importe o novo componente de Lista
import { VendaListaComponent } from './vendas/venda-lista.component'; 

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'clientes', component: ClienteLista },
  { path: 'clientes/novo', component: ClienteCadastro },
  
  { path: 'vendas/nova', component: VendaCadastroComponent },
  
  // 2. Adicione a rota de Buscar Vendas aqui:
  { path: 'vendas', component: VendaListaComponent }, 

  { path: 'vendas/editar/:id', component: VendaCadastroComponent },
];