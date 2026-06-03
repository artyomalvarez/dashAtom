import { renderNavbar, setupNavbar } from '../../components/organisms/Navbar.js';

export function renderProfile() {
    return `
    ${renderNavbar()}
    <main class="mx-auto max-w-4xl px-6 py-10">
      <section class="rounded-4xl bg-blue-600 px-8 py-10 text-white shadow-xl shadow-blue-100">
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">Configuración</p>
        <h1 class="mt-3 text-4xl font-black tracking-tight">Tu Perfil</h1>
        <p class="mt-4 max-w-2xl text-blue-50">Gestiona tu información personal, correo electrónico y revisa tu rol dentro del sistema.</p>
      </section>

      <section class="mt-8 rounded-3xl border border-blue-100 bg-white p-8 shadow-lg shadow-blue-50">
        <h2 class="text-xl font-bold text-slate-900 mb-6">Datos Personales</h2>
        
        <form id="profile-form" class="grid gap-6 sm:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Nombre</label>
            <input type="text" id="profile-name" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none" />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Apellido</label>
            <input type="text" id="profile-lastname" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none" />
          </div>

          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-slate-700 mb-2">Correo Electrónico</label>
            <input type="email" id="profile-email" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none" />
          </div>

          <div class="sm:col-span-2 flex justify-end mt-4">
            <button type="submit" class="rounded-2xl bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
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

    // 1. Traemos el usuario que inició sesión
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return; // Control de seguridad

    // 2. Capturamos los inputs del formulario
    const nameInput = document.getElementById("profile-name");
    const lastnameInput = document.getElementById("profile-lastname");
    const emailInput = document.getElementById("profile-email");

    // 3. Inyectamos los datos reales en los campos vacíos
    if (nameInput) nameInput.value = currentUser.name || "";
    if (lastnameInput) lastnameInput.value = currentUser.lastName || ""; // Asegúrate si se llama lastName o apellido en tu objeto
    if (emailInput) emailInput.value = currentUser.email || "";

    // 4. Escuchamos el evento por si el usuario quiere actualizar sus datos
    const form = document.getElementById("profile-form");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Actualizamos el objeto local
            currentUser.name = nameInput.value;
            currentUser.lastName = lastnameInput.value;
            currentUser.email = emailInput.value;

            // Lo guardamos de vuelta en el localStorage
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
            alert("¡Perfil actualizado con éxito localmente!");
        });
    }
}