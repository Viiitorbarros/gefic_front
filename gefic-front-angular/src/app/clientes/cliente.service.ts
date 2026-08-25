import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  // Ajuste a URL caso a sua rota no Spring Boot seja diferente
  private readonly API_URL = 'http://localhost:8080/cliente'; 

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': token ? token : ''
    });
  }

  cadastrar(cliente: any): Observable<any> {
    return this.http.post<any>(this.API_URL, cliente, { headers: this.getHeaders() });
  }

  listar(): Observable<any[]> {
  return this.http.get<any[]>(this.API_URL, { headers: this.getHeaders() });
  }

 atualizar(id: number, cliente: any) {
    // 1. Pega o token que foi salvo no login 
    const token = localStorage.getItem('token'); 
    
    // 2. Cria o cabeçalho de autorização
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    // 3. Envia a requisição com os cabeçalhos
    // Repare na barra antes do ${id}, ela impede erros na URL!
    return this.http.put(`${this.API_URL}/${id}`, cliente, { headers }); 
  }

}