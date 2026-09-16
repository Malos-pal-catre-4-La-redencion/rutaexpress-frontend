import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CatalogoService,
  ServicioEnvio,
  TipoVehiculo,
  Vehiculo,
} from '../../core/catalogo.service';
import { SessionService } from '../../core/session.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.scss',
})
export class CatalogoComponent implements OnInit {
  private catalogoService = inject(CatalogoService);
  private session = inject(SessionService);

  servicios: ServicioEnvio[] = [];
  vehiculos: Vehiculo[] = [];
  cargando = true;
  error = '';

  mostrarFormServicio = false;
  nuevoServicio = { nombre: '', descripcion: '', tarifaBase: 0, tiempoEstimadoHoras: 24 };

  mostrarFormVehiculo = false;
  nuevoVehiculo: { patente: string; tipo: TipoVehiculo; capacidadKg: number } = {
    patente: '',
    tipo: 'FURGON',
    capacidadKg: 500,
  };

  tiposVehiculo: TipoVehiculo[] = ['MOTO', 'FURGON', 'CAMION'];

  get esAdmin(): boolean {
    return this.session.tieneAlgunRol('Admin');
  }

  ngOnInit(): void {
    this.cargarTodo();
  }

  cargarTodo(): void {
    this.cargando = true;
    this.catalogoService.listarServicios().subscribe({
      next: (servicios) => {
        this.servicios = servicios;
        this.cargarVehiculos();
      },
      error: () => {
        this.error = 'No se pudo cargar el catálogo de servicios.';
        this.cargando = false;
      },
    });
  }

  private cargarVehiculos(): void {
    this.catalogoService.listarVehiculos().subscribe({
      next: (vehiculos) => {
        this.vehiculos = vehiculos;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo cargar la flota de vehículos.';
        this.cargando = false;
      },
    });
  }

  crearServicio(): void {
    this.catalogoService.crearServicio(this.nuevoServicio).subscribe({
      next: () => {
        this.mostrarFormServicio = false;
        this.nuevoServicio = { nombre: '', descripcion: '', tarifaBase: 0, tiempoEstimadoHoras: 24 };
        this.cargarTodo();
      },
      error: () => (this.error = 'No se pudo crear el servicio.'),
    });
  }

  desactivarServicio(servicio: ServicioEnvio): void {
    this.catalogoService.desactivarServicio(servicio.id).subscribe({
      next: () => this.cargarTodo(),
      error: () => (this.error = 'No se pudo desactivar el servicio.'),
    });
  }

  crearVehiculo(): void {
    this.catalogoService.crearVehiculo(this.nuevoVehiculo).subscribe({
      next: () => {
        this.mostrarFormVehiculo = false;
        this.nuevoVehiculo = { patente: '', tipo: 'FURGON', capacidadKg: 500 };
        this.cargarTodo();
      },
      error: () => (this.error = 'No se pudo crear el vehículo.'),
    });
  }

  cambiarDisponibilidad(vehiculo: Vehiculo): void {
    this.catalogoService.cambiarDisponibilidad(vehiculo.id, !vehiculo.disponible).subscribe({
      next: (actualizado) => {
        const index = this.vehiculos.findIndex((v) => v.id === actualizado.id);
        if (index !== -1) this.vehiculos[index] = actualizado;
      },
      error: () => (this.error = 'No se pudo cambiar la disponibilidad.'),
    });
  }
}
