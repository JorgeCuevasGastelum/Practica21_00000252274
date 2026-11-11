// ---------------------------------------------------------------------------
// sesion/interceptores.ts — CÓDIGO BASE (Práctica 21).
//
// Un interceptor es UNA FUNCIÓN que ve pasar TODAS las peticiones de
// HttpClient (y de httpResource). Es el interceptor de Axios de la Práctica
// 16, con otra sintaxis:
//
//   Axios (P16)                              Angular (hoy)
//   --------------------------------------   ---------------------------------
//   api.interceptors.request.use(cfg => …)   conToken: HttpInterceptorFn
//   api.interceptors.response.use(_, err…)   alFallar: HttpInterceptorFn
//
// Si lo ven como CLASE con `implements HttpInterceptor` y `HTTP_INTERCEPTORS`
// con `multi: true`, es código de antes de la v15.
// ---------------------------------------------------------------------------

import { HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Sesion } from './sesion';

/**
 * De subida: mete el `Authorization: Bearer …`.
 *
 * Fíjense en req.clone(): las peticiones son INMUTABLES. Hacer
 * req.headers.set(…) no hace nada, y no avisa. Es el mismo principio de la
 * Unidad III: no se muta, se crea una nueva.
 */
export const conToken: HttpInterceptorFn = (req, next) => {
  const token = inject(Sesion).token();
  if (!token) return next(req);

  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};

/**
 * De bajada: si la API responde 401 (token vencido o inválido), se cierra la
 * sesión y se va al login. El 401 del propio login NO cuenta: ése es
 * «contraseña equivocada», no «sesión vencida».
 */
export const alFallar: HttpInterceptorFn = (req, next) => {
  const sesion = inject(Sesion);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: unknown) => {
      const esLogin = req.url.includes('/auth/login');
      if (error instanceof HttpErrorResponse && error.status === 401 && !esLogin) {
        sesion.salir();
        router.navigate(['/login'], { queryParams: { motivo: 'vencio' } });
      }
      // Se vuelve a lanzar SIEMPRE: un interceptor que se traga el error deja
      // a la pantalla sin saber que algo falló.
      return throwError(() => error);
    }),
  );
};
