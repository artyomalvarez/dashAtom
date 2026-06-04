export function renderNotFound() {
    return `
    <main class="flex min-h-screen items-center justify-center px-6 py-10 transition-colors duration-300">
      <section class="w-full max-w-2xl rounded-4xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center shadow-xl shadow-blue-100/70 dark:shadow-none transition-all">
        
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
          Error de navegacion
        </p>
        
        <h1 class="mt-4 text-6xl font-black tracking-tight text-slate-900 dark:text-white">
          404
        </h1>
        
        <p class="mt-4 text-lg text-slate-600 dark:text-slate-400">
          La vista que intentas abrir no existe o todavia no esta disponible dentro del proyecto.
        </p>
        
        <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500 transition-all" href="/">
            Ir a home
          </a>
          
          <a class="inline-flex items-center justify-center rounded-2xl border border-blue-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-3 text-sm font-bold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all" href="/login">
            Volver al login
          </a>
        </div>
      </section>
    </main>
    `;
}