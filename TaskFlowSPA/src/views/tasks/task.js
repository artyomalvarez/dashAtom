import { getTasks, deleteTask } from '../../services/task.service.js'
import { renderRoute } from '../../router/router.js'
import { renderNavbar, setupNavbar } from '../../components/organisms/Navbar.js'
import Swal from 'sweetalert2';

export function renderTask() {
    return `    
    ${renderNavbar()}
    <main class="mx-auto max-w-6xl px-6 py-10 min-h-screen transition-colors duration-300 dark:bg-slate-950">
      <section class="flex flex-col gap-4 rounded-4xl bg-blue-600 dark:bg-blue-900 px-8 py-10 text-white md:flex-row md:items-end md:justify-between shadow-xl shadow-blue-100 dark:shadow-none transition-colors duration-300">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100 dark:text-blue-200">CRUD de tareas</p>
          <h1 class="mt-3 text-4xl font-black tracking-tight">Mis tareas</h1>
        </div>
        <a class="inline-flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 px-5 py-3 text-sm font-bold text-blue-700 dark:text-white hover:bg-blue-50 dark:hover:bg-slate-800 transition-all" href="/task-form">
          Crear tarea
        </a>
      </section>

      <section class="mt-8 grid gap-4 sm:grid-cols-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-blue-50/80 dark:border-slate-800 shadow-md shadow-blue-50/30 dark:shadow-none">
        <div class="sm:col-span-2">
            <input id="search-task" type="text" placeholder="Buscar tarea por título o descripción..." class="w-full rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-400 focus:outline-none transition-all" />
        </div>
        <div>
            <select id="filter-status" class="w-full rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-blue-400 focus:outline-none transition-all">
                <option value="Todos">Todos los estados</option>
                <option value="Pendiente">Pendiente</option>
                <option value="En progreso">En progreso</option>
                <option value="Completada">Completada</option>
            </select>
        </div>
      </section>

      <section id="tasks-list" class="mt-6 grid gap-4"></section>
    </main>`;
}

export async function setupTask() {
    setupNavbar();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    const tasks = await getTasks();
    const userTasks = tasks.filter(t => t.userId === currentUser.id);
    const container = document.getElementById("tasks-list");
    const searchInput = document.getElementById("search-task");
    const statusSelect = document.getElementById("filter-status");

    if (!container) return;

    function pintarTarjetas(tareasAFiltrar) {
        if (tareasAFiltrar.length === 0) {
            container.innerHTML = `<p class="text-slate-400 dark:text-slate-500 text-center py-12 text-sm font-medium">No se encontraron tareas con los filtros aplicados.</p>`;
            return;
        }

        container.innerHTML = tareasAFiltrar.map(task => `
            <article class="rounded-3xl border border-blue-50 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-md shadow-blue-50/50 dark:shadow-none transition-all">
                <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <span class="inline-block px-2.5 py-1 text-[10px] font-black uppercase rounded-lg ${
                            task.status === 'Completada' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' :
                            task.status === 'En progreso' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                        }">${task.status}</span>
                        <h2 class="mt-3 text-xl font-bold text-slate-900 dark:text-white">${task.title}</h2>
                        <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">${task.description}</p>
                    </div>
                    <div class="flex gap-2 self-end md:self-start">
                        <button data-id="${task.id}" class="edit-btn rounded-xl border border-blue-100 dark:border-slate-700 px-4 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all">Editar</button>
                        <button data-id="${task.id}" class="delete-btn rounded-xl border border-red-100 dark:border-slate-700 px-4 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-800 transition-all">Eliminar</button>
                    </div>
                </div>
            </article>
        `).join("");

        container.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                Swal.fire({
                    title: "¿Eliminar esta tarea?",
                    text: "Esta acción quitará la tarea de tu lista permanentemente.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#ef4444",
                    cancelButtonColor: "#64748b",
                    confirmButtonText: "Sí, eliminar"
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        await deleteTask(btn.dataset.id);
                        Swal.fire({ title: "¡Eliminada!", icon: "success", timer: 1200, showConfirmButton: false });
                        setTimeout(() => renderRoute(), 1200);
                    }
                });
            });
        });

        container.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const task = userTasks.find(t => t.id === btn.dataset.id);
                localStorage.setItem("editingTask", JSON.stringify(task));
                window.history.pushState({}, "", "/task-form");
                renderRoute();
            });
        });
    }

    function ejecutarFiltros() {
        const textoBusqueda = searchInput.value.toLowerCase();
        const estadoSeleccionado = statusSelect.value;
        const tareasFiltradas = userTasks.filter(task => {
            const coincideTexto = task.title.toLowerCase().includes(textoBusqueda) || 
                                  task.description.toLowerCase().includes(textoBusqueda);
            const coincideEstado = estadoSeleccionado === "Todos" || task.status === estadoSeleccionado;
            return coincideTexto && coincideEstado;
        });
        pintarTarjetas(tareasFiltradas);
    }

    if (searchInput) searchInput.addEventListener("input", ejecutarFiltros);
    if (statusSelect) statusSelect.addEventListener("change", ejecutarFiltros);
    pintarTarjetas(userTasks);
}