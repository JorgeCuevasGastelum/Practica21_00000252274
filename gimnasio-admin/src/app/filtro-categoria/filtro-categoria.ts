// <app-filtro-categoria> — los botones para filtrar por categoría.
// No recibe nada del padre ni le avisa nada: pide el servicio con inject()
// y cambia la categoría ahí. El tablero, que lee del mismo servicio, se entera solo.
import { Component, inject } from '@angular/core';
import { Catalogo } from '../catalogo';
import { CATEGORIAS } from '../modelos/clase';

@Component({
  imports: [],
  selector: 'app-filtro-categoria',
  styleUrl: './filtro-categoria.css',
  templateUrl: './filtro-categoria.html',
})
export class FiltroCategoria {
  protected readonly catalogo = inject(Catalogo);
  protected readonly categorias = CATEGORIAS;
}
