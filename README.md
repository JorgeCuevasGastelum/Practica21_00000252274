# Practica 21 — El panel del gimnasio: rutas, el formulario y la API
## Jorge Cuevas Gastelum - 00000252274
## Topico de Aplicaciones Web 7:30 - 9:00 P:M

El panel de la Practica 20 ahora tiene paginas con el router: Clases (el
tablero), Horarios y Miembros, y la pagina «Nueva clase» con un formulario
reactivo. Las clases ya no son datos locales: el servicio Catalogo las pide a
GET /clases con httpResource, y las imagenes tambien las sirve la API.
Todavia no hay login.

Lo nuevo esta en:

- src/app/app.routes.ts: las rutas.
- src/app/app.config.ts: provideRouter y provideHttpClient.
- src/app/app.html: la barra con routerLink y el router-outlet.
- src/app/paginas/: lista-clases, horarios, miembros y formulario-clase.
- src/app/validadores/bloques-de-5.ts: el validador propio.
- src/app/catalogo.ts: ahora con httpResource.

Del codigo base de practica-21 se copiaron solo config.ts y
servicios/errores.ts. Se borraron src/app/datos/ y public/img/, porque ahora
todo sale de la API.

Para correrlo:

1. Levantar gimnasio-backend de la Unidad IV (la carpeta
   Practica15_Gimnasio_Backend-main) con `npm run start:dev` en
   http://localhost:3000.
2. En gimnasio-admin/, `npm install` y `npm start`.
3. Abrir http://localhost:4200.

Necesita Node 22.22.3, 24.15 o mas nuevo.

Las capturas estan en la carpeta evidencias/.


## Preguntas — Ejercicio 1

### 1. ¿Que pieza de React Router corresponde a router-outlet, a routerLink y a routerLinkActive?

- **router-outlet → `<Outlet />`.** Es el hueco del layout donde se pinta la
  pagina que coincide con la URL. La barra se queda y solo cambia lo de
  adentro.
- **routerLink → `<Link to>`.** Navega cambiando la URL con la History API,
  sin recargar la pagina ni volver a bajar la app.
- **routerLinkActive → `<NavLink>`.** En React, NavLink le pasaba isActive a
  className para pintar el enlace de la pagina actual. En Angular es una
  directiva aparte que se pone junto al routerLink y agrega la clase
  (barra__enlace--activo) cuando la ruta esta activa.

### 2. ¿Por que la ruta comodin (\*\*) va al final y la ruta vacia necesita pathMatch: 'full'?

Angular revisa las rutas en orden y se queda con la primera que coincide. El
comodin `**` coincide con cualquier direccion: si estuviera arriba, se
comeria /clases, /horarios y todo lo demas, y nunca se llegaria a las otras
rutas. Al final solo atrapa lo que ninguna otra ruta reconocio.

La ruta vacia necesita pathMatch: 'full' porque por defecto Angular compara
por prefijo, y '' es prefijo de cualquier URL. Sin 'full', /horarios tambien
"empezaria con ''" y se iria a /clases. Con 'full', la redireccion solo pasa
cuando la URL esta vacia de verdad, o sea, en http://localhost:4200/.


## Preguntas — Ejercicio 2

### 1. ¿Donde vive el valor de un campo en un formulario reactivo y en que se diferencia del useState de React?

Vive en un FormControl dentro de la clase del componente: el FormGroup que
arma FormBuilder en formulario-clase.ts. El input del HTML solo lo refleja
con formControlName. Se lee con formulario.controls.nombre.value, o todo
junto con getRawValue().

Con useState el valor vivia en el estado del componente y habia que
conectarlo a mano: value={nombre} y onChange={(e) => setNombre(...)} en cada
input, y la validacion tambien se escribia a mano. El FormControl ya trae
todo eso: el valor, sus validadores y su estado (valid, invalid, touched,
dirty, errors). Por eso se puede preguntar si un campo ya fue tocado para
mostrar el mensaje solo entonces.

### 2. ¿Que regresa un validador propio cuando el valor es valido y cuando no, y como se relaciona con hasError?

Cuando el valor es valido regresa **null**. Cuando no, regresa un **objeto**
con una clave que es el nombre del error. bloquesDe5 regresa
`{ bloquesDe5: { valor: 47, sugerido: 45 } }`.

Angular junta los errores de todos los validadores del campo en
control.errors. hasError('bloquesDe5') solo pregunta si esa clave esta ahi,
y getError('bloquesDe5') regresa lo que tiene adentro. Asi el mensaje puede
sugerir 45 cuando escriben 47. La clave del objeto y el texto del hasError
tienen que ser iguales: si no, el mensaje nunca sale.


## Preguntas — Ejercicio 3

### 1. ¿Que cambio en el servicio del catalogo y por que ningun componente se entero?

Antes, clases era `signal<Clase[]>(CLASES_LOCALES)`. Ahora el servicio tiene
un httpResource contra GET /clases, y clases es un computed que regresa lo
que llego de la API, o [] mientras carga o si fallo. Se agregaron cargando y
error, y vaciar/restaurar ahora usan set() y reload() del recurso.

Ningun componente se entero porque clases sigue llamandose igual y sigue
siendo una signal con un arreglo de clases. El filtro, la tarjeta y el
tablero solo leen catalogo.clases(), visibles(), minutos() y seleccionada(),
y esa "cara" del servicio no cambio. De donde salen los datos es un detalle
de adentro del servicio. Lo unico que se agrego en la pagina fueron los
estados de cargando y error, y la direccion completa de las imagenes.

### 2. ¿Por que no hizo falta iniciar sesion para leer el catalogo?

Porque en el backend GET /clases tiene el decorador @Publico(). El
JwtAuthGuard revisa el token en todas las rutas, pero las que llevan
@Publico() las deja pasar sin token: el catalogo lo puede ver cualquiera,
igual que en la app de React de los miembros.

Lo que si pide sesion, y ademas rol admin, es crear, editar y borrar
(POST, PATCH y DELETE /clases). Por eso el formulario de esta practica
todavia no manda nada: eso llega con el login en la Practica 22.
