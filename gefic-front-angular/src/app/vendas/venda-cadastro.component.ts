import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router'; // <-- ActivatedRoute adicionado
import { VendaService } from '../vendas/venda.service';
import { ClienteService } from '../clientes/cliente.service';

@Component({
  selector: 'app-venda-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './venda-cadastro.component.html'
})
export class VendaCadastroComponent implements OnInit {
  
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

  // Variáveis para controlar se é Edição ou Cadastro
  isEdicao: boolean = false;
  vendaIdParaEditar: number | null = null;

  constructor(
    private vendaService: VendaService,
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute // <-- Para ler o /:id da URL
  ) {}

  ngOnInit() {
    this.carregarClientes();

    // Verifica a URL: se tiver um ID, estamos no modo de EDIÇÃO!
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEdicao = true;
        this.vendaIdParaEditar = Number(id);
        this.carregarVendaParaEdicao(this.vendaIdParaEditar);
      }
    });
  }

  carregarClientes() {
    this.clienteService.listar().subscribe({
      next: (dados) => {
        this.clientes = dados;
        this.clientesFiltrados = dados; 
        this.cdr.detectChanges(); 
      },
      error: (erro) => {
        console.error('Erro ao buscar clientes', erro);
      }
    });
  }

  // Busca os dados antigos e preenche a tela
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
        this.cdr.detectChanges(); // Atualiza a tela com os dados
      },
      error: (erro) => console.error('Erro ao carregar venda', erro)
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

  salvarVenda() {
    this.mensagemSucesso = '';
    this.mensagemErro = '';

    if (this.isEdicao && this.vendaIdParaEditar) {
      // MODO EDIÇÃO: Usa o método atualizar (PUT) do Service
      this.vendaService.atualizar(this.vendaIdParaEditar, this.novaVenda).subscribe({
        next: (resposta) => {
          this.mensagemSucesso = 'Venda atualizada com sucesso! Voltando para a lista...';
          this.cdr.detectChanges(); 
          setTimeout(() => this.router.navigate(['/vendas']), 1500); // Volta pra lista de vendas
        },
        error: (erro) => {
          this.mensagemErro = 'Erro ao atualizar a venda.';
          this.cdr.detectChanges(); 
        }
      });

    } else {
      // MODO CADASTRO: Usa o método cadastrar (POST) do Service
      this.vendaService.cadastrar(this.novaVenda).subscribe({
        next: (resposta) => {
          this.mensagemSucesso = 'Venda cadastrada com sucesso! Retornando ao Início...';
          this.cdr.detectChanges(); 
          setTimeout(() => this.router.navigate(['/dashboard']), 1500); // Volta pro Início
        },
        error: (erro) => {
          this.mensagemErro = 'Erro ao cadastrar a venda.';
          this.cdr.detectChanges(); 
        }
      });
    }
  }
}