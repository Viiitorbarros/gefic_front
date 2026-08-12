import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importante para capturar os dados do formulário
import { AuthService } from '../auth'; // pode surgir um erro aqui , ficar de olho pq eu alterei 
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule], // Habilitando o uso de formulários neste componente
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  // Isso funciona como um "DTO" no frontend
  credenciais = {
    username: '', //  email,
    password: ''
  };

  // Injeção de dependência no construtor 
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Método que será chamado ao clicar no botão Entrar
  entrar() {
    // Chamamos o service e nos "inscrevemos" (subscribe) para aguardar a resposta do backend
    this.authService.fazerLogin(this.credenciais).subscribe({
      next: (resposta) => {
        console.log('Login realizado com sucesso!', resposta);
        alert('Login aprovado!');
        // Se deu sucesso, redireciona o usuário para o dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (erro) => {
        console.error('Erro na requisição de login', erro);
        alert('Falha no login. Verifique suas credenciais.');
      }
    });
  }

}