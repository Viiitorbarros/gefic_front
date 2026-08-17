
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
    const credenciaisCodificadas = btoa(dadosLogin.username + ':' + dadosLogin.password);
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + credenciaisCodificadas
    });

    return this.http.post(`${this.apiUrl}/login`, {}, { headers });
  }
}