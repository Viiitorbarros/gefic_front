import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080'; 

  constructor(private http: HttpClient) { }

  fazerLogin(dadosLogin: any): Observable<any> {
    
    // 1. Junta o usuário e a senha no formato exigido pelo Basic Auth (usuario:senha)
    // e converte para Base64 usando a função btoa()
    const credenciaisCodificadas = btoa(dadosLogin.username + ':' + dadosLogin.password);

    // 2. Coloca o código gerado no cabeçalho Authorization
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + credenciaisCodificadas
    });

    // 3. Envia a requisição POST para o backend. 
    // Como o Spring agora vai ler do cabeçalho, mandamos um corpo vazio {}
    return this.http.post(`${this.apiUrl}/login`, {}, { headers });
  }
  
}