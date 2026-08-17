import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UltimaVenda {
  id: number;
  nomeCliente: string;
  dataVenda: string;
}

export interface VendaMensal {
  mes: string;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly API_URL = 'http://localhost:8080/dashboard';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': token ? token : ''
    });
  }

  obterResumo(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/resumo`, { headers: this.getHeaders() });
  }

  obterUltimasVendas(): Observable<UltimaVenda[]> {
    return this.http.get<UltimaVenda[]>(`${this.API_URL}/ultimas-vendas`, { headers: this.getHeaders() });
  }

  obterVendasMensais(): Observable<VendaMensal[]> {
    return this.http.get<VendaMensal[]>(`${this.API_URL}/vendas-mensais`, { headers: this.getHeaders() });
  }


}