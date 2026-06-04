import { obtainUsers } from "./user.service";

// Valida las credenciales y guarda el usuario en el localStorage
export async function loginUser(email, password) {
    const users = await obtainUsers();
    const userFound = users.find(u => u.email === email && u.password === password);

    if (userFound) {
        localStorage.setItem("currentUser", JSON.stringify(userFound))
        return userFound;
    }
    
    return null;
}

// Borra la sesion del localStorage
export function logoutUser() {
    localStorage.removeItem("currentUser")
}