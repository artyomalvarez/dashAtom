import { obtainUsers, changeUserRole, deleteUserFromServer, editUserFromServer } from '../../services/admin.service.js'
import { getTasks } from '../../services/task.service.js'
import { renderRoute } from '../../router/router.js'
import Swal from 'sweetalert2';

export function renderAdmin() {
    return `<header class="border-b border-blue-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur transition-colors duration-300">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a class="text-xl font-black text-blue-900 dark:text-blue-400" href="/">TaskFlowSPA</a>
        <nav class="hidden gap-3 md:flex items-center">
          <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400 transition-colors" href="/dashboard">Dashboard</a>
          <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400 transition-colors" href="/tasks">Tareas</a>
          <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400 transition-colors" href="/profile">Perfil</a>
          <a class="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white" href="/admin">Admin</a>
          
          <button id="btn-logout-admin" class="rounded-full px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
            Logout
          </button>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-6 py-10 transition-colors duration-300">
      <section class="rounded-4xl bg-blue-600 dark:bg-blue-900 px-8 py-10 text-white shadow-xl shadow-blue-100 dark:shadow-none transition-colors duration-300">
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100 dark:text-blue-200">Rol administrador</p>
        <h1 class="mt-3 text-4xl font-black tracking-tight">Panel administrativo</h1>
        <p class="mt-4 max-w-2xl text-blue-50 dark:text-blue-200">Vista reservada para gestionar usuarios, roles, permisos y monitoreo general del sistema.</p>
      </section>

      <section class="mt-8 grid gap-6">
        <article class="rounded-3xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-lg shadow-blue-50 dark:shadow-none transition-all">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Usuarios</h2>
            <span class="rounded-full bg-blue-100 dark:bg-blue-950/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-blue-700 dark:text-blue-400">Panel Real</span>
          </div>
          <div id="users-list" class="mt-5 space-y-4"></div>
        </article>
      </section>
    </main>`
}

// ==========================================
// 1. CONTROLADOR PRINCIPAL
// ==========================================
export async function setupAdmin() {
    // Inicializar el botón de logout de inmediato
    setupLogout();

    const usersContainer = document.getElementById("users-list");
    if (!usersContainer) return;

    // Carga de datos del servidor
    const users = await obtainUsers();
    const tasks = await getTasks();

    // Renderizar la interfaz inicial
    renderUsersList(users, usersContainer);

    // Asignar los eventos principales a las tarjetas de usuarios
    bindUserEvents(usersContainer, tasks);
}

// ==========================================
// 2. CAPA DE RENDERIZADO (HTML TEMPLATES)
// ==========================================

// Renderiza la lista principal de usuarios
// Lógica de renderizado (Asegurando clases oscuras en elementos dinámicos)
function renderUsersList(userList, container) {
    container.innerHTML = userList.map(user => `
        <div class="rounded-2xl bg-blue-50 dark:bg-slate-800 p-4 shadow-sm border border-blue-100/50 dark:border-slate-700 transition-colors">
            <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <p class="font-bold text-slate-900 dark:text-white">${user.name ?? "Sin nombre"} ${user.lastname ?? ""}</p>
                    <p class="text-sm text-slate-500 dark:text-slate-400">${user.email}</p>
                </div>
                <div class="flex gap-2 flex-wrap">
                    <span class="rounded-full bg-white dark:bg-slate-900 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-400 shadow-sm border dark:border-slate-700">
                        ${user.roles && user.roles[0] ? user.roles[0] : "USER"}
                    </span>
                    <button data-id="${user.id}" data-role="${user.roles && user.roles[0] ? user.roles[0] : "USER"}" class="role-btn rounded-full border border-blue-200 dark:border-slate-700 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:bg-white dark:hover:bg-slate-900 transition-colors">
                        Cambiar rol
                    </button>
                    <button data-id="${user.id}" data-name="${user.name ?? ""}" data-lastname="${user.lastname ?? ""}" class="edit-btn rounded-full border border-yellow-200 dark:border-slate-700 px-3 py-1 text-xs font-semibold text-yellow-700 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-950 transition-colors">
                        Editar
                    </button>
                    <button data-id="${user.id}" class="tasks-btn rounded-full border border-green-200 dark:border-slate-700 px-3 py-1 text-xs font-semibold text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950 transition-colors">
                        Ver tareas
                    </button>
                    <button data-id="${user.id}" class="delete-btn rounded-full border border-red-200 dark:border-slate-700 px-3 py-1 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
                        Eliminar
                    </button>
                </div>
            </div>
            <div id="tasks-${user.id}" class="hidden mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700"></div>
        </div>
    `).join("");
}

