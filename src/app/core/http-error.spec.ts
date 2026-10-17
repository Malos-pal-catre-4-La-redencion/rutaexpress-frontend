import { HttpErrorResponse } from '@angular/common/http';
import { mensajeDeError } from './http-error';

describe('mensajeDeError', () => {
  it('muestra el mensaje de validación de cada campo', () => {
    const error = new HttpErrorResponse({
      status: 400,
      error: { error: 'Datos inválidos', campos: { nombre: 'El nombre de la cola es obligatorio' } },
    });

    expect(mensajeDeError(error)).toBe('Datos inválidos — nombre: El nombre de la cola es obligatorio');
  });

  it('muestra el mensaje de error simple del microservicio', () => {
    const error = new HttpErrorResponse({ status: 404, error: { error: "La cola 'q.x' no existe." } });

    expect(mensajeDeError(error)).toBe("La cola 'q.x' no existe.");
  });

  it('explica el 403 como falta de permiso', () => {
    expect(mensajeDeError(new HttpErrorResponse({ status: 403 }))).toContain('No tienes permiso');
  });

  it('explica que no hay conexión cuando el estado es 0', () => {
    expect(mensajeDeError(new HttpErrorResponse({ status: 0 }))).toContain('No se pudo contactar');
  });

  it('usa el texto por defecto cuando no es un error HTTP', () => {
    expect(mensajeDeError(new Error('x'), 'por defecto')).toBe('por defecto');
  });
});
