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

  // Declarada exatamente com o nome que está no HTML
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
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (erro: any) => {
        console.error('Erro no login:', erro);
        this.mensagemErro = 'Usuário ou senha inválidos!';
      }
    });
  }
}