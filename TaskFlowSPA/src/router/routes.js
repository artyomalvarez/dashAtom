// 1. Importaciones de las vistas
// Agregamos setupHome para que funcione el Navbar en el Home
import { renderHome, setupHome } from "../views/home"; 
import { renderRegister, setupRegister } from "../views/auth/resgister"; // Corregido 'renderRegister'
import { renderLogin, setupLogin } from "../views/auth/login";
import { renderAdmin, setupAdmin } from "../views/admin/admin";
import { renderNotFound } from "../views/not-found";
import { renderDashboard, setupDashboard } from "../views/app/dashboard";
import { renderProfile, setupProfile } from "../views/admin/profile";
import { renderTaskForm, setupTaskForm } from "../views/tasks/task-form";
import { renderTask, setupTask } from "../views/tasks/task";

export const routes = {
    "/": {
        render: renderHome,
        setup: setupHome, // ¡Listo! Ahora el Navbar cobrará vida en el Home
        isAutorized: false,
    },
    "/login": {
        render: renderLogin,
        setup: setupLogin,
        isAutorized: false,
    },
    "/register": {
        render: renderRegister, // Corregido con su 'n'
        setup: setupRegister,
        isAutorized: false,
    },
    "/admin": {
        render: renderAdmin,
        setup: setupAdmin,
        isAutorized: true,
    },
    "/dashboard": {
        render: renderDashboard,
        setup: setupDashboard,
        isAutorized: true,
    },
    "/profile": {
        render: renderProfile,
        setup: setupProfile,
        isAutorized: true,
    },
    "/tasks": {
        render: renderTask,
        setup: setupTask,
        isAutorized: true,
    },
    "/task-form": {
        render: renderTaskForm,
        setup: setupTaskForm,
        isAutorized: true,
    },
}

export const notfound = renderNotFound();