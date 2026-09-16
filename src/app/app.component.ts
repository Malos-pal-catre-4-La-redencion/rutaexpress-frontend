import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  private msalService = inject(MsalService);
  private msalBroadcastService = inject(MsalBroadcastService);
  private destroying$ = new Subject<void>();

  isLoggedIn = false;
  displayName = '';
  roles: string[] = [];

  ngOnInit(): void {
    // Procesa la respuesta de Azure AD al volver del login/logout.
    // MsalService.handleRedirectObservable() ya se encarga de inicializar
    // la instancia de MSAL internamente, así que no hace falta nada más.
    this.msalService.handleRedirectObservable().subscribe();

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this.destroying$)
      )
      .subscribe(() => {
        this.actualizarEstadoSesion();
      });
  }

  private actualizarEstadoSesion(): void {
    const cuentas = this.msalService.instance.getAllAccounts();
    this.isLoggedIn = cuentas.length > 0;

    if (this.isLoggedIn) {
      const activa = this.msalService.instance.getActiveAccount() ?? cuentas[0];
      this.msalService.instance.setActiveAccount(activa);
      this.displayName = activa.name ?? activa.username;
      this.roles = (activa.idTokenClaims?.['roles'] as string[] | undefined) ?? [];
    }
  }

  login(): void {
    this.msalService.loginRedirect();
  }

  logout(): void {
    this.msalService.logoutRedirect();
  }

  ngOnDestroy(): void {
    this.destroying$.next();
    this.destroying$.complete();
  }
}
