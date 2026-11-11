// ---------------------------------------------------------------------------
// <app-login> — CÓDIGO BASE (Práctica 21). La pantalla de entrada.
//
// Usa un formulario reactivo (FormBuilder), que es el tema de la Práctica 22.
// Hoy se copia tal cual; la semana que entra lo escriben ustedes.
// ---------------------------------------------------------------------------

import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Sesion } from '../../sesion/sesion';
import { mensajeDeApi } from '../../servicios/errores';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  template: `
    <div class="login">
      <div class="tarjeta">
        <div class="login__marca">
          <img src="/logo.svg" alt="" />
          <div>
            <h1 style="margin: 0">Panel del gimnasio</h1>
            <span class="dato__clave">Sólo administradores</span>
          </div>
        </div>

        @if (vencio) {
          <div class="aviso aviso--atencion">Tu sesión venció. Vuelve a entrar.</div>
        }
        @if (problema(); as p) {
          <div class="aviso aviso--error">{{ p }}</div>
        }

        <form [formGroup]="form" (ngSubmit)="enviar()">
          <div class="campo">
            <label for="correo">Correo</label>
            <input id="correo" type="email" formControlName="correo" autocomplete="username" />
          </div>
          <div class="campo">
            <label for="password">Contraseña</label>
            <input id="password" type="password" formControlName="password"
                   autocomplete="current-password" />
          </div>
          <button class="boton" type="submit" [disabled]="enviando()">
            {{ enviando() ? 'Entrando…' : 'Entrar' }}
          </button>
        </form>

        <p class="dato__clave" style="margin-top: 1rem; font-size: 0.86rem">
          Cuenta del laboratorio: <code>admin&#64;itson.mx</code> / <code>gimnasio2026</code>
        </p>
      </div>
    </div>
  `,
})
export class Login {
  private readonly sesion = inject(Sesion);
  private readonly router = inject(Router);

  protected readonly vencio =
    inject(ActivatedRoute).snapshot.queryParamMap.get('motivo') === 'vencio';

  protected readonly enviando = signal(false);
  protected readonly problema = signal<string | null>(null);

  protected readonly form = inject(FormBuilder).nonNullable.group({
    correo: ['admin@itson.mx', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  protected async enviar(): Promise<void> {
    if (this.form.invalid) {
      this.problema.set('Escribe el correo y la contraseña.');
      return;
    }
    this.enviando.set(true);
    this.problema.set(null);
    try {
      const { correo, password } = this.form.getRawValue();
      await this.sesion.entrar(correo, password);
      this.router.navigate(['/clases']);
    } catch (error) {
      // Un HttpErrorResponse se traduce; el Error de «no es admin» trae su
      // propio mensaje.
      this.problema.set(
        error instanceof HttpErrorResponse ? mensajeDeApi(error) : (error as Error).message,
      );
    } finally {
      this.enviando.set(false);
    }
  }
}
