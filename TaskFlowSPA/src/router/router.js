import { notfound, routes } from "./routes";

function obtenerSesion() {
    // Unificado a currentUser
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
}

export function renderRoute() {
    const app = document.getElementById("app");
    if (!app) return;

    const currentPath = window.location.pathname;
    const route = routes[currentPath];

    if (!route) {
        app.innerHTML = notfound;
        return;
    }

    const sesionActiva = obtenerSesion();

    if (!route.isAutorized && sesionActiva && (currentPath === "/login" || currentPath === "/register" || currentPath === "/")) {
        window.history.replaceState({}, "", "/dashboard");
        renderRoute();
        return;
    }

    if (route.isAutorized && !sesionActiva) {
        alert("Acceso denegado. No se detectó ninguna sesión activa.");
        window.history.replaceState({}, "", "/login");
        renderRoute();
        return;
    }

    if (currentPath === "/admin") {
        const esAdmin = sesionActiva && (sesionActiva.role === "ADMIN" || (sesionActiva.roles && sesionActiva.roles.includes("ADMIN")));
        
        if (!esAdmin) {
            alert("No tienes los permisos necesarios para acceder al panel de administración.");
            window.history.replaceState({}, "", "/dashboard");
            renderRoute();
            return;
        }
    }

    app.innerHTML = route.render();

    if (route.setup) {
        route.setup();
    }
}

export function initRouter() {
    document.addEventListener("click", (event) => {
        const link = event.target.closest("a");
        if (!link) return;
        
        const href = link.getAttribute("href");
        if (!href || !href.startsWith("/")) return;

        event.preventDefault();
        window.history.pushState({}, "", href);
        renderRoute();
    });

    window.addEventListener("popstate", () => {
        renderRoute();
    });
}
