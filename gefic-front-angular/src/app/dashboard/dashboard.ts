import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, UltimaVenda, VendaMensal } from './dashboard.service';
import { ClienteService } from '../clientes/cliente.service'; // <-- Import do serviço de cliente
import { Chart, registerables } from 'chart.js';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- Import do FormsModule para o Modal funcionar


Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // <-- FormsModule adicionado aqui
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

  // ==========================================
  // VARIÁVEIS DO MODAL DE CLIENTE
  // ==========================================
  mostrarModalCliente: boolean = false;
  mensagemErroModal: string = '';
  mensagemSucessoModal: string = '';
  
  // Objeto mapeado exatamente como no Java
  novoCliente = {
    nome: '',
    numeroTelefone: '',
    email: '',
    endereco: '',
    bairro: '',
    cidade: ''
  };

  constructor(
    private dashboardService: DashboardService,
    private clienteService: ClienteService, // <-- Serviço injetado no construtor
    private cdr: ChangeDetectorRef
  
  ) {}

  // --- VARIÁVEIS DO USUÁRIO ---
  nomeUsuario: string = 'Administrador'; // Nome completo
  primeiroNome: string = 'Admin';        // Só o primeiro nome para o "Bem-vindo"
  iniciais: string = 'AD';               // Letrinhas da bolinha azul


  carregarNomeUsuario() {
    // Busca o nome que nós salvamos lá na tela de Login
    const nomeSalvo = localStorage.getItem('nome_usuario');
    
    // Confere se o nome veio certinho e não está vazio
    if (nomeSalvo && nomeSalvo !== 'undefined' && nomeSalvo !== 'null' && nomeSalvo !== '') {
      this.nomeUsuario = nomeSalvo;
      
      const partes = nomeSalvo.trim().split(' ');
      this.primeiroNome = partes[0]; // Pega só o primeiro nome
      
      if (partes.length > 1) {
        // Exemplo: Vitor Barros -> VB
        this.iniciais = (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
      } else {
        // Exemplo: Vitor -> VI
        this.iniciais = partes[0].substring(0, 2).toUpperCase();
      }
    }
  }

  ngOnInit(): void {
    this.carregarResumo();
    this.carregarUltimasVendas();
    this.carregarGraficoVendas();
    this.carregarNomeUsuario();
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

  // ==========================================
  // FUNÇÕES DO MODAL DE CLIENTE
  // ==========================================
  abrirModalCliente() {
    this.mostrarModalCliente = true;
    this.mensagemErroModal = '';
    this.mensagemSucessoModal = '';
    this.cdr.detectChanges();
  }

 fecharModalCliente() {
    this.mostrarModalCliente = false;
    
    // Limpa os dados ao fechar
    this.novoCliente = { nome: '', numeroTelefone: '', email: '', endereco: '', bairro: '', cidade: '' };
    
    // ADICIONE ESTA LINHA: Força o Angular a sumir com a janela na mesma hora!
    this.cdr.detectChanges(); 
  }

  salvarCliente() {
    this.mensagemErroModal = '';
    this.mensagemSucessoModal = '';

    this.clienteService.cadastrar(this.novoCliente).subscribe({
      next: (resposta) => {
        this.mensagemSucessoModal = 'Cliente cadastrado com sucesso!';
        
        // Atualiza o contador de clientes no dashboard na mesma hora
        this.carregarResumo(); 
        
        // Fecha a janelinha após 1,5 segundos
        setTimeout(() => {
          this.fecharModalCliente();
        }, 400);
      },
      error: (erro) => {
        this.mensagemErroModal = 'Erro ao cadastrar. Verifique os dados.';
        console.error('Erro:', erro);
      }
    });
  }
}