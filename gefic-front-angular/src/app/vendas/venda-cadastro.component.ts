import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { VendaService } from '../vendas/venda.service';
import { ClienteService } from '../clientes/cliente.service';

@Component({
  selector: 'app-venda-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './venda-cadastro.component.html'
})
export class VendaCadastroComponent implements OnInit {
  
  // --- VARIÁVEIS DA VENDA ---
  clientes: any[] = [];
  clientesFiltrados: any[] = []; 
  termoBuscaCliente: string = ''; 
  
  novaVenda = {
    clienteId: null,
    nomeDoProduto: '',
    dataDaCompra: '',
    dataDaUltimaTroca: '',
    dataDoVencimento: ''
  };

  mensagemSucesso = '';
  mensagemErro = '';

  // --- VARIÁVEIS DE EDIÇÃO ---
  isEdicao: boolean = false;
  vendaIdParaEditar: number | null = null;

  // --- VARIÁVEIS DO MODAL DE CLIENTE ---
  mostrarModalCliente: boolean = false;
  // 1. Lá em cima, na criação da variável
  novoClienteModal = {
    nome: '',
    numeroTelefone: '', // <-- Alterado de 'telefone' para 'numeroTelefone'
    email: '',
    endereco: '',
    bairro: '',
    cidade: ''
  };

  constructor(
    private vendaService: VendaService,
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.carregarClientes();

    // Verifica se estamos no modo de Edição (se tem ID na URL)
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEdicao = true;
        this.vendaIdParaEditar = Number(id);
        this.carregarVendaParaEdicao(this.vendaIdParaEditar);
      }
    });
  }

  // ==========================================
  // LÓGICA DO MODAL DE CLIENTES
  // ==========================================
  abrirModalCliente() {
    this.mostrarModalCliente = true;
    this.cdr.detectChanges(); 
  }

  // 2. Lá embaixo, na função de fechar o modal
  fecharModalCliente() {
    this.mostrarModalCliente = false;
    this.novoClienteModal = { 
      nome: '', numeroTelefone: '', email: '', endereco: '', bairro: '', cidade: '' // <-- Alterado aqui também
    }; 
    this.cdr.detectChanges(); 
  }

  salvarClientePeloModal() {
    this.clienteService.cadastrar(this.novoClienteModal).subscribe({
      next: (resposta) => {
        this.fecharModalCliente();
        this.carregarClientes(); // Recarrega a lista para o cliente novo aparecer nela
        alert('Cliente cadastrado com sucesso!');
      },
      error: (erro) => {
        console.error(erro);
        alert('Erro ao cadastrar o cliente.');
      }
    });
  }

  // ==========================================
  // LÓGICA DE VENDAS E CLIENTES
  // ==========================================
  carregarClientes() {
    this.clienteService.listar().subscribe({
      next: (dados) => {
        this.clientes = dados;
        this.clientesFiltrados = dados; 
        this.cdr.detectChanges(); 
      },
      error: (erro) => console.error('Erro ao buscar clientes', erro)
    });
  }

  filtrarClientesList() {
    if (!this.termoBuscaCliente) {
      this.clientesFiltrados = this.clientes;
    } else {
      const termo = this.termoBuscaCliente.toLowerCase();
      this.clientesFiltrados = this.clientes.filter(c => 
        c.nome.toLowerCase().includes(termo)
      );
    }
    this.cdr.detectChanges(); 
  }

  carregarVendaParaEdicao(id: number) {
    this.vendaService.buscarPorId(id).subscribe({
      next: (vendaAntiga) => {
        this.novaVenda = {
          clienteId: vendaAntiga.clienteId,
          nomeDoProduto: vendaAntiga.nomeDoProduto,
          dataDaCompra: vendaAntiga.dataDaCompra,
          dataDaUltimaTroca: vendaAntiga.dataDaUltimaTroca,
          dataDoVencimento: vendaAntiga.dataDoVencimento
        };
        this.cdr.detectChanges(); 
      },
      error: (erro) => console.error('Erro ao carregar venda para edição', erro)
    });
  }

  salvarVenda() {
    this.mensagemSucesso = '';
    this.mensagemErro = '';

    if (this.isEdicao && this.vendaIdParaEditar) {
      this.vendaService.atualizar(this.vendaIdParaEditar, this.novaVenda).subscribe({
        next: (resposta) => {
          this.mensagemSucesso = 'Venda atualizada com sucesso! Voltando para a lista...';
          this.cdr.detectChanges(); 
          setTimeout(() => this.router.navigate(['/vendas']), 1500);
        },
        error: (erro) => {
          this.mensagemErro = 'Erro ao atualizar a venda.';
          this.cdr.detectChanges(); 
        }
      });
    } else {
      this.vendaService.cadastrar(this.novaVenda).subscribe({
        next: (resposta) => {
          this.mensagemSucesso = 'Venda cadastrada com sucesso! Retornando ao Início...';
          this.cdr.detectChanges(); 
          setTimeout(() => this.router.navigate(['/dashboard']), 1500);
        },
        error: (erro) => {
          this.mensagemErro = 'Erro ao cadastrar a venda.';
          this.cdr.detectChanges(); 
        }
      });
    }
  }
}