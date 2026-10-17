import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type TipoExchange = 'DIRECT' | 'TOPIC' | 'FANOUT' | 'HEADERS';
export type Overflow = 'drop-head' | 'reject-publish' | 'reject-publish-dlx';

export interface CrearColaRequest {
  nombre: string;
  durable?: boolean;
  autoDelete?: boolean;
  ttlMs?: number;
  maxLength?: number;
  overflow?: Overflow;
  deadLetterExchange?: string;
  deadLetterRoutingKey?: string;
}

export interface Cola {
  nombre: string;
  durable: boolean;
  autoDelete: boolean;
  ttlMs: number | null;
  maxLength: number | null;
  overflow: string | null;
  deadLetterExchange: string | null;
  deadLetterRoutingKey: string | null;
}

export interface ColaEstado {
  nombre: string;
  mensajesPendientes: number;
  consumidores: number;
}

export interface CrearExchangeRequest {
  nombre: string;
  tipo: TipoExchange;
  durable?: boolean;
  autoDelete?: boolean;
}

export interface Exchange {
  nombre: string;
  tipo: TipoExchange;
  durable: boolean;
  autoDelete: boolean;
}

export interface BindingDatos {
  exchange: string;
  cola: string;
  routingKey: string;
}

/**
 * Administración de RabbitMQ a través del BFF (/api/bff/admin/**). El
 * MsalInterceptor adjunta el token; el BFF solo deja pasar el rol Admin.
 */
@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/admin`;

  crearCola(request: CrearColaRequest): Observable<Cola> {
    return this.http.post<Cola>(`${this.baseUrl}/queues`, request);
  }

  estadoCola(nombre: string): Observable<ColaEstado> {
    return this.http.get<ColaEstado>(`${this.baseUrl}/queues/${encodeURIComponent(nombre)}`);
  }

  eliminarCola(nombre: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/queues/${encodeURIComponent(nombre)}`);
  }

  crearExchange(request: CrearExchangeRequest): Observable<Exchange> {
    return this.http.post<Exchange>(`${this.baseUrl}/exchanges`, request);
  }

  eliminarExchange(nombre: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/exchanges/${encodeURIComponent(nombre)}`);
  }

  crearBinding(request: BindingDatos): Observable<BindingDatos> {
    return this.http.post<BindingDatos>(`${this.baseUrl}/bindings`, request);
  }

  eliminarBinding(datos: BindingDatos): Observable<void> {
    const params = new HttpParams()
      .set('exchange', datos.exchange)
      .set('cola', datos.cola)
      .set('routingKey', datos.routingKey);
    return this.http.delete<void>(`${this.baseUrl}/bindings`, { params });
  }
}
