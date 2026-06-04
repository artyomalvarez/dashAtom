import { renderRoute } from "../../router/router.js";

export function renderNavbar() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isAdmin = currentUser && currentUser.roles && currentUser.roles.includes("ADMIN");
  const currentPath = window.location.pathname;

  // VISTA PARA USUARIOS NO AUTENTICADOS
  if (!currentUser) {
    return `
      <header class="border-b border-blue-100 bg-white/90 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-900/90">
        <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a class="text-xl font-black text-blue-900 dark:text-blue-400" href="/">TaskFlowSPA</a>
          <nav class="hidden gap-3 md:flex items-center">
            <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400" href="/login">Iniciar Sesión</a>
            <a class="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white dark:bg-blue-500" href="/register">Registrarse</a>
          </nav>
        </div>
      </header>
    `;
  }

  // VISTA PARA USUARIOS LOGUEADOS
  return `
    <header class="border-b border-blue-100 bg-white/90 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-900/90">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a class="text-xl font-black text-blue-900 dark:text-blue-400" href="/">TaskFlowSPA</a>
        <nav class="hidden gap-3 md:flex items-center">
          <a class="rounded-full px-4 py-2 text-sm font-semibold ${currentPath === "/dashboard" ? "bg-blue-600 text-white dark:bg-blue-500" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"}" href="/dashboard">Dashboard</a>
          <a class="rounded-full px-4 py-2 text-sm font-semibold ${currentPath === "/tasks" ? "bg-blue-600 text-white dark:bg-blue-500" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"}" href="/tasks">Tareas</a>
          <a class="rounded-full px-4 py-2 text-sm font-semibold ${currentPath === "/profile" ? "bg-blue-600 text-white dark:bg-blue-500" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"}" href="/profile">Perfil</a>
          
          ${isAdmin ? `<a class="rounded-full px-4 py-2 text-sm font-semibold ${currentPath === "/admin" ? "bg-blue-600 text-white dark:bg-blue-500" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"}" href="/admin">Admin</a>` : ''}
          
          <button id="btn-logout" class="rounded-full px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors">
            Logout
          </button>
        </nav>
      </div>
    </header>
  `;
}

export function setupNavbar() {
  // Configuración de enlaces
  const navLinks = document.querySelectorAll("header nav a");
  navLinks.forEach(link => {
    if (!link.dataset.listenerAttached) {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("/")) {
          e.preventDefault();
          window.history.pushState({}, "", href);
          renderRoute();
        }
      });
      link.dataset.listenerAttached = "true";
    }
  });

  // Configuración de Logout
  const logoutBtn = document.getElementById("btn-logout");
  if (logoutBtn && !logoutBtn.dataset.listenerAttached) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.clear();
      window.history.pushState({}, "", "/login");
      renderRoute();
    });
    logoutBtn.dataset.listenerAttached = "true";
  }
}