import { createTask, updateTask } from '../../services/task.service.js'
import { renderRoute } from '../../router/router.js'
import { renderNavbar, setupNavbar } from '../../components/organisms/Navbar.js'
import Swal from 'sweetalert2';

export function renderTaskForm() {
    return `
    ${renderNavbar()}
    <main class="mx-auto max-w-5xl px-6 py-10 transition-colors duration-300">
      <section class="rounded-4xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl shadow-blue-50 dark:shadow-none transition-all">
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">Formulario</p>
        <h1 class="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">Crear o editar tarea</h1>
        <p class="mt-4 max-w-2xl text-slate-600 dark:text-slate-400">Vista base para registrar una tarea nueva o actualizar una existente.</p>

        <form id="task-form" class="mt-8 grid gap-5">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="title">Titulo</label>
            <input id="title" type="text" placeholder="Ej. Preparar proyecto final" class="w-full rounded-2xl border border-blue-100 dark:border-slate-700 bg-blue-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-400 focus:outline-none" />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="description">Descripcion</label>
            <textarea id="description" rows="5" placeholder="Describe la tarea..." class="w-full rounded-2xl border border-blue-100 dark:border-slate-700 bg-blue-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"></textarea>
          </div>

          <div class="grid gap-5 md:grid-cols-2">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="status">Estado</label>
              <select id="status" class="w-full rounded-2xl border border-blue-100 dark:border-slate-700 bg-blue-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-blue-400 focus:outline-none">
                <option>Pendiente</option>
                <option>En progreso</option>
                <option>Completada</option>
              </select>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="date">Fecha limite</label>
              <input id="date" type="date" class="w-full rounded-2xl border border-blue-100 dark:border-slate-700 bg-blue-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-blue-400 focus:outline-none" />
            </div>
          </div>

          <div class="flex flex-col gap-3 pt-2 sm:flex-row">
            <button type="submit" id="task-submit" class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500 transition-all">Guardar tarea</button>
            <button type="button" id="task-cancel" class="inline-flex items-center justify-center rounded-2xl border border-blue-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-3 text-sm font-bold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all">Cancelar</button>
          </div>
        </form>
      </section>
    </main>`;
}

export function setupTaskForm() {
    setupNavbar();

    const form = document.getElementById("task-form");
    const submitBtn = document.getElementById("task-submit");
    const cancelBtn = document.getElementById("task-cancel");
    if (!form) return;

    const editingTask = JSON.parse(localStorage.getItem("editingTask") || "null");
    const adminAssignId = localStorage.getItem("assignToUserId");
    if (editingTask) {
        document.getElementById("title").value = editingTask.title;
        document.getElementById("description").value = editingTask.description;
        document.getElementById("status").value = editingTask.status;
        document.getElementById("date").value = editingTask.date;
    }

    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            localStorage.removeItem("editingTask");
            localStorage.removeItem("assignToUserId");
            
            if (adminAssignId || (editingTask && editingTask.userId !== JSON.parse(localStorage.getItem("currentUser"))?.id)) {
                window.history.pushState({}, "", "/admin");
            } else {
                window.history.pushState({}, "", "/tasks");
            }
            renderRoute();
        });
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;

        const title = document.getElementById("title").value.trim();
        const description = document.getElementById("description").value.trim();
        const status = document.getElementById("status").value;
        const date = document.getElementById("date").value;

        // SWEETALERT PARA CAMPOS VACÍOS
        if (!title || !description || !date) {
            Swal.fire({
                title: "Campos incompletos",
                text: "Todos los campos son obligatorios para la tarea.",
                icon: "warning",
                confirmButtonColor: "#2563eb"
            });
            submitBtn.disabled = false;
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) return;

        let finalUserId;
        if (editingTask) {
            finalUserId = editingTask.userId;
        } else if (adminAssignId) {
            finalUserId = adminAssignId;
        } else {
            finalUserId = currentUser.id;
        }

        const taskData = { title, description, status, date, userId: finalUserId };

        try {
            if (editingTask) {
                await updateTask(editingTask.id, taskData);
            } else {
                await createTask(taskData);
            }
            
            // SWEETALERT DE ÉXITO VISUAL
            Swal.fire({
                title: editingTask ? "¡Tarea Actualizada!" : "¡Tarea Guardada!",
                text: editingTask ? "Los cambios han sido guardados." : "La tarea se creó exitosamente.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });

            // Retardo para dejar ver la animación antes de redirigir
            setTimeout(() => {
                localStorage.removeItem("editingTask");
                localStorage.removeItem("assignToUserId");

                if (adminAssignId || (editingTask && currentUser.roles?.includes("ADMIN") && editingTask.userId !== currentUser.id)) {
                    window.history.pushState({}, "", "/admin");
                } else {
                    window.history.pushState({}, "", "/tasks");
                }
                renderRoute();
            }, 1500);

        } catch (error) {
            console.error("Error al guardar tarea:", error);
            Swal.fire({
                title: "Error de Servidor",
                text: "No se pudo procesar la tarea.",
                icon: "error",
                confirmButtonColor: "#ef4444"
            });
            submitBtn.disabled = false;
        }
    });
}