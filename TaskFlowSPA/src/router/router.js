import { notfound, routes } from "./routes";
import { toggleTheme } from "../utils/theme.js"; // Importa tu función
// 1. IMPORTAMOS SWEETALERT2 AQUÍ
import Swal from 'sweetalert2';

function obtenerSesion() {
    // Unificado a currentUser
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
}

export function renderRoute() {
    const app = document.getElementById("app");
    if (!app) return;

    const currentPath = window.location.pathname;
    console.log(currentPath);
    
    const route = routes[currentPath];
    console.log(route);

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

    // 2. GUARD DE AUTENTICACIÓN ACTUALIZADO
    if (route.isAutorized && !sesionActiva) {
        Swal.fire({
            title: "Acceso denegado",
            text: "No se detectó ninguna sesión activa. Por favor inicia sesión.",
            icon: "warning",
            confirmButtonColor: "#2563eb"
        }).then(() => {
            window.history.replaceState({}, "", "/login");
            renderRoute();
        });
        return;
    }

    // 3. GUARD DE ADMINISTRADOR ACTUALIZADO
    if (currentPath === "/admin") {
        const esAdmin = sesionActiva && (sesionActiva.role === "ADMIN" || (sesionActiva.roles && sesionActiva.roles.includes("ADMIN")));
        
        if (!esAdmin) {
            Swal.fire({
                title: "Sin autorización",
                text: "No tienes los permisos necesarios para acceder al panel de administración.",
                icon: "error",
                confirmButtonColor: "#ef4444"
            }).then(() => {
                window.history.replaceState({}, "", "/dashboard");
                renderRoute();
            });
            return;
        }
    }

    // Inyectamos el HTML de la vista en el contenedor raíz adaptado
    app.innerHTML = route.render();

    if (route.setup) {
        route.setup();
    }
}

export function initRouter() {
    // ... (Tu código existente de eventos de clics y popstate)

    // ============================================================
    // BOTÓN DE MODO OSCURO GLOBAL
    // ============================================================
    let darkBtn = document.getElementById("btn-dark-toggle");
    
    if (!darkBtn) {
        darkBtn = document.createElement("button");
        darkBtn.id = "btn-dark-toggle";
        darkBtn.className = "fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl hover:scale-110 active:scale-95 transition-all dark:bg-white dark:text-slate-900 border border-slate-200 text-lg cursor-pointer";
        document.body.appendChild(darkBtn);

        // AQUÍ ESTÁ LA REACCIÓN: Al hacer clic, llamamos a tu función externa
        darkBtn.addEventListener("click", () => {
            toggleTheme(); // Cambia el tema (clase 'dark' y localStorage)
            updateButtonIcon(darkBtn); // Sincroniza el icono al momento
        });
    }

    // Sincronización inicial al cargar cualquier ruta
    updateButtonIcon(darkBtn);
}

// Función auxiliar para mantener el código DRY (Don't Repeat Yourself)
function updateButtonIcon(btn) {
    const isDark = document.documentElement.classList.contains('dark');
    btn.innerHTML = isDark ? "☀️" : "🌙";
}