// Renderiza el contenido interno de las tareas de un usuario específico
function renderUserTasks(userId, userTasks, container) {
    if (userTasks.length === 0) {
        container.innerHTML = `
            <div class="mt-2 flex items-center justify-between pl-2 bg-white dark:bg-slate-900 rounded-xl p-3 shadow-sm border border-slate-100 dark:border-slate-700">
                <p class="text-sm text-slate-400">Este usuario no tiene tareas asignadas.</p>
                <button data-id="${userId}" class="add-task-btn rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white hover:bg-blue-700 transition-colors">
                    + Añadir tarea
                </button>
            </div>`;
    } else {
        container.innerHTML = `
            <div class="mt-2 flex justify-end mb-2">
                <button data-id="${userId}" class="add-task-btn rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white hover:bg-blue-700 transition-colors">
                    + Añadir tarea
                </button>
            </div>
            <div class="flex flex-col gap-2">
                ${userTasks.map(t => `
                    <div class="rounded-xl bg-white dark:bg-slate-900 p-3 text-sm flex items-center justify-between shadow-sm border border-slate-100 dark:border-slate-700">
                        <div>
                            <p class="font-semibold text-slate-800 dark:text-white">${t.title}</p>
                            <p class="text-xs text-slate-500 dark:text-slate-400">${t.status} · ${t.date ?? "Sin fecha"}</p>
                        </div>
                        <div class="flex gap-2">
                            <button data-task-id="${t.id}" class="admin-edit-task rounded-full border border-yellow-200 dark:border-slate-700 px-3 py-1 text-xs font-semibold text-yellow-700 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-950 transition-colors">Editar</button>
                            <button data-task-id="${t.id}" class="admin-delete-task rounded-full border border-red-200 dark:border-slate-700 px-3 py-1 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">Borrar</button>
                        </div>
                    </div>
                `).join("")}
            </div>`;
    }
}

// ==========================================
// 3. CAPA DE MANEJO DE EVENTOS (ACCIONES Y SWEETALERT)
// ==========================================

// Configura el botón de deslogueo externo
function setupLogout() {
    const logoutBtn = document.getElementById("btn-logout-admin");
    if (!logoutBtn) return;
    
    // Evita duplicar escuchadores removiendo el anterior si existiera
    logoutBtn.onclick = (e) => {
        e.preventDefault();
        localStorage.clear(); 
        window.history.pushState({}, "", "/login"); 
        renderRoute(); 
    };
}

