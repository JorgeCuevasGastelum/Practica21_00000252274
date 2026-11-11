// <app-tarjeta-clase> — la tarjeta de UNA clase.
// El padre le pasa la clase con [clase]="..."; es obligatoria: sin ella
// el compilador marca error en el template del padre.
import { Component, computed, input, output } from '@angular/core';
import { API_URL } from '../config';
import type { Clase } from '../modelos/clase';

@Component({
  imports: [],
  selector: 'app-tarjeta-clase',
  styleUrl: './tarjeta-clase.css',
  templateUrl: './tarjeta-clase.html',
})
export class TarjetaClase {
  // input.required(): una signal de sólo lectura con lo que mandó el padre.
  readonly clase = input.required<Clase>();
  // input() con valor por defecto: si el padre no lo manda, la tarjeta no está activa.
  readonly activa = input(false);

  // output(): el evento con el que la tarjeta le avisa al padre que le dieron clic.
  // El padre lo escucha con (elegida)="...". La tarjeta no decide qué pasa: sólo avisa.
  readonly elegida = output<Clase>();

  // «Larga» = 60 minutos o más.
  protected readonly larga = computed(() => this.clase().duracionMin >= 60);

  // La imagen la sirve la API: /img/clase-01.jpg → http://localhost:3000/img/clase-01.jpg
  protected readonly imagen = computed(() => `${API_URL}${this.clase().imagen}`);
}
