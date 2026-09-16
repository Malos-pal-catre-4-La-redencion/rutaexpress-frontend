import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Envio,
  EnvioService,
  EstadoEnvio,
  SIGUIENTES_ESTADOS,
} from '../../core/envio.service';
import { SessionService } from '../../core/session.service';

@Component({
  selector: 'app-envios',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './envios.component.html',
  styleUrl: './envios.component.scss',
})
export class EnviosComponent implements OnInit {
  private envioService = inject(EnvioService);
  private session = inject(SessionService);

  envios: Envio[] = [];
  cargando = true;
  error = '';

  mostrarFormulario = false;
  nuevoEnvio = { remitente: '', destinatario: '', direccionDestino: '' };
  guardando = false;

  cambiosEnCurso = new Set<number>();

  ngOnInit(): void {
    this.cargarEnvios();
  }

  get puedeGestionarEstados(): boolean {
    return this.session.tieneAlgunRol('Admin', 'Despachador');
  }

  cargarEnvios(): void {
    this.cargando = true;
    this.envioService.listar().subscribe({
      next: (data) => {
        this.envios = data;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo cargar la lista de envíos.';
        this.cargando = false;
      },
    });
  }

  siguientesEstados(estado: EstadoEnvio): EstadoEnvio[] {
    return SIGUIENTES_ESTADOS[estado];
  }

  crearEnvio(): void {
    this.guardando = true;
    this.envioService.crear(this.nuevoEnvio).subscribe({
      next: () => {
        this.guardando = false;
        this.mostrarFormulario = false;
        this.nuevoEnvio = { remitente: '', destinatario: '', direccionDestino: '' };
        this.cargarEnvios();
      },
      error: () => {
        this.guardando = false;
        this.error = 'No se pudo crear el envío. Revisa los datos.';
      },
    });
  }

  cambiarEstado(envio: Envio, nuevoEstado: EstadoEnvio): void {
    this.cambiosEnCurso.add(envio.id);
    this.envioService.cambiarEstado(envio.id, nuevoEstado).subscribe({
      next: (actualizado) => {
        this.cambiosEnCurso.delete(envio.id);
        const index = this.envios.findIndex((e) => e.id === actualizado.id);
        if (index !== -1) {
          this.envios[index] = actualizado;
        }
      },
      error: () => {
        this.cambiosEnCurso.delete(envio.id);
        this.error = `No se pudo cambiar el estado de ${envio.trackingCode}.`;
      },
    });
  }

  claseEstado(estado: EstadoEnvio): string {
    return 'estado estado--' + estado.toLowerCase();
  }
}
