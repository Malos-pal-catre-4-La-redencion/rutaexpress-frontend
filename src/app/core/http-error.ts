import { HttpErrorResponse } from '@angular/common/http';

interface CuerpoDeError {
  error?: string;
  campos?: Record<string, string>;
}

/**
 * Convierte un error HTTP en un texto legible. Los microservicios responden
 * {"error": "...", "campos": {"campo": "mensaje"}}; el BFF reenvía ese cuerpo tal cual.
 */
export function mensajeDeError(err: unknown, porDefecto = 'Ocurrió un error inesperado.'): string {
  if (!(err instanceof HttpErrorResponse)) {
    return porDefecto;
  }
  if (err.status === 0) {
    return 'No se pudo contactar al servidor. Revisa que el BFF esté en marcha.';
  }
  if (err.status === 401) {
    return 'Tu sesión expiró. Vuelve a iniciar sesión.';
  }
  if (err.status === 403) {
    return 'No tienes permiso para realizar esta acción.';
  }

  const cuerpo = err.error as CuerpoDeError | string | null;
  if (cuerpo && typeof cuerpo === 'object') {
    const campos = cuerpo.campos
      ? Object.entries(cuerpo.campos)
          .map(([campo, mensaje]) => `${campo}: ${mensaje}`)
          .join(' · ')
      : '';
    if (campos) {
      return `${cuerpo.error ?? 'Datos inválidos'} — ${campos}`;
    }
    if (cuerpo.error) {
      return cuerpo.error;
    }
  }
  return porDefecto;
}
