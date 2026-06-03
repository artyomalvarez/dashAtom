import { renderRoute } from "../../router/router.js";

export function renderNavbar() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isAdmin = currentUser && currentUser.roles && currentUser.roles.includes("ADMIN");

  if (!currentUser) {
    return `
      <header class="border-b border-blue-100 bg-white/90 backdrop-blur">
        <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a class="text-xl font-black text-blue-900" href="/">TaskFlowSPA</a>
          <nav class="hidden gap-3 md:flex">
            <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700" href="/login">Iniciar Sesión</a>
            <a class="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white" href="/register">Registrarse</a>
          </nav>
        </div>
      </header>
    `;
  }

  const currentPath = window.location.pathname;

  return `
    <header class="border-b border-blue-100 bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a class="text-xl font-black text-blue-900" href="/">TaskFlowSPA</a>
        <nav class="hidden gap-3 md:flex items-center">
          <a class="rounded-full px-4 py-2 text-sm font-semibold ${currentPath === "/dashboard" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"}" href="/dashboard">Dashboard</a>
          <a class="rounded-full px-4 py-2 text-sm font-semibold ${currentPath === "/tasks" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"}" href="/tasks">Tareas</a>
          <a class="rounded-full px-4 py-2 text-sm font-semibold ${currentPath === "/profile" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"}" href="/profile">Perfil</a>
          
          ${isAdmin ? `<a class="rounded-full px-4 py-2 text-sm font-semibold ${currentPath === "/admin" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"}" href="/admin">Admin</a>` : ''}
          
          <button id="btn-logout" class="rounded-full px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
            Logout
          </button>
        </nav>
      </div>
    </header>
  `;
}

export function setupNavbar() {
  // 1. Lógica de los enlaces de navegación para que no recarguen la página
  const navLinks = document.querySelectorAll("header nav a");
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      
      // Si es una ruta interna, manejamos la navegación internamente
      if (href && href.startsWith("/")) {
        e.preventDefault();
        window.history.pushState({}, "", href);
        renderRoute(); // Ejecuta tu enrutador al instante
      }
    });
  });

  // 2. Tu lógica actual de Logout (que ya está perfecta)
  const logoutBtn = document.getElementById("btn-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.clear();
      window.history.pushState({}, "", "/login");
      renderRoute();
    });
  }
}
