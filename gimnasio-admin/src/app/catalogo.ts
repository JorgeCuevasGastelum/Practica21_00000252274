// catalogo.ts — el servicio con el estado del tablero.
// @Service(): Angular crea UNA sola instancia para toda la app y se la da a
// quien la pida con inject(Catalogo). Así el tablero y el filtro ven lo mismo.
//
// Práctica 21: las clases ya no salen de datos locales sino de GET /clases,
// con httpResource. Hacia afuera el servicio se ve igual: clases() sigue
// siendo una signal con un arreglo de clases.
import { Service, computed, linkedSignal, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { API_URL } from './config';
import { mensajeDeApi } from './servicios/errores';
import type { Categoria, Clase, Sobre } from './modelos/clase';

@Service()
export class Catalogo {
  // --- la API ---------------------------------------------------------------
  // httpResource hace la petición en cuanto alguien lee el recurso, y guarda
  // en signals el valor, si está cargando y el error.
  private readonly recurso = httpResource<Clase[]>(() => `${API_URL}/clases`, {
    parse: (cuerpo) => (cuerpo as Sobre<Clase[]>).data, // la API manda { data, meta }
    defaultValue: [], // mientras llega (o si falla), un arreglo vacío
  });

  readonly cargando = this.recurso.isLoading;
  readonly error = computed(() => {
    const error = this.recurso.error();
    return error ? mensajeDeApi(error) : null;
  });

  // --- el estado: signals ---------------------------------------------------
  // Antes: signal<Clase[]>(CLASES_LOCALES). Cuando la petición falla, value()
  // lanza un error en lugar de regresar algo: por eso se pregunta hasValue().
  readonly clases = computed(() => (this.recurso.hasValue() ? this.recurso.value() : []));
  readonly categoria = signal<Categoria | null>(null); // null = todas

  // --- lo que se calcula: computed() se recalcula solo cuando cambia lo que lee
  readonly visibles = computed(() => {
    const categoria = this.categoria();
    return categoria ? this.clases().filter((c) => c.categoria === categoria) : this.clases();
  });
  readonly minutos = computed(() => this.visibles().reduce((suma, c) => suma + c.duracionMin, 0));
  readonly deUnaHora = computed(() => this.visibles().filter((c) => c.duracionMin >= 60).length);

  // La clase elegida. linkedSignal es una signal que se puede escribir (al
  // dar clic en una tarjeta) pero que además se vuelve a calcular cada vez
  // que cambian las visibles: si la elegida ya no está entre ellas (otro
  // filtro, o se vació el catálogo), se suelta sola.
  readonly seleccionada = linkedSignal<Clase[], Clase | null>({
    source: this.visibles,
    computation: (visibles, anterior) => {
      const elegida = anterior?.value;
      return elegida && visibles.some((c) => c.id === elegida.id) ? elegida : null;
    },
  });

  // --- las acciones --------------------------------------------------------
  elegirCategoria(categoria: Categoria | null) {
    this.categoria.set(categoria);
  }

  // Clic en una tarjeta: la elige; clic en la que ya estaba elegida: la suelta.
  elegir(clase: Clase) {
    this.seleccionada.update((actual) => (actual?.id === clase.id ? null : clase));
  }

  // Vacía la lista en pantalla (no borra nada en la API).
  vaciar() {
    this.recurso.set([]);
  }

  // Vuelve a pedir GET /clases. También sirve para reintentar después de un error.
  restaurar() {
    this.recurso.reload();
  }
}
