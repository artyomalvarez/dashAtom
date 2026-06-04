import { renderNavbar, setupNavbar } from '../../components/organisms/Navbar.js';
import Swal from 'sweetalert2';

export function renderProfile() {
    return `
    ${renderNavbar()}
    <main class="mx-auto max-w-4xl px-6 py-10 transition-colors duration-300">
      <section class="rounded-4xl bg-blue-600 dark:bg-blue-900 px-8 py-10 text-white shadow-xl shadow-blue-100 dark:shadow-none transition-colors duration-300">
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100 dark:text-blue-200">Configuración</p>
        <h1 class="mt-3 text-4xl font-black tracking-tight">Tu Perfil</h1>
        <p class="mt-4 max-w-2xl text-blue-50 dark:text-blue-200">Gestiona tu información personal, correo electrónico y revisa tu rol dentro del sistema.</p>
      </section>

      <section class="mt-8 rounded-3xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-lg shadow-blue-50 dark:shadow-none transition-all">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-6">Datos Personales</h2>
        
        <form id="profile-form" class="grid gap-6 sm:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nombre</label>
            <input type="text" id="profile-name" class="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-5 py-3 text-slate-900 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 focus:outline-none transition-all" />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Apellido</label>
            <input type="text" id="profile-lastname" class="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-5 py-3 text-slate-900 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 focus:outline-none transition-all" />
          </div>

          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Correo Electrónico</label>
            <input type="email" id="profile-email" class="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-5 py-3 text-slate-900 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 focus:outline-none transition-all" />
          </div>

          <div class="sm:col-span-2 flex justify-end mt-4">
            <button type="submit" class="rounded-2xl bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition-colors">
              Guardar Cambios
            </button>
          </div>
        </form>
      </section>
    </main>
    `;
}

export function setupProfile() {
    setupNavbar();

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    const nameInput = document.getElementById("profile-name");
    const lastnameInput = document.getElementById("profile-lastname");
    const emailInput = document.getElementById("profile-email");

    if (nameInput) nameInput.value = currentUser.name || "";
    if (lastnameInput) lastnameInput.value = currentUser.lastname || currentUser.lastName || ""; 
    if (emailInput) emailInput.value = currentUser.email || "";

    const form = document.getElementById("profile-form");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const nuevoNombre = nameInput.value.trim();
            const nuevoApellido = lastnameInput.value.trim();
            const nuevoEmail = emailInput.value.trim();

            if (!nuevoNombre || !nuevoApellido || !nuevoEmail) {
                Swal.fire({
                    title: "Campos incompletos",
                    text: "No puedes dejar tus datos personales vacíos.",
                    icon: "warning",
                    confirmButtonColor: "#2563eb"
                });
                return;
            }

            currentUser.name = nuevoNombre;
            if (currentUser.lastname !== undefined) {
                currentUser.lastname = nuevoApellido;
            } else {
                currentUser.lastName = nuevoApellido;
            }
            currentUser.email = nuevoEmail;

            localStorage.setItem("currentUser", JSON.stringify(currentUser));
            
            Swal.fire({
                title: "¡Perfil Actualizado!",
                text: "Tus datos personales se han guardado con éxito.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });
        });
    }
}