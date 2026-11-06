# API REST de Usuarios (PHP + MySQL)

API REST para la gestión del recurso **Usuarios** (CRUD completo), desarrollada en PHP con PDO y MySQL. Sigue una arquitectura por capas (modelo, controlador y rutas) con un único punto de entrada (`public/index.php`). Incluye una interfaz web con Bootstrap para consumir la API desde el navegador.

## Tecnologías

- PHP 8.1 o superior (PDO)
- MySQL / MariaDB
- Bootstrap 5 y JavaScript (`fetch`) para la interfaz web
- XAMPP como entorno local de desarrollo

## Estructura del proyecto

```
api-users/
├── database/
│   └── schema.sql                  # Script de creación de la BD y la tabla
├── public/
│   ├── index.php                   # front controller
│   ├── usuarios.html               # Interfaz web
│   └── usuarios.js                 # Lógica de la interfaz
├── src/
│   ├── config/
│   │   └── database.php            # Conexión a la base de datos (PDO)
│   ├── controllers/
│   │   └── UsersController.php     # Respuestas JSON, validación y códigos HTTP
│   ├── models/
│   │   └── Users.php               # Acceso a datos (CRUD)
│   └── routes/
│       └── api.php                 # Registro de rutas
└── README.md
```

## Requisitos

- PHP 8.1 o superior con la extensión `pdo_mysql` (incluida y activa en XAMPP)
- MySQL o MariaDB (módulo MySQL de XAMPP)
- Git, para clonar el repositorio

## Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/firexen5/PA-3-Prog-Web---Joaquin-G-mez.git
cd PA-3-Prog-Web---Joaquin-G-mez
```

### 2. Crear la base de datos

Con MySQL encendido, importa el script `database/schema.sql`.

**Opción A: phpMyAdmin.** Abre `http://localhost/phpmyadmin`, ve a la pestaña **Importar**, selecciona `database/schema.sql` y presiona **Importar**.

**Opción B: línea de comandos.**

```bash
mysql -u root -p < database/schema.sql
```

(Con XAMPP en Windows: `C:\xampp\mysql\bin\mysql.exe -u root < database\schema.sql`.)

El script crea la base de datos `bd_users` y la tabla `users`:

| Campo        | Tipo                     | Descripción                          |
|--------------|--------------------------|--------------------------------------|
| `id`         | INT, AUTO_INCREMENT, PK  | Identificador del usuario            |
| `name`       | VARCHAR(100)             | Nombre                               |
| `email`      | VARCHAR(150)             | Correo electrónico                   |
| `password`   | VARCHAR(255)             | Contraseña                           |

### 3. Configurar la conexión

Edita `src/config/database.php` si tus credenciales son distintas de las predeterminadas de XAMPP:

```php
$host     = 'localhost';
$dbname   = 'bd_users';
$user     = 'root';
$password = '';
```

### 4. Iniciar el servidor

Desde la carpeta `public`:

```bash
cd public
php -S localhost:8000 index.php
```

En Windows con XAMPP, si `php` no se reconoce como comando:

```cmd
cd public
C:\xampp\php\php.exe -S localhost:8000 index.php
```

Deja esa ventana abierta mientras uses la API.

### 5. Probar

- API: `http://localhost:8000/api/users`
- Interfaz web: `http://localhost:8000/usuarios.html`

## Endpoints

| Método | Ruta               | Descripción                  | Códigos de respuesta |
|--------|--------------------|------------------------------|----------------------|
| GET    | `/api/users`       | Listar todos los usuarios    | 200, 500             |
| GET    | `/api/users/{id}`  | Obtener un usuario por ID    | 200, 404, 500        |
| POST   | `/api/users`       | Crear un usuario             | 201, 400, 500        |
| PUT    | `/api/users/{id}`  | Actualizar un usuario        | 200, 400, 404, 500   |
| DELETE | `/api/users/{id}`  | Eliminar un usuario          | 200, 404, 500        |

Todas las respuestas son JSON (`Content-Type: application/json; charset=utf-8`).

