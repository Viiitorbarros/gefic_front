import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { VendaService } from '../vendas/venda.service';
import { ClienteService } from '../clientes/cliente.service';

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

  constructor(
    private vendaService: VendaService,
    private clienteService: ClienteService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // 1º Carregamos os clientes, depois as vendas
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
        // Cruzamos os dados: Se o clienteId da venda bater com o do cliente, pegamos o nome
        this.vendas = dadosVendas.map(venda => {
          const clienteEncontrado = this.clientes.find(c => c.id === venda.clienteId);
          return {
            ...venda,
            nomeCliente: clienteEncontrado ? clienteEncontrado.nome : 'Cliente Deletado/Não Encontrado'
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
      // Agora o filtro busca TANTO no nome do produto QUANTO no nome do cliente!
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
}