import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

/**
 * Se usa junto a MsalGuard en las rutas: MsalGuard ya garantiza que hay
 * sesión iniciada, este guard revisa además que el usuario tenga alguno de
 * los roles listados en `data: { roles: [...] }` de la ruta.
 *
 * Los roles se leen del ID token (idTokenClaims), que es donde MSAL los deja
 * disponibles en la cuenta activa una vez logueado.
 */
export const roleGuard: CanActivateFn = (route) => {
  const msalService = inject(MsalService);
  const router = inject(Router);

  const allowedRoles = route.data['roles'] as string[] | undefined;
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  const account = msalService.instance.getActiveAccount();
  const userRoles = (account?.idTokenClaims?.['roles'] as string[] | undefined) ?? [];

  const tieneAcceso = allowedRoles.some((rol) => userRoles.includes(rol));
  if (!tieneAcceso) {
    router.navigate(['/no-autorizado']);
    return false;
  }
  return true;
};
