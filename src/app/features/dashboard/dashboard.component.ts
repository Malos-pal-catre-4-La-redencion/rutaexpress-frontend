import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BffService, MeResponse } from '../../core/bff.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private bff = inject(BffService);

  cargando = true;
  error = false;
  yo?: MeResponse;

  ngOnInit(): void {
    this.bff.me().subscribe({
      next: (respuesta) => {
        this.yo = respuesta;
        this.cargando = false;
      },
      error: () => {
        this.error = true;
        this.cargando = false;
      },
    });
  }

  tieneRol(rol: string): boolean {
    return this.yo?.roles?.includes(rol) ?? false;
  }
}
