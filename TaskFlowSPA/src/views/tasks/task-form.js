import { createTask, updateTask } from '../../services/task.service.js'
import { renderRoute } from '../../router/router.js'
import { renderNavbar, setupNavbar } from '../../components/organisms/Navbar.js'

export function renderTaskForm() {
    return `
    ${renderNavbar()}
    <main class="mx-auto max-w-5xl px-6 py-10">
      <section class="rounded-4xl border border-blue-100 bg-white p-8 shadow-xl shadow-blue-50">
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Formulario</p>
        <h1 class="mt-3 text-4xl font-black tracking-tight text-slate-900">Crear o editar tarea</h1>
        <p class="mt-4 max-w-2xl text-slate-600">Vista base para registrar una tarea nueva o actualizar una existente.</p>

        <form id="task-form" class="mt-8 grid gap-5">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700" for="title">Titulo</label>
            <input id="title" type="text" placeholder="Ej. Preparar proyecto final" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none" />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700" for="description">Descripcion</label>
            <textarea id="description" rows="5" placeholder="Describe la tarea..." class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"></textarea>
          </div>

          <div class="grid gap-5 md:grid-cols-2">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700" for="status">Estado</label>
              <select id="status" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none">
                <option>Pendiente</option>
                <option>En progreso</option>
                <option>Completada</option>
              </select>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700" for="date">Fecha limite</label>
              <input id="date" type="date" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none" />
            </div>
          </div>

          <div class="flex flex-col gap-3 pt-2 sm:flex-row">
            <button type="submit" id="task-submit" class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500">Guardar tarea</button>
            <button type="button" id="task-cancel" class="inline-flex items-center justify-center rounded-2xl border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50">Cancelar</button>
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

    // Manejo del boton Cancelar para limpiar el estado y regresar a la vista correcta
    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            localStorage.removeItem("editingTask");
            localStorage.removeItem("assignToUserId");
            
            // Si el admin estaba asignando o editando desde su panel, regresa al admin
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

        if (!title || !description || !date) {
            alert("Todos los campos son obligatorios");
            submitBtn.disabled = false;
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) return;

        // Determinacion dinamica del propietario de la tarea
        let finalUserId;
        if (editingTask) {
            // Si se edita, se mantiene el dueño original de la tarea
            finalUserId = editingTask.userId;
        } else if (adminAssignId) {
            // Si el admin crea una tarea para otro usuario
            finalUserId = adminAssignId;
        } else {
            // Si un usuario comun crea su propia tarea
            finalUserId = currentUser.id;
        }

        const taskData = {
            title,
            description,
            status,
            date,
            userId: finalUserId
        };

        try {
            if (editingTask) {
                await updateTask(editingTask.id, taskData);
            } else {
                await createTask(taskData);
            }
            
            // Limpieza de datos temporales en localStorage
            localStorage.removeItem("editingTask");
            localStorage.removeItem("assignToUserId");

            // Redireccion inteligente tras guardar con exito
            if (adminAssignId || (editingTask && currentUser.roles?.includes("ADMIN") && editingTask.userId !== currentUser.id)) {
                window.history.pushState({}, "", "/admin");
            } else {
                window.history.pushState({}, "", "/tasks");
            }
            
            renderRoute();
        } catch (error) {
            console.error("Error al guardar tarea:", error);
            submitBtn.disabled = false;
        }
    });
}