// Conecta los eventos de los botones de cada usuario
function bindUserEvents(usersContainer, tasks) {
    // Cambio de Rol
    usersContainer.querySelectorAll(".role-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            const ok = await changeUserRole(btn.dataset.id, btn.dataset.role);
            if (ok) {
                Swal.fire({
                    title: "Rol Actualizado",
                    text: "El rol del usuario ha sido modificado.",
                    icon: "success",
                    timer: 1200,
                    showConfirmButton: false
                });
                setTimeout(() => renderRoute(), 1200);
            }
        });
    });

    // Eliminar Usuario
    usersContainer.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            Swal.fire({
                title: "¿Eliminar este usuario?",
                text: "Esta acción borrará al usuario permanentemente del sistema.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#ef4444",
                cancelButtonColor: "#64748b",
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const ok = await deleteUserFromServer(btn.dataset.id);
                    if (ok) {
                        Swal.fire({
                            title: "¡Eliminado!",
                            text: "El usuario ha sido removido.",
                            icon: "success",
                            timer: 1200,
                            showConfirmButton: false
                        });
                        setTimeout(() => renderRoute(), 1200);
                    }
                }
            });
        });
    });

    // Editar Datos de Usuario
    usersContainer.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            Swal.fire({
                title: "Editar Perfil de Usuario",
                html: `
                    <div class="text-left px-2">
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre</label>
                        <input id="swal-name" class="w-full mb-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-slate-900 focus:outline-none focus:border-blue-400" value="${btn.dataset.name}">
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Apellido</label>
                        <input id="swal-lastname" class="w-full rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-slate-900 focus:outline-none focus:border-blue-400" value="${btn.dataset.lastname}">
                    </div>
                `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonColor: "#2563eb",
                cancelButtonColor: "#64748b",
                confirmButtonText: "Guardar Cambios",
                cancelButtonText: "Cancelar",
                preConfirm: () => {
                    const name = document.getElementById('swal-name').value.trim();
                    const lastname = document.getElementById('swal-lastname').value.trim();
                    if (!name || !lastname) {
                        Swal.showValidationMessage('Todos los campos son obligatorios');
                        return false;
                    }
                    return { name, lastname };
                }
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const ok = await editUserFromServer(btn.dataset.id, result.value.name, result.value.lastname);
                    if (ok) {
                        Swal.fire({
                            title: "¡Actualizado!",
                            text: "Datos modificados con éxito.",
                            icon: "success",
                            timer: 1200,
                            showConfirmButton: false
                        });
                        setTimeout(() => renderRoute(), 1200);
                    }
                }
            });
        });
    });

    // Desplegar/Ocultar Tareas
    usersContainer.querySelectorAll(".tasks-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const userId = btn.dataset.id;
            const taskContainer = document.getElementById(`tasks-${userId}`);
            
            if (!taskContainer) return;

            if (taskContainer.classList.contains("hidden")) {
                taskContainer.classList.remove("hidden");
                const userTasks = tasks.filter(t => t.userId === userId);
                
                // Renderizar las tareas dentro del contenedor expandido
                renderUserTasks(userId, userTasks, taskContainer);
                
                // Escuchar los eventos de los nuevos botones de tareas inyectados
                bindTaskEvents(taskContainer, tasks);
            } else {
                taskContainer.classList.add("hidden");
            }
        });
    });
}

// Conecta los eventos de los botones internos de la sección de tareas
function bindTaskEvents(taskContainer, tasks) {
    // Editar Tarea
    taskContainer.querySelectorAll(".admin-edit-task").forEach(taskBtn => {
        taskBtn.addEventListener("click", () => {
            const task = tasks.find(t => t.id === taskBtn.dataset.taskId);
            localStorage.setItem("editingTask", JSON.stringify(task));
            window.history.pushState({}, "", "/task-form");
            renderRoute();
        });
    });

    // Eliminar Tarea
    taskContainer.querySelectorAll(".admin-delete-task").forEach(taskBtn => {
        taskBtn.addEventListener("click", () => {
            Swal.fire({
                title: "¿Borrar esta tarea?",
                text: "Esta acción no se puede deshacer.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#ef4444",
                cancelButtonColor: "#64748b",
                confirmButtonText: "Sí, borrar",
                cancelButtonText: "Cancelar"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await fetch(`http://localhost:3000/tasks/${taskBtn.dataset.taskId}`, {
                        method: "DELETE"
                    });
                    Swal.fire({
                        title: "¡Borrada!",
                        text: "La tarea ha sido eliminada.",
                        icon: "success",
                        timer: 1200,
                        showConfirmButton: false
                    });
                    setTimeout(() => renderRoute(), 1200);
                }
            });
        });
    });

    // Añadir Nueva Tarea
    const addTaskBtn = taskContainer.querySelector(".add-task-btn");
    if (addTaskBtn) {
        addTaskBtn.addEventListener("click", () => {
            localStorage.removeItem("editingTask"); 
            localStorage.setItem("assignToUserId", addTaskBtn.dataset.id); 
            window.history.pushState({}, "", "/task-form"); 
            renderRoute();
        });
    }
}