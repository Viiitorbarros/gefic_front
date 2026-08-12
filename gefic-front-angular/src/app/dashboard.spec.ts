import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  obterResumo(): Observable<any> {
    // Pega o crachá salvo no momento do login
    const token = localStorage.getItem('auth_token');
    
    // Anexa o crachá na requisição
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + token
    });

    return this.http.get(`${this.apiUrl}/dashboard/resumo`, { headers });
  }
}