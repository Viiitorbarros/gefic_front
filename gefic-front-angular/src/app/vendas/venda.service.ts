import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendaService {
  private API_URL = 'http://localhost:8080/pedido';

  constructor(private http: HttpClient) { }

  // --- MÉTODO NOVO PARA BUSCAR AS VENDAS ---
  listar(): Observable<any[]> {
    const token = localStorage.getItem('auth_token');
    const tokenLimpo = token ? token.replace('Bearer ', '').replace('Basic ', '').trim() : '';

    const headers = new HttpHeaders({
      'Authorization': `Basic ${tokenLimpo}` 
    });

    return this.http.get<any[]>(this.API_URL, { headers });
  }

  // --- SEU MÉTODO CADASTRAR CONTINUA AQUI INTACTO ---
  cadastrar(venda: any): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const tokenLimpo = token ? token.replace('Bearer ', '').replace('Basic ', '').trim() : '';

    const headers = new HttpHeaders({
      'Authorization': `Basic ${tokenLimpo}` 
    });

    return this.http.post<any>(this.API_URL, venda, { headers });
  }

  // Busca uma venda específica pelo ID
    buscarPorId(id: number): Observable<any> {
      const token = localStorage.getItem('auth_token');
      const tokenLimpo = token ? token.replace('Bearer ', '').replace('Basic ', '').trim() : '';
      const headers = new HttpHeaders({ 'Authorization': `Basic ${tokenLimpo}` });
      
      return this.http.get<any>(`${this.API_URL}/${id}`, { headers });
    }

    // Atualiza uma venda existente
    atualizar(id: number, venda: any): Observable<any> {
      const token = localStorage.getItem('auth_token');
      const tokenLimpo = token ? token.replace('Bearer ', '').replace('Basic ', '').trim() : '';
      const headers = new HttpHeaders({ 'Authorization': `Basic ${tokenLimpo}` });
      
      // O Spring Boot geralmente usa PUT para atualização
      return this.http.put<any>(`${this.API_URL}/${id}`, venda, { headers });
    }

}