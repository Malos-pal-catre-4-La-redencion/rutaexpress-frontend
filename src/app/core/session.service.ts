import { Injectable, inject } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private msalService = inject(MsalService);

  get roles(): string[] {
    const cuenta = this.msalService.instance.getActiveAccount();
    return (cuenta?.idTokenClaims?.['roles'] as string[] | undefined) ?? [];
  }

  tieneAlgunRol(...rolesPermitidos: string[]): boolean {
    return rolesPermitidos.some((rol) => this.roles.includes(rol));
  }
}
