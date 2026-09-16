import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-no-autorizado',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="card">
      <h1>🚫 No autorizado</h1>
      <p>Tu rol no tiene permiso para ver esta sección.</p>
      <a routerLink="/dashboard" class="btn btn--primary">Volver al dashboard</a>
    </div>
  `,
})
export class NoAutorizadoComponent {}
