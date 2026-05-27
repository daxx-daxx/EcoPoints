# EcoPoints

EcoPoints es una aplicacion web pensada para Parques Reunidos que convierte el reciclaje dentro del parque en puntos canjeables por recompensas. El usuario escanea una papelera EcoPoints, valida el codigo de su ticket, acumula puntos y puede cambiarlos por descuentos para futuras visitas.

El proyecto combina un frontend en Angular con un backend PHP y una base de datos MySQL.

## Que permite hacer

- Crear una cuenta e iniciar sesion.
- Escanear el QR de una papelera EcoPoints.
- Introducir un codigo de ticket para validar el reciclaje.
- Sumar EcoPoints al perfil del usuario.
- Consultar puntos, reciclajes realizados y CO2 ahorrado.
- Ver recompensas disponibles por parque.
- Canjear puntos por codigos de descuento.
- Cerrar sesion y volver al login.

## Flujo principal

1. El usuario se registra o inicia sesion.
2. Desde `Escanear`, lee el QR de una papelera del parque.
3. La app valida que el QR tenga formato de papelera EcoPoints, por ejemplo `FAUNIA-BIN-001`.
4. El usuario introduce el codigo de su ticket.
5. El backend comprueba que el ticket exista, no este usado y pertenezca al mismo parque que la papelera.
6. Si todo es correcto, se suman los puntos, se marca el ticket como usado y se guarda el reciclaje.
7. Los puntos acumulados pueden canjearse en `Recompensas`.

## Tecnologias

- Angular 21
- TypeScript
- SCSS
- RxJS
- html5-qrcode
- PHP
- MySQL
- XAMPP

## Estructura del proyecto

```text
EcoPoints/
+-- README.md
+-- database.sql
+-- ecopoints/
    +-- angular.json
    +-- package.json
    +-- src/
        +-- main.ts
        +-- styles.scss
        +-- app/
            +-- app.routes.ts
            +-- app.config.ts
            +-- services/
            |   +-- api.service.ts
            |   +-- session.service.ts
            +-- components/
            |   +-- footer/
            +-- pages/
                +-- login/
                +-- register/
                +-- scan/
                +-- rewards/
                +-- profile/
```

El backend PHP se consume desde:

```text
http://localhost/ecopoints-backend
```

En el entorno actual esta ubicado en:

```text
C:\XAMP\htdocs\ecopoints-backend
```

## Pantallas

### Login

Pantalla de inicio de sesion. Valida email y contrasena, guarda el usuario en memoria con `SessionService` y redirige a `/scan` cuando el login es correcto.

### Register

Pantalla de creacion de cuenta. Valida nombre, email, contrasena y confirmacion. Envia los datos al backend y redirige al login si el registro se completa.

### Scan

Pantalla central de la app. Usa `html5-qrcode` para abrir la camara y leer el QR de una papelera. Despues solicita el codigo del ticket y registra el reciclaje.

### Rewards

Permite elegir parque, listar recompensas activas y canjear puntos. Al canjear, genera un codigo de descuento unico.

### Profile

Muestra datos del usuario, total de EcoPoints, numero de reciclajes y CO2 ahorrado. El CO2 se calcula como `0.1 kg` por reciclaje.

## Rutas frontend

| Ruta | Pantalla |
| --- | --- |
| `/` | Redireccion a `/login` |
| `/login` | Inicio de sesion |
| `/register` | Crear cuenta |
| `/scan` | Escanear papelera y validar ticket |
| `/rewards` | Recompensas y cupones |
| `/profile` | Perfil del usuario |

## Servicios Angular

### `ApiService`

Centraliza las llamadas HTTP al backend:

| Metodo | Endpoint |
| --- | --- |
| `register(name, email, password)` | `register.php` |
| `login(email, password)` | `login.php` |
| `getProfile(user_id)` | `profile.php` |
| `recycle(user_id, ticket_code, bin_code)` | `recycle.php` |
| `getRewards(park_id)` | `rewards.php` |
| `redeem(user_id, reward_id)` | `redeem.php` |

### `SessionService`

Mantiene la sesion del usuario en memoria:

- usuario actual
- id del usuario
- puntos
- numero de reciclajes
- CO2 ahorrado
- cierre de sesion

## Backend PHP

El backend expone endpoints JSON por metodo `POST` y permite CORS para comunicarse con Angular.

| Archivo | Funcion |
| --- | --- |
| `db.php` | Conexion PDO a MySQL |
| `register.php` | Registro de usuarios con `password_hash` |
| `login.php` | Login con `password_verify` |
| `profile.php` | Datos del perfil y CO2 ahorrado |
| `recycle.php` | Validacion de papelera, ticket y suma de puntos |
| `rewards.php` | Listado de recompensas activas por parque |
| `redeem.php` | Canje de puntos y generacion de cupon |

## Base de datos

El archivo `database.sql` crea la base funcional de EcoPoints.

Tablas principales:

| Tabla | Descripcion |
| --- | --- |
| `users` | Usuarios, puntos y reciclajes acumulados |
| `bins` | Papeleras EcoPoints por parque |
| `tickets` | Tickets validables, puntos y estado de uso |
| `rewards` | Recompensas disponibles |
| `recycling_history` | Historial de reciclajes |
| `redemptions` | Canjes realizados y codigos generados |

Datos iniciales incluidos:

- 30 papeleras activas de Faunia.
- 10 tickets de prueba.
- 5 recompensas activas para Faunia.

Ejemplos utiles:

```text
Papelera: FAUNIA-BIN-001
Ticket:   FNA-0350-X8K2Q
```

## Instalacion

### 1. Instalar dependencias del frontend

```bash
cd EcoPoints/ecopoints
npm install
```

### 2. Crear la base de datos

En MySQL crea la base:

```sql
CREATE DATABASE ecopoints CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Despues importa:

```text
EcoPoints/database.sql
```

### 3. Preparar el backend

Coloca los archivos PHP del backend en:

```text
htdocs/ecopoints-backend
```

Comprueba que `db.php` coincide con tu configuracion de MySQL. En este proyecto se usa el puerto `3307`.

### 4. Iniciar Angular

```bash
npm start
```

La app quedara disponible normalmente en:

```text
http://localhost:4200
```

