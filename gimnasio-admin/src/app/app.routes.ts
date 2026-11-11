// app.routes.ts — el mapa de rutas del panel.
// Angular revisa las rutas EN ORDEN y se queda con la primera que coincide.
import { Routes } from '@angular/router';
import { ListaClases } from './paginas/lista-clases/lista-clases';
import { FormularioClase } from './paginas/formulario-clase/formulario-clase';
import { Horarios } from './paginas/horarios/horarios';
import { Miembros } from './paginas/miembros/miembros';

export const routes: Routes = [
  // pathMatch: 'full': sólo cuando la URL está vacía de verdad. Sin él, ''
  // sería prefijo de cualquier dirección y TODO se iría a /clases.
  { path: '', redirectTo: 'clases', pathMatch: 'full' },
  { path: 'clases', component: ListaClases },
  { path: 'clases/nueva', component: FormularioClase },
  { path: 'horarios', component: Horarios },
  { path: 'miembros', component: Miembros },
  // El comodín coincide con cualquier cosa: por eso va al final.
  { path: '**', redirectTo: 'clases' },
];
