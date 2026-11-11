// ---------------------------------------------------------------------------
// sesion/solo-admin.ts — CÓDIGO BASE (Práctica 21). El guardia del panel.
//
// Es el <RutaProtegida> de React (Práctica 17), escrito como FUNCIÓN:
//
//   React (P17)                              Angular (hoy)
//   --------------------------------------   ---------------------------------
//   if (!sesion) return <Navigate to=… />    return router.createUrlTree([…])
//   return <Outlet />                        return true
//
// Si devuelve un UrlTree, el router navega ahí en lugar de entrar.
//
// Y hay que decirlo en voz alta: esto NO es seguridad. Cualquiera puede
// saltarse el guardia desde el navegador. Lo que protege de verdad es el
// @Roles(Rol.admin) del backend, que responde 403. Esto es comodidad: evita
// una pantalla vacía y una lluvia de errores en la consola.
// ---------------------------------------------------------------------------

import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';
import { Sesion } from './sesion';

export const soloAdmin: CanActivateFn = () => {
  const sesion = inject(Sesion);
  if (sesion.esAdmin()) return true;
  return inject(Router).createUrlTree(['/login']);
};
