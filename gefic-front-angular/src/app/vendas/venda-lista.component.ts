import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { VendaService } from '../vendas/venda.service'; // Ajuste o caminho se necessário
import { ClienteService } from '../clientes/cliente.service'; // Ajuste o caminho se necessário

@Component({
  selector: 'app-venda-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './venda-lista.component.html'
})
export class VendaListaComponent implements OnInit {
  vendas: any[] = [];
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
    this.carregarClientesEVendas();
  }

  carregarClientesEVendas() {
    this.clienteService.listar().subscribe({
      next: (dadosClientes) => {
        this.clientes = dadosClientes;
        this.carregarVendas();
      }
    });
  }

  carregarVendas() {
    this.vendaService.listar().subscribe({
      next: (dadosVendas) => {
        this.vendas = dadosVendas.map(venda => {
          const clienteEncontrado = this.clientes.find(c => c.id === venda.clienteId);
          return {
            ...venda,
            nomeCliente: clienteEncontrado ? clienteEncontrado.nome : 'Cliente Não Encontrado'
          };
        });
        
        this.vendasFiltradas = this.vendas;
        this.cdr.detectChanges();
      }
    });
  }

  filtrarVendas() {
    if (!this.termoBuscaVenda) {
      this.vendasFiltradas = this.vendas;
    } else {
      const termo = this.termoBuscaVenda.toLowerCase();
      this.vendasFiltradas = this.vendas.filter(v => 
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
        // Recarrega os clientes caso você precise buscar vendas do cliente novo depois
        this.carregarClientesEVendas(); 
        alert('Cliente cadastrado com sucesso!');
      },
      error: (erro) => {
        console.error(erro);
        alert('Erro ao cadastrar o cliente.');
      }
    });
  }
}