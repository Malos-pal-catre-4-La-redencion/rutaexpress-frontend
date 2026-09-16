import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ServicioEnvio {
  id: number;
  nombre: string;
  descripcion: string;
  tarifaBase: number;
  tiempoEstimadoHoras: number;
  activo: boolean;
}

export interface CrearServicioRequest {
  nombre: string;
  descripcion: string;
  tarifaBase: number;
  tiempoEstimadoHoras: number;
}

export type TipoVehiculo = 'MOTO' | 'FURGON' | 'CAMION';

export interface Vehiculo {
  id: number;
  patente: string;
  tipo: TipoVehiculo;
  capacidadKg: number;
  disponible: boolean;
}

export interface CrearVehiculoRequest {
  patente: string;
  tipo: TipoVehiculo;
  capacidadKg: number;
}

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  listarServicios(): Observable<ServicioEnvio[]> {
    return this.http.get<ServicioEnvio[]>(`${this.baseUrl}/servicios`);
  }

  crearServicio(request: CrearServicioRequest): Observable<ServicioEnvio> {
    return this.http.post<ServicioEnvio>(`${this.baseUrl}/servicios`, request);
  }

  desactivarServicio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/servicios/${id}`);
  }

  listarVehiculos(): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(`${this.baseUrl}/vehiculos`);
  }

  crearVehiculo(request: CrearVehiculoRequest): Observable<Vehiculo> {
    return this.http.post<Vehiculo>(`${this.baseUrl}/vehiculos`, request);
  }

  cambiarDisponibilidad(id: number, disponible: boolean): Observable<Vehiculo> {
    return this.http.patch<Vehiculo>(`${this.baseUrl}/vehiculos/${id}/disponibilidad`, { disponible });
  }
}
