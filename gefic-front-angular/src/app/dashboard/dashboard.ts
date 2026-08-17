import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, UltimaVenda, VendaMensal } from './dashboard.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  @ViewChild('salesChart') salesChartRef!: ElementRef<HTMLCanvasElement>;
  
  chart: any;
  totalClientes: number = 0;
  totalVendas: number = 0;
  filtrosVencidos: number = 0;
  ultimasVendas: UltimaVenda[] = [];

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarResumo();
    this.carregarUltimasVendas();
    this.carregarGraficoVendas();
  }

  carregarResumo() {
    this.dashboardService.obterResumo().subscribe({
      next: (dados: any) => {
        this.totalClientes = dados.clientes;
        this.totalVendas = dados.vendas;
        this.filtrosVencidos = dados.filtros;
        this.cdr.detectChanges();
      }
    });
  }

  carregarUltimasVendas() {
    this.dashboardService.obterUltimasVendas().subscribe({
      next: (dados: UltimaVenda[]) => {
        this.ultimasVendas = dados;
        this.cdr.detectChanges();
      }
    });
  }

  carregarGraficoVendas() {
    this.dashboardService.obterVendasMensais().subscribe({
      next: (dados: VendaMensal[]) => {
        const labels = dados.map(d => d.mes);
        const valores = dados.map(d => d.total);
        this.criarGrafico(labels, valores);
      },
      error: () => {
        // Mock padrão caso a API ainda não esteja pronta
        this.criarGrafico(['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'], [40, 65, 39, 56, 107, 73, 85]);
      }
    });
  }

  criarGrafico(labels: string[], data: number[]) {
    if (this.chart) {
      this.chart.destroy();
    }

    if (!this.salesChartRef) return;

    this.chart = new Chart(this.salesChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Vendas',
          data: data,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(224, 242, 254, 0.6)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#3b82f6',
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#f3f4f6' }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }
}