// ---------------------------------------------------------------------------
// <app-panel> — CÓDIGO BASE (Práctica 21). El marco de todas las páginas.
//
// Es el <Layout> de React (Práctica 15): la barra arriba y un <router-outlet>
// donde el router pinta la página hija. <router-outlet> es el <Outlet /> de
// React Router.
//
// routerLink es el <Link> de React: navega sin recargar la página.
// routerLinkActive pone la clase CSS cuando la ruta está activa (el NavLink).
// ---------------------------------------------------------------------------

import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Sesion } from '../../sesion/sesion';

@Component({
  selector: 'app-panel',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="barra">
      <div class="barra__interior">
        <a class="barra__marca" routerLink="/clases">
          <img src="/logo.svg" alt="" /> Gimnasio Titanes
          <span class="barra__etiqueta">Admin</span>
        </a>
        <nav class="barra__enlaces">
          <a class="barra__enlace" routerLink="/clases"
             routerLinkActive="barra__enlace--activo">Clases</a>
          <span class="barra__quien">{{ sesion.usuario()?.nombre }}</span>
          <button class="boton boton--chico boton--secundario" (click)="salir()">Salir</button>
        </nav>
      </div>
    </header>

    <main class="pagina">
      <router-outlet />
    </main>
  `,
})
export class Panel {
  protected readonly sesion = inject(Sesion);
  private readonly router = inject(Router);

  /**
   * Hay que NAVEGAR al salir. El guardia sólo se revisa al entrar a una ruta:
   * si sólo se borra la sesión, la página se queda donde está.
   */
  protected salir(): void {
    this.sesion.salir();
    this.router.navigate(['/login']);
  }
}
