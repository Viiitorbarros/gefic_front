import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router'; // <-- Importante para a barra lateral
import { ClienteService } from './cliente.service';

@Component({
  selector: 'app-cliente-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // <-- RouterModule adicionado aqui!
  templateUrl: './cliente-cadastro.html'
})
export class ClienteCadastro {
  
  // Agora o objeto tem exatamente os mesmos campos do HTML e do Backend
  cliente = {
    nome: '',
    numeroTelefone: '',
    email: '',
    endereco: '',
    bairro: '',
    cidade: ''
  };

  mensagemSucesso: string = '';
  mensagemErro: string = '';

  constructor(
    private clienteService: ClienteService,
    private router: Router
  ) {}

  salvarCliente() {
    this.mensagemSucesso = '';
    this.mensagemErro = '';

    this.clienteService.cadastrar(this.cliente).subscribe({
      next: (resposta) => {
        this.mensagemSucesso = 'Cliente cadastrado com sucesso! Redirecionando...';
        
        // Limpa o formulário
        this.cliente = { nome: '', numeroTelefone: '', email: '', endereco: '', bairro: '', cidade: '' }; 
        
        // Volta para o Dashboard após 1 segundo e meio
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (erro) => {
        this.mensagemErro = 'Erro ao cadastrar. Verifique os dados e tente novamente.';
        console.error('Erro detalhado:', erro);
      }
    });
  }
}