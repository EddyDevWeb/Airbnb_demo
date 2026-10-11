# Airbnb Demo

Plataforma web de alquiler de alojamientos inspirada en Airbnb. Permite a los usuarios explorar y reservar propiedades, a los anfitriones publicar y gestionar sus alojamientos, y a los administradores controlar usuarios, roles y catálogos del sistema. Incluye autenticación con JWT, reservas, pagos, reseñas, favoritos, notificaciones en tiempo real y chat entre usuarios mediante WebSockets.

> Proyecto full stack (Frontend + Backend) desarrollado como demostración de arquitectura cliente-servidor, API REST y comunicación en tiempo real.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--time-010101?logo=socket.io&logoColor=white)](https://socket.io/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](#licencia)

---

## Características

- Autenticación y autorización con **JWT** y contraseñas cifradas con **bcrypt**.
- **Roles de usuario**: `client`, `host` y `admin` con permisos diferenciados.
- **Gestión de alojamientos**: crear, editar, listar y eliminar propiedades (CRUD).
- **Búsqueda y filtrado** de alojamientos por categoría.
- **Reservas** con estados (`pending`, `confirmed`, `cancelled`, `completed`).
- **Pagos** y métodos de pago asociados a las reservas.
- **Reseñas** por alojamiento y **favoritos** por usuario.
- **Chat privado** y **notificaciones en tiempo real** con Socket.io.
- **Panel de anfitrión** y **panel de administración** (usuarios, roles, categorías, estados y tipos de notificación).
- Envío de correos transaccionales con **Nodemailer**.
- Seed automático de roles, categorías y estados de reserva al arrancar el servidor.

---

## Stack tecnológico

### Frontend
- **React 19** + **TypeScript**
- **Vite** (bundler y servidor de desarrollo)
- **React Router v7** (enrutado con rutas protegidas por rol)
- **Tailwind CSS** (estilos)
- **Axios** (cliente HTTP)
- **Socket.io Client** (tiempo real)
- **Zustand** y **React Query** (gestión de estado y datos)
- **React Toastify** y **date-fns**

### Backend
- **Node.js** + **Express 5** (API REST, ESM)
- **MongoDB** + **Mongoose** (base de datos)
- **Socket.io** (WebSockets)
- **JWT** + **bcryptjs** (autenticación)
- **Nodemailer** (emails)
- **Helmet**, **CORS**, **Compression**, **Morgan** (seguridad, logging y rendimiento)
- **express-validator** (validación de entrada)

---

## Estructura del proyecto

```
Airbnb_demo/
├── backend/
│   ├── src/
│   │   ├── config/          # Conexión a MongoDB
│   │   ├── controllers/     # Lógica de negocio de cada recurso
│   │   ├── middlewares/     # Auth, roles y Socket
│   │   ├── models/          # Esquemas de Mongoose
│   │   ├── routes/          # Definición de endpoints de la API
│   │   ├── seed/            # Datos iniciales (roles, categorías, estados)
│   │   ├── sockets/         # Emisión de notificaciones en tiempo real
│   │   └── utils/           # Helpers (JWT, email, validaciones)
│   ├── server.js            # Punto de entrada del servidor
│   └── .env.example         # Plantilla de variables de entorno
└── frontend/
    ├── src/
    │   ├── api/             # Instancia de Axios
    │   ├── components/      # Componentes reutilizables
    │   ├── context/         # Auth y Socket providers
    │   ├── hooks/           # Hooks personalizados
    │   ├── layouts/         # Layouts (app, host, admin)
    │   ├── pages/           # Vistas por dominio (auth, listings, bookings...)
    │   ├── router/          # Configuración de rutas y rutas privadas
    │   ├── services/        # Llamadas a la API
    │   └── types/           # Tipos e interfaces de TypeScript
    └── .env.example         # Plantilla de variables de entorno
```

---

## Requisitos previos

- **Node.js** 18 o superior
- **npm**
- Una base de datos **MongoDB** (local o un clúster gratuito de **MongoDB Atlas**)
- Una cuenta de correo con **contraseña de aplicación** (para el envío de emails con Gmail)

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/EddyDevWeb/Airbnb_demo.git
cd Airbnb_demo
```

### 2. Backend

```bash
cd backend
npm install
```

Crea un archivo `.env` a partir del ejemplo:

```bash
cp .env.example .env   # En Windows: copy .env.example .env
```

Rellena las variables (ver sección [Variables de entorno](#variables-de-entorno)) y arranca el servidor:

```bash
npm run dev     # Desarrollo con nodemon (recarga automática)
npm start       # Producción
```

El servidor se ejecuta en `http://localhost:3000`.

### 3. Frontend

```bash
cd frontend
npm install
```

Crea el archivo `.env` a partir del ejemplo:

```bash
cp .env.example .env   # En Windows: copy .env.example .env
```

Arranca la aplicación:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## Variables de entorno

### Backend (`backend/.env`)

| Variable     | Descripción                                        | Ejemplo                              |
| ------------ | -------------------------------------------------- | ------------------------------------ |
| `PORT`       | Puerto del servidor                                | `3000`                               |
| `CLIENT_URL` | URL(s) del frontend para CORS (separadas por coma) | `http://localhost:5173`              |
| `MONGO_URI`  | Cadena de conexión de MongoDB                      | `mongodb://localhost:27017/airbnb`   |
| `JWT_SECRET` | Clave secreta para firmar los tokens JWT           | `una_clave_larga_y_segura`           |
| `EMAIL_USER` | Correo emisor para notificaciones                  | `example@gmail.com`                  |
| `EMAIL_PASS` | Contraseña de aplicación del correo                | `xxxx xxxx xxxx xxxx`                |

### Frontend (`frontend/.env`)

| Variable       | Descripción                 | Ejemplo                 |
| -------------- | --------------------------- | ----------------------- |
| `VITE_API_URL` | URL base del backend        | `http://localhost:3000` |

> ⚠️ **Nunca subas tu archivo `.env` al repositorio.** Ya está incluido en `.gitignore`.

---

## Scripts disponibles

### Backend
| Comando       | Descripción                              |
| ------------- | ---------------------------------------- |
| `npm run dev` | Servidor en desarrollo con recarga viva  |
| `npm start`   | Servidor en modo producción              |

### Frontend
| Comando           | Descripción                             |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Servidor de desarrollo (Vite)           |
| `npm run build`   | Compila TypeScript y genera `dist/`     |
| `npm run preview` | Previsualiza el build de producción     |
| `npm run lint`    | Analiza el código con ESLint            |

---

## Endpoints principales de la API

Base URL: `http://localhost:3000/api`

### Autenticación y usuarios — `/auth` · `/users`
| Método   | Endpoint              | Descripción                    | Rol           |
| -------- | --------------------- | ------------------------------ | ------------- |
| `POST`   | `/users/register`     | Registro de usuario            | Público       |
| `POST`   | `/users/login`        | Inicio de sesión               | Público       |
| `GET`    | `/auth/me`            | Perfil autenticado             | Autenticado   |
| `PATCH`  | `/users/become-host`  | Convertirse en anfitrión       | Autenticado   |
| `GET`    | `/users`              | Listar usuarios                | Admin         |
| `PUT`    | `/users/:id/role`     | Cambiar rol de usuario         | Admin         |
| `DELETE` | `/users/:id`          | Eliminar usuario               | Admin         |

### Alojamientos — `/listings`
| Método   | Endpoint            | Descripción               | Rol                |
| -------- | ------------------- | ------------------------- | ------------------ |
| `GET`    | `/listings/get`     | Listar alojamientos       | Público            |
| `GET`    | `/listings/getId/:id` | Detalle de alojamiento  | Público            |
| `GET`    | `/listings/my`      | Mis alojamientos          | Host / Admin       |
| `POST`   | `/listings/create`  | Crear alojamiento         | Host / Admin       |
| `PUT`    | `/listings/update/:id` | Editar alojamiento     | Host / Admin       |
| `DELETE` | `/listings/delete/:id` | Eliminar alojamiento   | Host / Admin       |

### Reservas — `/bookings`
| Método   | Endpoint                  | Descripción                | Rol          |
| -------- | ------------------------- | -------------------------- | ------------ |
| `POST`   | `/bookings/create`        | Crear reserva              | Autenticado  |
| `GET`    | `/bookings/GetAll`        | Listar reservas            | Autenticado  |
| `GET`    | `/bookings/host`          | Reservas del anfitrión     | Host / Admin |
| `GET`    | `/bookings/get/:id`       | Detalle de reserva         | Autenticado  |
| `PUT`    | `/bookings/update/:id`    | Actualizar reserva         | Autenticado  |
| `PUT`    | `/bookings/:id/status`    | Cambiar estado             | Host / Admin |
| `DELETE` | `/bookings/delete/:id`    | Eliminar reserva           | Autenticado  |

### Pagos — `/payments`
| Método | Endpoint                | Descripción              | Rol          |
| ------ | ----------------------- | ------------------------ | ------------ |
| `POST` | `/payments/create`      | Crear pago               | Autenticado  |
| `GET`  | `/payments/my`          | Mis pagos                | Autenticado  |
| `GET`  | `/payments/get/:id`     | Detalle de pago          | Autenticado  |
| `GET`  | `/payments/all`         | Listar pagos             | Admin        |
| `PUT`  | `/payments/status/:id`  | Cambiar estado del pago  | Admin        |

### Reseñas, favoritos, chat y notificaciones
| Método   | Endpoint                            | Descripción                    | Rol          |
| -------- | ----------------------------------- | ------------------------------ | ------------ |
| `POST`   | `/reviews/create`                   | Crear reseña                   | Autenticado  |
| `GET`    | `/reviews/listing/:listingId`       | Reseñas de un alojamiento      | Público      |
| `POST`   | `/favorites/add`                    | Añadir a favoritos             | Autenticado  |
| `GET`    | `/favorites/user/:userId`           | Favoritos del usuario          | Autenticado  |
| `GET`    | `/chatAibnb/messages/:userId`       | Historial de chat              | Autenticado  |
| `GET`    | `/chatAibnb/conversations`          | Listar conversaciones          | Autenticado  |
| `POST`   | `/chatAibnb/messages/send`          | Enviar mensaje                 | Autenticado  |
| `GET`    | `/notifications/get/:userId`        | Notificaciones del usuario     | Autenticado  |
| `POST`   | `/notifications/create`             | Crear notificación             | Autenticado  |

### Administración (catálogos)
| Recurso        | Endpoint base          | Descripción                               |
| -------------- | ---------------------- | ----------------------------------------- |
| Roles          | `/roles`               | Gestión de roles                          |
| Categorías     | `/categories`          | Gestión de categorías                     |
| Estados reserva| `/bookingsStatus`      | Gestión de estados de reserva             |
| Tipos notif.   | `/notification-types`  | Gestión de tipos de notificación          |

---

## Roles y rutas del frontend

| Rol      | Acceso                                                                                         |
| -------- | ---------------------------------------------------------------------------------------------- |
| `client` | Inicio, alojamientos, reservas, pagos, favoritos, perfil, notificaciones y chat               |
| `host`   | Todo lo anterior + panel de anfitrión (`/host`, `/host/listings`, `/host/bookings`)            |
| `admin`  | Acceso total + panel de administración (`/admin/users`, `/admin/roles`, catálogos, etc.)      |

---

## Despliegue

### 1. Base de datos — MongoDB Atlas (gratis)
En la nube **no** puedes usar `mongodb://localhost`. Necesitas un clúster:
1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) y un clúster **M0 (gratis)**.
2. **Database Access** → crea un usuario y contraseña.
3. **Network Access** → añade `0.0.0.0/0` (permite conexiones desde cualquier IP).
4. **Connect → Drivers** → copia la cadena `mongodb+srv://...`. Esa será tu `MONGO_URI`.

