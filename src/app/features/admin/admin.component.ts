import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import {
  AdminService,
  ColaEstado,
  CrearColaRequest,
  Overflow,
  TipoExchange,
} from '../../core/admin.service';
import { mensajeDeError } from '../../core/http-error';

interface Resultado {
  ok: boolean;
  texto: string;
  hora: string;
}

interface FormularioCola {
  nombre: string;
  ttlMs: number | null;
  maxLength: number | null;
  overflow: Overflow | '';
  deadLetterExchange: string;
  deadLetterRoutingKey: string;
}

/**
 * Pantalla de administración de RabbitMQ (solo rol Admin, ver app.routes.ts).
 *
 * Los formularios NO bloquean el envío con "required" a propósito: así se puede
 * mostrar en vivo cómo el microservicio administrador rechaza un nombre vacío con
 * un 400 y un mensaje claro, y que no se crea nada.
 */
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  private adminService = inject(AdminService);

  readonly tiposExchange: TipoExchange[] = ['DIRECT', 'TOPIC', 'FANOUT', 'HEADERS'];
  readonly overflows: Overflow[] = ['drop-head', 'reject-publish', 'reject-publish-dlx'];

  ocupado = false;
  resultados: Resultado[] = [];

  cola: FormularioCola = this.colaVacia();
  nombreCola = '';
  estadoCola: ColaEstado | null = null;

  exchange: { nombre: string; tipo: TipoExchange } = { nombre: '', tipo: 'DIRECT' };
  nombreExchange = '';

  binding = { exchange: '', cola: '', routingKey: '' };

  // ------------------------------------------------------------------ colas

  crearCola(): void {
    const c = this.cola;
    const request: CrearColaRequest = { nombre: c.nombre };
    if (c.ttlMs !== null) {
      request.ttlMs = c.ttlMs;
    }
    if (c.maxLength !== null) {
      request.maxLength = c.maxLength;
    }
    if (c.overflow) {
      request.overflow = c.overflow;
    }
    if (c.deadLetterExchange) {
      request.deadLetterExchange = c.deadLetterExchange;
    }
    if (c.deadLetterRoutingKey) {
      request.deadLetterRoutingKey = c.deadLetterRoutingKey;
    }
    this.ejecutar('Crear cola', this.adminService.crearCola(request), (r) => `'${r.nombre}' creada`);
  }

  cargarEjemploConRetencion(): void {
    this.cola = {
      nombre: 'q.demo.comandos',
      ttlMs: 60000,
      maxLength: 1000,
      overflow: 'reject-publish-dlx',
      deadLetterExchange: 'rutaexpress.dlx',
      deadLetterRoutingKey: 'demo.comandos.dlq',
    };
  }

  limpiarCola(): void {
    this.cola = this.colaVacia();
  }

  consultarCola(): void {
    this.estadoCola = null;
    this.ejecutar('Consultar cola', this.adminService.estadoCola(this.nombreCola), (e) => {
      this.estadoCola = e;
      return `'${e.nombre}': ${e.mensajesPendientes} pendientes, ${e.consumidores} consumidores`;
    });
  }

  eliminarCola(): void {
    this.ejecutar(
      'Eliminar cola',
      this.adminService.eliminarCola(this.nombreCola),
      () => `'${this.nombreCola}' eliminada`
    );
  }

  // -------------------------------------------------------------- exchanges

  crearExchange(): void {
    this.ejecutar(
      'Crear exchange',
      this.adminService.crearExchange({ nombre: this.exchange.nombre, tipo: this.exchange.tipo }),
      (r) => `'${r.nombre}' (${r.tipo}) creado`
    );
  }

  eliminarExchange(): void {
    this.ejecutar(
      'Eliminar exchange',
      this.adminService.eliminarExchange(this.nombreExchange),
      () => `'${this.nombreExchange}' eliminado`
    );
  }

  // --------------------------------------------------------------- bindings

  crearBinding(): void {
    this.ejecutar(
      'Crear binding',
      this.adminService.crearBinding({ ...this.binding }),
      (r) => `${r.exchange} → ${r.cola} (${r.routingKey})`
    );
  }

  eliminarBinding(): void {
    this.ejecutar(
      'Eliminar binding',
      this.adminService.eliminarBinding({ ...this.binding }),
      () => `${this.binding.exchange} → ${this.binding.cola} (${this.binding.routingKey}) eliminado`
    );
  }

  // ---------------------------------------------------------------- helpers

  private ejecutar<T>(accion: string, llamada: Observable<T>, alExito: (respuesta: T) => string): void {
    this.ocupado = true;
    llamada.subscribe({
      next: (respuesta) => {
        this.ocupado = false;
        this.registrar(true, `${accion}: ${alExito(respuesta)}`);
      },
      error: (error: unknown) => {
        this.ocupado = false;
        this.registrar(false, `${accion}: ${mensajeDeError(error)}`);
      },
    });
  }

  private registrar(ok: boolean, texto: string): void {
    const hora = new Date().toLocaleTimeString('es-CL');
    this.resultados = [{ ok, texto, hora }, ...this.resultados].slice(0, 8);
  }

  private colaVacia(): FormularioCola {
    return {
      nombre: '',
      ttlMs: null,
      maxLength: null,
      overflow: '',
      deadLetterExchange: '',
      deadLetterRoutingKey: '',
    };
  }
}
