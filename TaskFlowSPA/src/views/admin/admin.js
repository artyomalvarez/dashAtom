import { obtainUsers } from '../../services/user.service.js'
import { getTasks } from '../../services/task.service.js'
import { renderRoute } from '../../router/router.js'

export function renderAdmin() {
    return `<header class="border-b border-blue-100 bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a class="text-xl font-black text-blue-900" href="/">TaskFlowSPA</a>
        <nav class="hidden gap-3 md:flex">
          <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700" href="/dashboard">Dashboard</a>
          <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700" href="/tasks">Tareas</a>
          <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700" href="/profile">Perfil</a>
          <a class="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white" href="/admin">Admin</a>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-6 py-10">
      <section class="rounded-4xl bg-blue-600 px-8 py-10 text-white shadow-xl shadow-blue-100">
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">Rol administrador</p>
        <h1 class="mt-3 text-4xl font-black tracking-tight">Panel administrativo</h1>
        <p class="mt-4 max-w-2xl text-blue-50">Vista reservada para gestionar usuarios, roles, permisos y monitoreo general del sistema.</p>
      </section>

      <section class="mt-8 grid gap-6">
        <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-slate-900">Usuarios</h2>
            <span class="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">Mockup</span>
          </div>
          <div id="users-list" class="mt-5 space-y-4">
            <div class="rounded-2xl bg-blue-50 p-4">
              <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p class="font-bold text-slate-900">Ana Torres</p>
                  <p class="text-sm text-slate-500">ana@taskflow.com</p>
                </div>
                <div class="flex gap-2">
                  <span class="rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-700">USER</span>
                  <a class="rounded-full border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-white" href="/admin">Editar rol</a>
                </div>
              </div>
            </div>
            <div class="rounded-2xl bg-blue-50 p-4">
              <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p class="font-bold text-slate-900">Carlos Ruiz</p>
                  <p class="text-sm text-slate-500">carlos@taskflow.com</p>
                </div>
                <div class="flex gap-2">
                  <span class="rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-700">ADMIN</span>
                  <a class="rounded-full border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-white" href="/admin">Editar rol</a>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>
    </main>`
    
}

export async function setupAdmin() {
    const users = await obtainUsers()
    const tasks = await getTasks()
    const usersContainer = document.getElementById("users-list")

    const renderUsers = (userList) => {
        usersContainer.innerHTML = userList.map(user => `
            <div class="rounded-2xl bg-blue-50 p-4">
                <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p class="font-bold text-slate-900">${user.name ?? "Sin nombre"} ${user.lastname ?? ""}</p>
                        <p class="text-sm text-slate-500">${user.email}</p>
                    </div>
                    <div class="flex gap-2 flex-wrap">
                        <span class="rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-700">
                            ${user.roles[0]}
                        </span>
                        <button data-id="${user.id}" data-role="${user.roles[0]}" class="role-btn rounded-full border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-white">
                            Cambiar rol
                        </button>
                        <button data-id="${user.id}" data-name="${user.name ?? ""}" data-lastname="${user.lastname ?? ""}" class="edit-btn rounded-full border border-yellow-200 px-3 py-1 text-xs font-semibold text-yellow-700 hover:bg-yellow-50">
                            Editar
                        </button>
                        <button data-id="${user.id}" class="tasks-btn rounded-full border border-green-200 px-3 py-1 text-xs font-semibold text-green-700 hover:bg-green-50">
                            Ver tareas
                        </button>
                        <button data-id="${user.id}" class="delete-btn rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50">
                            Eliminar
                        </button>
                    </div>
                </div>
                <div id="tasks-${user.id}" class="hidden mt-3"></div>
            </div>
        `).join("")

        // cambiar rol
        usersContainer.querySelectorAll(".role-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                const newRole = btn.dataset.role === "ADMIN" ? "USER" : "ADMIN"
                await fetch(`http://localhost:3000/users/${btn.dataset.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ roles: [newRole] })
                })
                renderRoute()
            })
        })

        // eliminar usuario
        usersContainer.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                if (!confirm("¿Eliminar este usuario?")) return
                await fetch(`http://localhost:3000/users/${btn.dataset.id}`, {
                    method: "DELETE"
                })
                renderRoute()
            })
        })

        // editar nombre
        usersContainer.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                const newName = prompt("Nuevo nombre:", btn.dataset.name)
                const newLastname = prompt("Nuevo apellido:", btn.dataset.lastname)
                if (!newName || !newLastname) return
                await fetch(`http://localhost:3000/users/${btn.dataset.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: newName, lastname: newLastname })
                })
                renderRoute()
            })
        })

        // ver tareas del usuario
        usersContainer.querySelectorAll(".tasks-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const container = document.getElementById(`tasks-${btn.dataset.id}`)
                const userTasks = tasks.filter(t => t.userId === btn.dataset.id)

                if (container.classList.contains("hidden")) {
                    container.classList.remove("hidden")
                    if (userTasks.length === 0) {
                        container.innerHTML = `<p class="text-sm text-slate-400 mt-2">Sin tareas</p>`
                    } else {
                        // por esto
container.innerHTML = userTasks.map(t => `
    <div class="mt-2 rounded-xl bg-white p-3 text-sm flex items-center justify-between">
        <div>
            <p class="font-semibold text-slate-800">${t.title}</p>
            <p class="text-slate-500">${t.status} · ${t.date}</p>
        </div>
        <div class="flex gap-2">
            <button data-task-id="${t.id}" class="admin-edit-task rounded-full border border-yellow-200 px-3 py-1 text-xs font-semibold text-yellow-700 hover:bg-yellow-50">Editar</button>
            <button data-task-id="${t.id}" class="admin-delete-task rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50">Borrar</button>
        </div>
    </div>
`).join("")

// editar tarea desde admin
container.querySelectorAll(".admin-edit-task").forEach(btn => {
    btn.addEventListener("click", () => {
        const task = tasks.find(t => t.id === btn.dataset.taskId)
        localStorage.setItem("editingTask", JSON.stringify(task))
        window.history.pushState({}, "", "/task-form")
        renderRoute()
    })
})

// borrar tarea desde admin
container.querySelectorAll(".admin-delete-task").forEach(btn => {
    btn.addEventListener("click", async () => {
        if (!confirm("¿Borrar esta tarea?")) return
        await fetch(`http://localhost:3000/tasks/${btn.dataset.taskId}`, {
            method: "DELETE"
        })
        renderRoute()
    })
})
                    }
                } else {
                    container.classList.add("hidden")
                }
            })
        })
        
    }

    renderUsers(users)
}