## Ejemplos de peticiones HTTP

Los ejemplos usan `curl`. En Windows, usa `curl.exe` o las alternativas de PowerShell que aparecen más abajo.

### Crear usuario (POST)

```http
POST /api/users HTTP/1.1
Host: localhost:8000
Content-Type: application/json

{
  "name": "Ana Pérez",
  "email": "ana@mail.com",
  "password": "secreto123"
}
```

```bash
curl -i -X POST http://localhost:8000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana Pérez","email":"ana@mail.com","password":"secreto123"}'
```

Respuesta `201 Created`:

```json
{
  "mensaje": "Usuario creado",
  "id": 1
}
```

### Listar usuarios (GET)

```bash
curl -i http://localhost:8000/api/users
```

Respuesta `200 OK`:

```json
[
  {
    "id": 1,
    "name": "Ana Pérez",
    "email": "ana@mail.com",
    "created_at": "2026-11-06 15:30:00"
  }
]
```

### Obtener usuario por ID (GET)

```bash
curl -i http://localhost:8000/api/users/1
```

Respuesta `200 OK`: el objeto del usuario. Si no existe, `404 Not Found`:

```json
{
  "error": "Usuario no encontrado"
}
```

### Actualizar usuario (PUT)

```bash
curl -i -X PUT http://localhost:8000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana P.","email":"ana@mail.com","password":"nueva12345"}'
```

Respuesta `200 OK`:

```json
{
  "mensaje": "Usuario actualizado",
  "id": 1
}
```

### Eliminar usuario (DELETE)

```bash
curl -i -X DELETE http://localhost:8000/api/users/1
```

Respuesta `200 OK`:

```json
{
  "mensaje": "Usuario eliminado",
  "id": 1
}
```

### Ejemplos en Windows (PowerShell)

```powershell
# Crear
Invoke-RestMethod -Method Post -Uri http://localhost:8000/api/users `
  -ContentType "application/json" `
  -Body '{"name":"Ana Perez","email":"ana@mail.com","password":"secreto123"}'

# Listar
Invoke-RestMethod -Uri http://localhost:8000/api/users

# Eliminar
Invoke-RestMethod -Method Delete -Uri http://localhost:8000/api/users/1
```

También puedes probar los endpoints con Postman, Insomnia o la extensión Thunder Client de VS Code.

## Códigos de estado

| Código | Significado                                                                                  |
|--------|----------------------------------------------------------------------------------------------|
| 200    | Operación exitosa (listar, obtener, actualizar, eliminar)                                    |
| 201    | Usuario creado                                                                               |
| 400    | Datos inválidos: JSON mal formado, campos obligatorios faltantes, email inválido o duplicado |
| 404    | Usuario o ruta no encontrados                                                                |
| 500    | Error interno del servidor                                                                   |

Las respuestas de error tienen la forma `{"error": "mensaje descriptivo"}`.

## Validaciones

En `POST` y `PUT` el cuerpo debe ser un JSON válido con los campos `name`, `email` y `password`:

- Los tres campos son obligatorios y deben ser texto no vacío.
- `email` debe tener un formato válido y no puede repetirse.

Ejemplo de error `400 Bad Request`:

```json
{
  "error": "El campo 'name' es obligatorio"
}
```

## Interfaz web

La carpeta `public` incluye una interfaz con Bootstrap (`usuarios.html` y `usuarios.js`) que permite listar, crear, editar y eliminar usuarios consumiendo esta API. Se sirve desde el mismo servidor de PHP, por lo que no requiere configuración adicional de CORS.

## Notas de seguridad

- Las consultas usan sentencias preparadas de PDO (protección contra inyección SQL).
- Las contraseñas se guardan con `password_hash()` y nunca se devuelven en las respuestas de la API.
- Las credenciales de la base de datos incluidas son las predeterminadas de XAMPP, solo para desarrollo local. No las uses en producción.

## Autor

Joaquín Gómez — [@firexen5](https://github.com/firexen5)
