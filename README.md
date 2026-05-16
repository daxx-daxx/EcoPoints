# EcoPoints

EcoPoints es una aplicación web pensada para fomentar el reciclaje en parques como Faunia mediante un sistema de puntos y recompensas.

La idea principal es que el usuario pueda reciclar durante su visita al parque, validar esa acción con un ticket y recibir puntos que después podrá canjear por recompensas.

## ¿Qué hace la aplicación?

La aplicación permite al usuario:

- Registrarse e iniciar sesión.
- Simular el escaneo de una papelera.
- Introducir un código de ticket.
- Recibir puntos si el reciclaje es válido.
- Consultar sus puntos y estadísticas en el perfil.
- Ver recompensas disponibles.
- Canjear puntos por descuentos o beneficios.

## Tecnologías usadas

Para este proyecto se han usado:

- Angular
- TypeScript
- HTML
- CSS
- PHP
- MySQL
- XAMPP
- phpMyAdmin

## Estructura del proyecto

La parte principal de la aplicación está dentro de la carpeta `src/app`.

Las pantallas principales son:

- `login`: inicio de sesión.
- `register`: creación de cuenta.
- `scan`: pantalla para simular el escaneo y validar el ticket.
- `rewards`: recompensas disponibles.
- `profile`: perfil del usuario.

También se usan servicios para conectar la aplicación con el backend y para guardar la sesión del usuario mientras usa la app.

## Cómo ejecutar el proyecto

Primero hay que instalar las dependencias:

```bash
npm install

Después se puede ejecutar el proyecto con:

ng serve

La aplicación se abre en:

http://localhost:4200
Backend

La aplicación se conecta con un backend hecho en PHP.

La URL del backend está configurada en el archivo:

src/app/services/api.service.ts

Actualmente apunta a:

http://localhost/ecopoints-backend

Para que funcione, la carpeta del backend debe estar dentro de htdocs de XAMPP.

También hay que importar la base de datos en phpMyAdmin usando el archivo SQL del proyecto.

Funcionamiento básico

El funcionamiento de la app es el siguiente:

El usuario crea una cuenta o inicia sesión.
Entra en la pantalla de escaneo.
Se simula el escaneo de una papelera de Faunia.
El usuario introduce un código de ticket.
Si el ticket es correcto y no se ha usado antes, se suman puntos.
Los puntos aparecen en el perfil.
El usuario puede usar esos puntos para canjear recompensas.
Estado del proyecto

Actualmente la aplicación tiene implementadas las pantallas principales y la conexión con el backend.

Se puede registrar un usuario, iniciar sesión, validar reciclajes, sumar puntos, ver el perfil y canjear recompensas.

Posibles mejoras

Algunas mejoras que se podrían añadir más adelante son:

Escaneo real de códigos QR con la cámara.
Historial de reciclajes.
Ranking de usuarios.
Más parques disponibles.
Panel de administración para gestionar recompensas.
Más estadísticas sobre el impacto ambiental.
Autores

Proyecto realizado para la asignatura Interfaces de Usuario.

Equipo: EcoPoints


Este queda mucho más natural. No mete frases tipo *“solución innovadora, escalable y sostenible”* cada dos líneas, pero sigue estando completo.

Yo usaría este y, si quieres que suene todavía menos IA, cambia frases como:

```markdown
La idea principal es que...

por algo más vuestro:

La idea es que cuando una persona recicle en el parque pueda recibir puntos y usarlos luego en recompensas.