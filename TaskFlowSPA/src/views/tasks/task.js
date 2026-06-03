import { getTasks, deleteTask } from '../../services/task.service.js'
import { renderRoute } from '../../router/router.js'
import { renderNavbar, setupNavbar } from '../../components/organisms/Navbar.js'

export function renderTask() {
    return `    
    ${renderNavbar()}
    <main class="mx-auto max-w-6xl px-6 py-10">
      <section class="flex flex-col gap-4 rounded-4xl bg-blue-600 px-8 py-10 text-white md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">CRUD de tareas</p>
          <h1 class="mt-3 text-4xl font-black tracking-tight">Mis tareas</h1>
          <p class="mt-4 max-w-2xl text-blue-50">Vista principal para listar, editar y eliminar las tareas del usuario autenticado.</p>
        </div>
        <a class="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50" href="/task-form">
          Crear tarea
        </a>
      </section>

      <section id="tasks-list" class="mt-8 grid gap-4">
        </section>
    </main>`;
}

export async function setupTask() {
    setupNavbar();

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return; // Freno de mano: evita el error 'currentUser is null'

    const tasks = await getTasks();
    const userTasks = tasks.filter(t => t.userId === currentUser.id);

    const section = document.getElementById("tasks-list");
    if (!section) return;
    
    if (userTasks.length === 0) {
        section.innerHTML = `<p class="text-slate-500 text-center py-10">No tienes tareas aún. ¡Crea una!</p>`;
        return;
    }

    section.innerHTML = userTasks.map(task => `
        <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
            <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <p class="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">${task.status}</p>
                    <h2 class="mt-2 text-2xl font-bold text-slate-900">${task.title}</h2>
                    <p class="mt-3 max-w-2xl text-slate-600">${task.description}</p>
                    <p class="mt-2 text-xs text-slate-400">Fecha límite: ${task.date}</p>
                </div>
                <div class="flex gap-3">
                    <button data-id="${task.id}" class="edit-btn rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50">Editar</button>
                    <button data-id="${task.id}" class="delete-btn rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Eliminar</button>
                </div>
            </div>
        </article>
    `).join("");

    section.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            if (!confirm("¿Eliminar esta tarea?")) return;
            await deleteTask(btn.dataset.id);
            renderRoute();
        });
    });

    section.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const task = userTasks.find(t => t.id === btn.dataset.id);
            localStorage.setItem("editingTask", JSON.stringify(task));
            window.history.pushState({}, "", "/task-form");
            renderRoute();
        });
    });
}