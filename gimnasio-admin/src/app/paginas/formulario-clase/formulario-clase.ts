// <app-formulario-clase> — la página /clases/nueva.
// Un formulario reactivo: el valor de cada campo vive en un FormControl de la
// clase, no en el HTML. Por ahora NO manda nada: al guardar, enseña el objeto
// que se le mandaría a POST /clases (eso se hace en la Práctica 22).
import { Component, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CATEGORIAS, type Categoria, type ClaseNueva } from '../../modelos/clase';
import { bloquesDe5 } from '../../validadores/bloques-de-5';

@Component({
  imports: [ReactiveFormsModule, RouterLink, JsonPipe],
  selector: 'app-formulario-clase',
  styleUrl: './formulario-clase.css',
  templateUrl: './formulario-clase.html',
})
export class FormularioClase {
  private readonly fb = inject(FormBuilder);
  protected readonly categorias = CATEGORIAS;

  // Las mismas reglas que valida la API (CrearClaseDto), más el bloque de 5 minutos.
  protected readonly formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    categoria: ['' as Categoria | '', Validators.required],
    descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
    duracionMin: [null as number | null, [Validators.required, Validators.min(10), Validators.max(180), bloquesDe5]],
    imagen: ['', [Validators.required, Validators.maxLength(120), Validators.pattern(/^\/img\/.+\.(jpg|jpeg|png|webp)$/)]],
  });

  // El objeto listo para mandar; null mientras no se ha guardado.
  protected readonly listo = signal<ClaseNueva | null>(null);

  // ¿Enseñar los errores de este campo? Sólo si ya lo tocaron.
  protected mostrarErrores(campo: keyof typeof this.formulario.controls): boolean {
    const control = this.formulario.controls[campo];
    return control.invalid && control.touched;
  }

  protected guardar() {
    if (this.formulario.invalid) {
      // Se marcan todos como tocados para que salgan todos los mensajes en rojo.
      this.formulario.markAllAsTouched();
      this.listo.set(null);
      return;
    }
    const valor = this.formulario.getRawValue();
    this.listo.set({
      nombre: valor.nombre.trim(),
      categoria: valor.categoria as Categoria,
      descripcion: valor.descripcion.trim(),
      duracionMin: Number(valor.duracionMin),
      imagen: valor.imagen.trim(),
    });
  }

  protected limpiar() {
    this.formulario.reset();
    this.listo.set(null);
  }
}
