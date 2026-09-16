import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MeResponse {
  username: string;
  name: string;
  roles: string[];
  issuer: string;
}

@Injectable({ providedIn: 'root' })
export class BffService {
  private http = inject(HttpClient);

  /**
   * El MsalInterceptor adjunta el Bearer token automáticamente porque esta
   * URL está registrada en el protectedResourceMap (ver app.config.ts) — acá
   * no hay que tocar headers a mano.
   */
  me(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${environment.apiUrl}/me`);
  }
}
