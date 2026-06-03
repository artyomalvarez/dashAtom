export function renderProfile() {
    return `    <header class="border-b border-blue-100 bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a class="text-xl font-black text-blue-900" href="/">TaskFlowSPA</a>
        <nav class="hidden gap-3 md:flex">
          <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700" href="/dashboard">Dashboard</a>
          <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700" href="/tasks">Tareas</a>
          <a class="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white" href="/profile">Perfil</a>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-5xl px-6 py-10">
      <section class="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <aside class="rounded-4xl bg-blue-600 p-8 text-white shadow-xl shadow-blue-100">
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">Cuenta</p>
          <h1 class="mt-3 text-4xl font-black tracking-tight">Mi perfil</h1>
          <p class="mt-4 text-blue-50">El usuario puede actualizar sus datos personales y gestionar su propia cuenta dentro del sistema.</p>
        </aside>

        <section class="rounded-4xl border border-blue-100 bg-white p-8 shadow-xl shadow-blue-50">
          <form id="profile-form" class="grid gap-5">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700" for="name">Nombre</label>
              <input id="name" type="text" value="Ana Torres" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none" />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700" for="profile-email">Correo</label>
              <input id="profile-email" type="email" value="ana@taskflow.com" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none" />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700" for="password-new">Nueva contrasena</label>
              <input id="password-new" type="password" placeholder="Actualiza tu contrasena" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none" />
            </div>
            <div class="flex flex-col gap-3 pt-2 sm:flex-row">
                  <button type="submit" class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500">
                    Guardar cambios
                  </button>
                  <button type="button" id="btn-delete-account" class="inline-flex items-center justify-center rounded-2xl border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50">
                    Eliminar mi cuenta
                  </button>
            </div>
          </form>
        </section>
      </section>
    </main>`
}

export async function setupProfile() {
    // 1. Conexión de cables con los inputs del HTML
    const formulario = document.getElementById("profile-form");
    const inputNombre = document.getElementById("name");
    const inputCorreo = document.getElementById("profile-email");
    const inputPassword = document.getElementById("password-new");
    const btnEliminar = document.getElementById("btn-delete-account");

    // 2. MOMENTO 1: Buscar quién es el usuario actual en el LocalStorage
    // Supongamos que al loguearte guardaste el objeto usuario bajo la clave "currentUser"
    const usuarioLogueado = JSON.parse(localStorage.getItem("currentUser"));

    if (!usuarioLogueado) {
        // Red de seguridad: si no hay nadie logueado, lo mandamos al login
        window.location.href = "/login";
        return;
    }

    // 3. Pintamos los datos reales del usuario en la pantalla
    inputNombre.value = usuarioLogueado.name;
    inputCorreo.value = usuarioLogueado.email;

    // 4. MOMENTO 2: Escuchar cuando el usuario envíe el formulario (SUBMIT)
    formulario.addEventListener("submit", async (e) => {
        e.preventDefault(); // 🛑 Freno de mano para que no se recargue la página

        // Armamos el objeto con los cambios que digitó el usuario
        const datosActualizados = {
            name: inputNombre.value.trim(),
            email: inputCorreo.value.trim()
        };

        // Si el usuario escribió algo en la contraseña, también la mandamos
        if (inputPassword.value.trim() !== "") {
            datosActualizados.password = inputPassword.value.trim();
        }

        try {
            // Hacemos la petición PATCH al servidor apuntando al ID de este usuario específico
            const response = await fetch(`http://localhost:3000/users/${usuarioLogueado.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datosActualizados)
            });

            if (response.ok) {
                const usuarioServidor = await response.json();
                
                // ¡Sincronización! Actualizamos el LocalStorage para que la app sepa el nuevo nombre
                localStorage.setItem("currentUser", JSON.stringify(usuarioServidor));
                
                alert("¡Perfil actualizado con éxito!");
            } else {
                alert("Error al actualizar el perfil en el servidor");
            }
        } catch (error) {
            console.error("Error de red:", error);
        }
    });

    // 5. EXTRA: Lógica para Eliminar la cuenta (DELETE)
    btnEliminar.addEventListener("click", async () => {
        const confirmar = confirm("¿Estás completamente seguro de eliminar tu cuenta? Esta acción no se puede deshacer.");
        if (!confirmar) return;

        try {
            const response = await fetch(`http://localhost:3000/users/${usuarioLogueado.id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                // Borramos el rastro del LocalStorage y lo echamos al login
                localStorage.removeItem("currentUser");
                window.location.href = "/login";
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    });
}