### 2. Backend en Render
> El repositorio incluye un `render.yaml`. Si en Render eliges **New → Blueprint** y apuntas a este repo,
> Render crea el servicio del backend automáticamente y solo tendrás que rellenar las variables marcadas.

1. Crea una cuenta en [Render](https://render.com) y conecta tu GitHub.
2. **New → Web Service** y selecciona este repositorio (o **New → Blueprint** para usar `render.yaml`).
3. Configura:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
4. En **Environment Variables** añade:
   - `MONGO_URI` → la cadena de Atlas
   - `JWT_SECRET` → cadena larga y aleatoria
   - `EMAIL_USER` y `EMAIL_PASS`
   - `CLIENT_URL` → la URL de Vercel (la añades después del paso 3)
   - `PORT` lo asigna Render automáticamente.
5. Deploy y anota la URL del servicio (ej: `https://airbnb-demo.onrender.com`).

> Endpoint de salud para monitoreo: `GET /health`.

### 3. Frontend en Vercel
1. Crea una cuenta en [Vercel](https://vercel.com) e importa este repositorio.
2. Configura:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite` (autodetectado)
   - **Build Command**: `npm run build` · **Output Directory**: `dist`
3. En **Environment Variables** añade:
   - `VITE_API_URL` → la URL del backend en Render (ej: `https://airbnb-demo.onrender.com`)
4. Deploy. Vercel devolverá una URL como `https://airbnb-demo.vercel.app`.

### 4. Cerrar el círculo (CORS + WebSockets)
Vuelve a **Render → Environment Variables** y pon `CLIENT_URL` con la URL real de Vercel
(`https://airbnb-demo.vercel.app`) y haz **redeploy**. Así el backend acepta peticiones y
conexiones de Socket.io desde el frontend desplegado.

> ⚠️ En el plan **Free** de Render, el servicio se "duerme" tras un rato de inactividad: la primera petición puede tardar ~30 s en responder.

---

## Autor

**EddyDevWeb** — [@EddyDevWeb](https://github.com/EddyDevWeb)

---

## Licencia

Este proyecto está distribuido bajo la licencia **ISC**.
