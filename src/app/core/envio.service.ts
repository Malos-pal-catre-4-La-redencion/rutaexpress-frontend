import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type EstadoEnvio = 'CREADO' | 'ACEPTADO' | 'EN_BODEGA' | 'EN_RUTA' | 'ENTREGADO' | 'CANCELADO';

export interface Envio {
  id: number;
  trackingCode: string;
  remitente: string;
  destinatario: string;
  direccionDestino: string;
  estado: EstadoEnvio;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CrearEnvioRequest {
  remitente: string;
  destinatario: string;
  direccionDestino: string;
}

/**
 * Espejo, solo para la UI, de la máquina de estados real que vive en
 * ms-rutaexpress-shipments. Sirve para no ofrecer botones que sabemos que
 * el backend va a rechazar — pero la validación real sigue siendo la del
 * backend; si esto quedara desincronizado, el peor caso es un 409 que se
 * muestra igual como error, no un hueco de seguridad.
 */
export const SIGUIENTES_ESTADOS: Record<EstadoEnvio, EstadoEnvio[]> = {
  CREADO: ['ACEPTADO', 'CANCELADO'],
  ACEPTADO: ['EN_BODEGA', 'CANCELADO'],
  EN_BODEGA: ['EN_RUTA', 'CANCELADO'],
  EN_RUTA: ['ENTREGADO', 'CANCELADO'],
  ENTREGADO: [],
  CANCELADO: [],
};

@Injectable({ providedIn: 'root' })
export class EnvioService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/envios`;

  listar(): Observable<Envio[]> {
    return this.http.get<Envio[]>(this.baseUrl);
  }

  crear(request: CrearEnvioRequest): Observable<Envio> {
    return this.http.post<Envio>(this.baseUrl, request);
  }

  cambiarEstado(id: number, nuevoEstado: EstadoEnvio): Observable<Envio> {
    return this.http.patch<Envio>(`${this.baseUrl}/${id}/estado`, { nuevoEstado });
  }
}
