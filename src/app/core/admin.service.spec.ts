import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { AdminService } from './admin.service';

describe('AdminService', () => {
  let service: AdminService;
  let http: HttpTestingController;
  const base = `${environment.apiUrl}/admin`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AdminService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('crea una cola con POST /admin/queues', () => {
    service.crearCola({ nombre: 'q.demo', ttlMs: 60000 }).subscribe();

    const req = http.expectOne(`${base}/queues`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ nombre: 'q.demo', ttlMs: 60000 });
    req.flush({});
  });

  it('consulta las métricas de una cola con GET /admin/queues/{nombre}', () => {
    service.estadoCola('q.envio.comandos').subscribe();

    const req = http.expectOne(`${base}/queues/q.envio.comandos`);
    expect(req.request.method).toBe('GET');
    req.flush({ nombre: 'q.envio.comandos', mensajesPendientes: 0, consumidores: 1 });
  });

  it('elimina una cola con DELETE /admin/queues/{nombre}', () => {
    service.eliminarCola('q.demo').subscribe();

    const req = http.expectOne(`${base}/queues/q.demo`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('crea un exchange con POST /admin/exchanges', () => {
    service.crearExchange({ nombre: 'rutaexpress.events', tipo: 'TOPIC' }).subscribe();

    const req = http.expectOne(`${base}/exchanges`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ nombre: 'rutaexpress.events', tipo: 'TOPIC' });
    req.flush({});
  });

  it('elimina un binding enviando la routing key como parámetro (el # se codifica)', () => {
    service
      .eliminarBinding({ exchange: 'rutaexpress.events', cola: 'q.auditoria', routingKey: '#' })
      .subscribe();

    const req = http.expectOne((r) => r.url === `${base}/bindings`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.params.get('routingKey')).toBe('#');
    expect(req.request.params.get('cola')).toBe('q.auditoria');
    expect(req.request.urlWithParams).toContain('routingKey=%23');
    req.flush(null);
  });
});
