import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.spec';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  // Variáveis para guardar os números que virão do Java
  totalClientes: number = 0;
  totalVendas: number = 0;
  filtrosVencidos: number = 0;

  constructor(private dashboardService: DashboardService) {}

  // O ngOnInit roda automaticamente assim que a tela é aberta
  ngOnInit(): void {
    this.carregarResumo();
  }

  carregarResumo() {
    this.dashboardService.obterResumo().subscribe({
      next: (dados) => {
        this.totalClientes = dados.clientes;
        this.totalVendas = dados.vendas;
        this.filtrosVencidos = dados.filtros;
      },
      error: (erro) => {
        console.error('Erro ao buscar os dados do dashboard:', erro);
      }
    });
  }
}