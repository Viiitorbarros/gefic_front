import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  credenciais = {
    username: '',
    password: ''
  };

  mensagemErro: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  entrar() {
    this.authService.fazerLogin(this.credenciais).subscribe({
      // Capturamos a resposta do backend aqui
      next: (resposta: any) => {
        
        // Verifica se o seu Spring Boot enviou o nome do usuário no JSON (ex: resposta.nome).
        // Caso seu backend envie apenas o Token e não envie o nome, 
        // usamos o username que a pessoa digitou na tela como alternativa.
        const nomeParaSalvar = (resposta && resposta.nome) ? resposta.nome : this.credenciais.username;
        
        // Salva o nome no navegador para o cabeçalho puxar depois
        localStorage.setItem('nome_usuario', nomeParaSalvar);

        this.router.navigate(['/dashboard']);
      },
      error: (erro: any) => {
        console.error('Erro no login:', erro);
        this.mensagemErro = 'Usuário ou senha inválidos!';
      }
    });
  }
}