// app.ts — el componente raíz: el marco del panel.
// La barra se queda siempre; en el <router-outlet> se pinta la página de la URL.
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  // Standalone: el componente dice qué otros componentes y directivas usa su template.
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
