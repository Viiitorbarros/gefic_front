import { TestBed } from '@angular/core/testing';

// 1. Importe o SERVIÇO, e não a interface
import { VendaService } from '../vendas/venda.service';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Necessário para testar serviços que usam HttpClient

describe('VendaService', () => {
  // 2. A variável deve ser do tipo VendaService
  let service: VendaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // 3. Adicione o HttpClientTestingModule para o teste não quebrar
      imports: [HttpClientTestingModule] 
    });
    // 4. Injete o VendaService
    service = TestBed.inject(VendaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});