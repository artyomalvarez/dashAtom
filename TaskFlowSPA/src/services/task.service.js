const url = "http://localhost:3000/tasks"

export async function getTasks() {
    const resposive = await fetch(url)
    if (!resposive.ok) throw new Error("Error al obtener tareas")
    return await resposive.json()
}

export async function createTask(taskData) {
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData)
    })
    if (!res.ok) throw new Error("Error al crear tarea")
    return await res.json()
}

export async function updateTask(id, taskData) {
    const res = await fetch(`${url}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData)
    })
    if (!res.ok) throw new Error("Error al actualizar tarea")
    return await res.json()
}

export async function deleteTask(id) {
    const res = await fetch(`${url}/${id}`, { method: "DELETE" })
    if (!res.ok) throw new Error("Error al eliminar tarea")
}