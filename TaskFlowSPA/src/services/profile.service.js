const API_URL = "http://localhost:3000/users";

// 1. Obtener los datos del usuario actual
export async function getUserProfile(id) {
    const response = await fetch(`${API_URL}/${id}`);
    return await response.json();
}

// 2. Actualizar los datos del perfil del usuario
export async function updateUserProfile(id, updatedData) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
    });
    return response.ok;
}