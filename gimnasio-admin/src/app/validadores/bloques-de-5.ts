// validadores/bloques-de-5.ts — un validador propio para la duración.
// Un validador es una función que recibe el control y regresa:
//   null           → el valor es válido
//   { clave: ... } → el valor NO es válido; la clave es el nombre del error
// La clave es la que después se pregunta con hasError('bloquesDe5').
import type { AbstractControl, ValidationErrors } from '@angular/forms';

export function bloquesDe5(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  // Si está vacío no decimos nada: de eso se encarga Validators.required.
  if (valor === null || valor === '') return null;
  return valor % 5 === 0 ? null : { bloquesDe5: { valor, sugerido: Math.round(valor / 5) * 5 } };
}
