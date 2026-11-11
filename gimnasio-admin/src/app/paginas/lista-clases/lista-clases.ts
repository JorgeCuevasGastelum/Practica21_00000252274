// <app-lista-clases> — la página /clases: el tablero de la Práctica 20.
// Lee todo del servicio Catalogo, que ahora trae las clases de la API.
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Catalogo } from '../../catalogo';
import { API_URL } from '../../config';
import { FiltroCategoria } from '../../filtro-categoria/filtro-categoria';
import { TarjetaClase } from '../../tarjeta-clase/tarjeta-clase';

@Component({
  imports: [TarjetaClase, FiltroCategoria, RouterLink],
  selector: 'app-lista-clases',
  styleUrl: './lista-clases.css',
  templateUrl: './lista-clases.html',
})
export class ListaClases {
  protected readonly catalogo = inject(Catalogo);

  // La imagen del detalle también la sirve la API.
  protected readonly imagenElegida = computed(() => {
    const clase = this.catalogo.seleccionada();
    return clase ? `${API_URL}${clase.imagen}` : '';
  });
}
