// src/services/user.service.js
const API_URL = "http://localhost:3000/users";

// 1. Obtener todos los usuarios
export async function obtainUsers() {
    const response = await fetch(API_URL);
    return await response.json();
}

// 2. Cambiar el rol de un usuario
export async function changeUserRole(id, currentRole) {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roles: [newRole] })
    });
    return response.ok;
}

// 3. Eliminar un usuario
export async function deleteUserFromServer(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });
    return response.ok;
}

// 4. Editar nombre y apellido de un usuario
export async function editUserFromServer(id, name, lastname) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, lastname })
    });
    return response.ok;
}