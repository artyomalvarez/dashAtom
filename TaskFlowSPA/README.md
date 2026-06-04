# TaskFlowSPA

Sistema moderno de gestión de tareas y productividad construido como **Single Page Application** con JavaScript Vanilla. Diseñado para aprender arquitectura frontend real sin depender de frameworks como React, Vue o Angular.

---

## Vista previa

| Login | Dashboard |
|-------|-----------|
| Formulario de autenticación con validación y SweetAlert | Panel principal con estadísticas del usuario activo |

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| JavaScript Vanilla (ES6+) | Lógica, router, servicios y vistas |
| HTML5 | Estructura base (`index.html`) |
| Tailwind CSS v4 | Estilos y modo oscuro |
| Vite v8 | Bundler y servidor de desarrollo |
| SweetAlert2 | Alertas y confirmaciones |
| JSON Server | Backend simulado (API REST) |

---

## Funcionalidades

- Registro e inicio de sesión con validación
- Sesión persistida en `localStorage`
- Navegación SPA con History API sin recargas
- Guard de rutas — rutas públicas y privadas
- Sistema de roles: `USER` y `ADMIN`
- CRUD completo de tareas por usuario
- Búsqueda y filtro de tareas en tiempo real
- Panel administrativo para gestión de usuarios
- Cambio de rol, edición y eliminación de usuarios
- Asignación de tareas desde el panel admin
- Modo oscuro / claro persistido en `localStorage`
- Página 404 para rutas no encontradas

---

## Arquitectura

El proyecto usa una **arquitectura por capas** adaptada a SPA en JavaScript Vanilla:

```
src/
├── components/
│   ├── atoms/
│   │   └── registerButton.js     ← Átomos reutilizables (buttons)
│   └── organisms/
│       └── Navbar.js             ← Componentes complejos
├── router/
│   ├── router.js                 ← Motor de navegación SPA + guards
│   └── routes.js                 ← Mapa de rutas
├── services/
│   ├── auth.service.js           ← Login y logout
│   ├── user.service.js           ← CRUD de usuarios
│   ├── task.service.js           ← CRUD de tareas
│   ├── admin.service.js          ← Operaciones administrativas
│   └── profile.service.js        ← Perfil de usuario
├── styles/
│   └── global.css                ← Estilos globales + Tailwind
├── utils/
│   └── theme.js                  ← Toggle modo oscuro
└── views/
    ├── admin/
    │   ├── admin.js              ← Panel administrativo
    │   └── profile.js            ← Perfil del usuario
    ├── app/
    │   └── dashboard.js          ← Dashboard principal
    ├── auth/
    │   ├── login.js              ← Vista de login
    │   └── resgister.js          ← Vista de registro
    ├── tasks/
    │   ├── task.js               ← Lista de tareas
    │   └── task-form.js          ← Formulario crear/editar
    ├── home.js                   ← Vista de inicio
    └── not-found.js              ← Vista 404
```

---

## Cómo correrlo

### 1. Clonar el repositorio

```bash
git clone https://github.com/artyomalvarez/TaskFlowSPA.git
cd TaskFlowSPA
```

### 2. Instalar dependencias del frontend

```bash
npm install
```

### 3. Iniciar el backend simulado

En una terminal separada, dentro de la carpeta `taskFlowApi`:

```bash
cd taskFlowApi
npx json-server dataBase.json
```

El servidor corre en `http://localhost:3000` con los endpoints:
- `http://localhost:3000/users`
- `http://localhost:3000/tasks`

### 4. Iniciar el frontend

```bash
npm run dev
```

La app corre en `http://localhost:5173`

---

## Flujo de navegación

```
Usuario entra → /
    ↓
Sin sesión → /login
    ↓
Login exitoso → /dashboard (USER) o /admin (ADMIN)
    ↓
Navega entre rutas → router lee la URL → renderiza la vista
    ↓
Logout → limpia localStorage → /login
```

---

## Roles

| Rol | Permisos |
|-----|----------|
| `USER` | Ver y gestionar sus propias tareas, editar su perfil |
| `ADMIN` | Gestionar todos los usuarios, ver y editar todas las tareas, cambiar roles |

---

## Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
```

---

## Autor

**Juan Jose Alvarez Manjarrez **  
Estudiante RIWI Cohorte 5 — Barranquilla, Colombia  
GitHub: [@artyomalvarez](https://github.com/artyomalvarez)
