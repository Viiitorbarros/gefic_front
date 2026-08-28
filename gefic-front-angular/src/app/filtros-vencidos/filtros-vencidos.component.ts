import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { VendaService } from '../vendas/venda.service'; 
import { ClienteService } from '../clientes/cliente.service'; 

@Component({
  selector: 'app-filtros-vencidos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './filtros-vencidos.component.html'
})
export class FiltrosVencidosComponent implements OnInit {
  vendasVencidas: any[] = [];
  vendasFiltradas: any[] = [];
  clientes: any[] = [];
  termoBuscaVenda: string = '';

  // --- VARIÁVEIS DO MODAL DE CLIENTE ---
  mostrarModalCliente: boolean = false;
  novoClienteModal = {
    nome: '',
    numeroTelefone: '',
    email: '',
    endereco: '',
    bairro: '',
    cidade: ''
  };

  constructor(
    private vendaService: VendaService,
    private clienteService: ClienteService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.clienteService.listar().subscribe({
      next: (dadosClientes) => {
        this.clientes = dadosClientes;
        this.carregarVendasVencidas();
      }
    });
  }

  carregarVendasVencidas() {
    this.vendaService.listarVencidos().subscribe({
      next: (dadosVendasVencidas) => {
        this.vendasVencidas = dadosVendasVencidas.map((venda: any) => {
          const cliente = this.clientes.find(c => c.id === venda.clienteId);
          return {
            ...venda,
            nomeCliente: cliente ? cliente.nome : 'Cliente Não Encontrado',
            telefone: cliente ? cliente.numeroTelefone : 'Sem telefone'
          };
        });
        
        this.vendasFiltradas = this.vendasVencidas;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao buscar as vendas vencidas do back-end', erro);
      }
    });
  }

  filtrarVendas() {
    if (!this.termoBuscaVenda) {
      this.vendasFiltradas = this.vendasVencidas;
    } else {
      const termo = this.termoBuscaVenda.toLowerCase();
      this.vendasFiltradas = this.vendasVencidas.filter(v => 
        (v.nomeDoProduto && v.nomeDoProduto.toLowerCase().includes(termo)) ||
        (v.nomeCliente && v.nomeCliente.toLowerCase().includes(termo))
      );
    }
    this.cdr.detectChanges();
  }

  editarVenda(id: number) {
    this.router.navigate(['/vendas/editar', id]);
  }

  // ==========================================
  // FUNÇÕES DO MODAL DE CLIENTE
  // ==========================================
  abrirModalCliente() {
    this.mostrarModalCliente = true;
    this.cdr.detectChanges();
  }

  fecharModalCliente() {
    this.mostrarModalCliente = false;
    this.novoClienteModal = { 
      nome: '', numeroTelefone: '', email: '', endereco: '', bairro: '', cidade: '' 
    };
    this.cdr.detectChanges();
  }

  salvarClientePeloModal() {
    this.clienteService.cadastrar(this.novoClienteModal).subscribe({
      next: (resposta) => {
        this.fecharModalCliente();
        this.carregarDados(); // Recarrega os dados caso o cliente novo já tenha filtro vencido
        alert('Cliente cadastrado com sucesso!');
      },
      error: (erro) => {
        console.error(erro);
        alert('Erro ao cadastrar o cliente.');
      }
    });
  }
}