// Solo un "../" porque home.js está directamente en src/views/
import { renderNavbar, setupNavbar } from '../components/organisms/Navbar.js';

export function renderHome(params) {
    return `
    ${renderNavbar()}

    <main class="mx-auto max-w-6xl px-6 py-14 transition-colors duration-300">
      <section class="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p class="inline-flex rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-400">
            Organiza tu trabajo con calma
          </p>
          
          <h1 class="mt-6 text-5xl font-black tracking-tight text-slate-900 dark:text-white sm:text-6xl">
            Una plataforma clara para gestionar tareas, usuarios y productividad.
          </h1>
          
          <p class="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
            TaskFlowSPA presenta el recorrido principal del proyecto con una interfaz uniforme, amable y lista para convertirse
            luego en una SPA real con autenticación, roles, permisos y CRUD de tareas.
          </p>
          
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <a class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-500 transition-all" href="/login">
              Iniciar sesión
            </a>
            <a class="inline-flex items-center justify-center rounded-2xl border border-blue-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-3 text-sm font-bold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all" href="/register">
              Crear cuenta
            </a>
          </div>
        </div>

        <section class="rounded-4xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl shadow-blue-100/70 dark:shadow-none transition-all">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Vistas del proyecto</h2>
          <div class="mt-6 grid gap-4 sm:grid-cols-2">
            
            <a class="rounded-3xl bg-sky-50 dark:bg-slate-800/50 p-5 hover:bg-sky-100 dark:hover:bg-slate-800 transition-all" href="/dashboard">
              <p class="text-sm font-semibold text-blue-600 dark:text-blue-400">Dashboard</p>
              <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">Resumen principal de productividad.</p>
            </a>
            
            <a class="rounded-3xl bg-sky-50 dark:bg-slate-800/50 p-5 hover:bg-sky-100 dark:hover:bg-slate-800 transition-all" href="/tasks">
              <p class="text-sm font-semibold text-blue-600 dark:text-blue-400">Mis tareas</p>
              <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">CRUD principal del usuario.</p>
            </a>
            
            <a class="rounded-3xl bg-sky-50 dark:bg-slate-800/50 p-5 hover:bg-sky-100 dark:hover:bg-slate-800 transition-all" href="/profile">
              <p class="text-sm font-semibold text-blue-600 dark:text-blue-400">Mi perfil</p>
              <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">Actualizar cuenta y datos personales.</p>
            </a>
            
            <a class="rounded-3xl bg-sky-50 dark:bg-slate-800/50 p-5 hover:bg-sky-100 dark:hover:bg-slate-800 transition-all" href="/admin">
              <p class="text-sm font-semibold text-blue-600 dark:text-blue-400">Admin</p>
              <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">Gestión de usuarios y roles.</p>
            </a>
            
          </div>
        </section>
      </section>
    </main>
    `;
}

// Agregamos el setup para activar los eventos del Navbar
export function setupHome() {
    setupNavbar();
}