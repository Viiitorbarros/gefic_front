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
    this.isEditando = false; 
    this.novoCliente = { id: null, nome: '', numeroTelefone: '', email: '', endereco: '', bairro: '', cidade: '' };
    
    // Zera as mensagens antes de abrir!
    this.mensagemSucessoModal = '';
    this.mensagemErroModal = '';
    
    this.mostrarModalCliente = true;
    this.cdr.detectChanges();
  }

  // NOVA FUNÇÃO: Abre a janelinha já com os dados preenchidos
  abrirModalEdicao(cliente: any) {
    this.isEditando = true; 
    this.novoCliente = { ...cliente }; 
    
    // Zera as mensagens antes de abrir!
    this.mensagemSucessoModal = '';
    this.mensagemErroModal = '';
    
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
          }, 500); // Deixei 0.5s para dar tempo de ler a mensagem verde
        },
        error: (erro) => {
          this.mensagemErroModal = 'Erro ao atualizar os dados do cliente.';
          this.cdr.detectChanges(); // <-- Adicione esta linha!
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

  excluirCliente(cliente: any) {
    const confirmacao = window.confirm(`Tem certeza que deseja excluir o cliente ${cliente.nome}?`);
    
    if (confirmacao) {
      this.clienteService.excluir(cliente.id).subscribe({
        next: (resposta) => {
          alert('Cliente excluído com sucesso!'); 
          
          // Arranca o cliente da lista principal imediatamente
          this.clientes = this.clientes.filter(c => c.id !== cliente.id);
          
          // Roda o seu filtro para atualizar a tabela visual (clientesFiltrados)
          this.filtrarClientes(); 
          
          //  Força a tela a desenhar a tabela nova
          this.cdr.detectChanges();
        },
        error: (erro) => {
          alert('Erro ao excluir. Este cliente pode ter vendas amarradas a ele no banco de dados.');
        }
      });
    }
  }

}