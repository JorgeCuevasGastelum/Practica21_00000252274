// ---------------------------------------------------------------------------
// sesion/sesion.ts — CÓDIGO BASE (Práctica 21). La sesión del administrador.
//
// Es el SesionContext de React (Práctica 16), escrito como servicio de Angular:
//
//   React (P16)                         Angular (hoy)
//   ---------------------------------   ------------------------------------
//   <SesionProvider> + useState         @Service() + signal()
//   useSesion()                         inject(Sesion)
//   localStorage 'gimnasio.sesion'      lo mismo, con otra llave
//
// Guarda el token y quién entró, y nada más. Todo con signals, así que la
// barra, el guardia y los botones se enteran solos.
//
// SOBRE localStorage: cualquier script que corra en la página puede leerlo.
// La opción seria es una cookie HttpOnly, y esa la tiene que poner el backend.
// Aquí se usa localStorage porque el tema es el frontend; queda dicho para que
// nadie crea que así se hace en producción.
// ---------------------------------------------------------------------------

import { HttpClient } from '@angular/common/http';
import { Service, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../config';
import type { Sobre, Usuario } from '../modelos/clase';

const LLAVE = 'gimnasio-admin.sesion';

interface DatosSesion {
  token: string;
  usuario: Usuario;
}

/** Lo que regresa POST /auth/login, dentro del sobre. */
interface RespuestaLogin {
  access_token: string;
  usuario: Usuario;
}

@Service()
export class Sesion {
  private readonly http = inject(HttpClient);

  private readonly datos = signal<DatosSesion | null>(leerGuardada());

  readonly token = computed(() => this.datos()?.token ?? null);
  readonly usuario = computed(() => this.datos()?.usuario ?? null);
  readonly esAdmin = computed(() => this.usuario()?.rol === 'admin');

  /**
   * Entra y SÓLO deja pasar al admin. Un miembro tiene un token válido, pero
   * este panel no es para él: la API le respondería 403 en cada botón.
   *
   * firstValueFrom convierte el Observable de HttpClient en una promesa, para
   * poder usar async/await como en React. RxJS de verdad entra en la P23.
   */
  async entrar(correo: string, password: string): Promise<void> {
    const respuesta = await firstValueFrom(
      this.http.post<Sobre<RespuestaLogin>>(`${API_URL}/auth/login`, { correo, password }),
    );
    const { access_token, usuario } = respuesta.data;

    if (usuario.rol !== 'admin') {
      throw new Error('Esta cuenta no es de administrador.');
    }

    const datos = { token: access_token, usuario };
    localStorage.setItem(LLAVE, JSON.stringify(datos));
    this.datos.set(datos);
  }

  salir(): void {
    localStorage.removeItem(LLAVE);
    this.datos.set(null);
  }
}

function leerGuardada(): DatosSesion | null {
  try {
    const crudo = localStorage.getItem(LLAVE);
    return crudo ? (JSON.parse(crudo) as DatosSesion) : null;
  } catch {
    return null;
  }
}
