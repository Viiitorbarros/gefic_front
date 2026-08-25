import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClienteService } from './cliente.service';

@Component({
  selector: 'app-cliente-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cliente-lista.html'
})
export class ClienteLista implements OnInit {
  
  clientes: any[] = [];
  clientesFiltrados: any[] = [];
  termoBusca: string = '';

  // Variáveis da Janelinha (Modal)
  mostrarModalCliente: boolean = false;
  mensagemSucessoModal: string = '';
  mensagemErroModal: string = '';
  novoCliente: any = { id: null, nome: '', numeroTelefone: '', email: '', endereco: '', bairro: '', cidade: '' };

  constructor(
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes() {
    this.clienteService.listar().subscribe({
      next: (dados) => {
        this.clientes = dados;
        this.clientesFiltrados = dados;
        
        // ADICIONE ESTA LINHA: Força o Angular a desenhar a tabela na mesma hora!
        this.cdr.detectChanges(); 
      },
      error: (erro) => {
        console.error('Erro ao buscar clientes:', erro);
      }
    });
  }

 filtrarClientes() {
    if (this.termoBusca) {
      const termo = this.termoBusca.toLowerCase();
      this.clientesFiltrados = this.clientes.filter(c => 
        c.nome?.toLowerCase().includes(termo) || 
        c.email?.toLowerCase().includes(termo) ||
        c.numeroTelefone?.includes(termo)
      );
    } else {
      // Se a barra estiver vazia, volta a mostrar todos os clientes
      this.clientesFiltrados = this.clientes;
    }
    
    // Força o Angular a desenhar os resultados na mesma hora!
    this.cdr.detectChanges();
  }

  // ==========================================
  // FUNÇÕES DA JANELINHA (MODAL)
  // ==========================================
  
  // Nova variável para saber o que a janelinha está fazendo
  isEditando: boolean = false; 

  abrirModalCliente() {
    this.isEditando = false; // Modo Criação
    this.novoCliente = { nome: '', numeroTelefone: '', email: '', endereco: '', bairro: '', cidade: '' };
    this.mostrarModalCliente = true;
    this.cdr.detectChanges();
  }

  // NOVA FUNÇÃO: Abre a janelinha já com os dados preenchidos
  abrirModalEdicao(cliente: any) {
    this.isEditando = true; // Modo Edição
    this.novoCliente = { ...cliente }; // O "..." cria uma cópia exata do cliente para não alterar a tabela antes de salvar
    this.mostrarModalCliente = true;
    this.cdr.detectChanges();
  }

  fecharModalCliente() {
    this.mostrarModalCliente = false;
    this.isEditando = false;
    this.novoCliente = { nome: '', numeroTelefone: '', email: '', endereco: '', bairro: '', cidade: '' };
    this.cdr.detectChanges();
  }

  salvarCliente() {
    this.mensagemErroModal = '';
    this.mensagemSucessoModal = '';

    if (this.isEditando) {
      // -----------------------------------------
      // MODO EDIÇÃO
      // -----------------------------------------
      this.clienteService.atualizar(this.novoCliente.id, this.novoCliente).subscribe({
        next: (resposta) => {
          this.mensagemSucessoModal = 'Cliente atualizado com sucesso!';
          this.carregarClientes(); // Atualiza a tabela
          
          setTimeout(() => {
            this.fecharModalCliente();
          }, 1500); // Deixei 1.5s para dar tempo de ler a mensagem verde
        },
        error: (erro) => {
          this.mensagemErroModal = 'Erro ao atualizar os dados do cliente.';
        }
      });

    } else {
      // -----------------------------------------
      // MODO CRIAÇÃO (O que já funcionava)
      // -----------------------------------------
      this.clienteService.cadastrar(this.novoCliente).subscribe({
        next: (resposta) => {
          this.mensagemSucessoModal = 'Cliente cadastrado com sucesso!';
          this.carregarClientes();
          
          setTimeout(() => {
            this.fecharModalCliente();
          }, 1500); 
        },
        error: (erro) => {
          this.mensagemErroModal = 'Erro ao cadastrar. Verifique se o nome está preenchido.';
        }
      });
    }
  }
}