import { buttonSubmit } from "../../components/atoms/registerButton.js"
import { createUser, obtainUsers } from '../../services/user.service.js'
import { renderRoute } from '../../router/router.js'
import Swal from 'sweetalert2';

export function renderRegister(params) {
  return `    
    <main class="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr] transition-colors duration-300">
      
      <section class="hidden border-r border-blue-100 dark:border-slate-800 bg-blue-600 dark:bg-blue-950 p-10 text-white lg:flex lg:flex-col lg:justify-between transition-colors duration-300">
        <a class="text-xl font-black tracking-tight" href="/">TaskFlowSPA</a>
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100 dark:text-blue-300">Nuevo usuario</p>
          <h1 class="mt-4 text-5xl font-black tracking-tight">Crea tu cuenta y empieza a organizar tu flujo.</h1>
          <p class="mt-5 max-w-md text-lg leading-8 text-blue-50 dark:text-blue-200">
            Esta vista permite enseñar el registro como parte del alcance functional antes de llevarlo al flujo SPA definitivo.
          </p>
        </div>
        <p class="text-sm text-blue-100 dark:text-blue-300">Interfaz base del modulo de autenticacion.</p>
      </section>

      <section class="flex items-center justify-center px-6 py-10 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div class="w-full max-w-xl rounded-4xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl shadow-blue-100/70 dark:shadow-none transition-all">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">Registro</p>
              <h2 class="mt-2 text-3xl font-black text-slate-900 dark:text-white">Crear cuenta</h2>
            </div>
            <a class="rounded-full border border-blue-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-800" href="/login">Ya tengo cuenta</a>
          </div>

          <form id="form-d" class="mt-8 grid gap-5">
            <div class="grid gap-5 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="register-name">Nombre</label>
                <input id="register-name" type="text" placeholder="Ana" class="w-full rounded-2xl border border-blue-100 dark:border-slate-700 bg-blue-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-400 focus:outline-none" />
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="register-lastname">Apellido</label>
                <input id="register-lastname" type="text" placeholder="Torres" class="w-full rounded-2xl border border-blue-100 dark:border-slate-700 bg-blue-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-400 focus:outline-none" />
              </div>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="register-email">Correo</label>
              <input id="register-email" type="email" placeholder="usuario@taskflow.com" class="w-full rounded-2xl border border-blue-100 dark:border-slate-700 bg-blue-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-400 focus:outline-none" />
            </div>

            <div class="grid gap-5 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="register-password">Contrasena</label>
                <input id="register-password" type="password" placeholder="Crea una contrasena" class="w-full rounded-2xl border border-blue-100 dark:border-slate-700 bg-blue-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-400 focus:outline-none" />
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="register-role">Rol</label>
                <select id="register-role" class="w-full rounded-2xl border border-blue-100 dark:border-slate-700 bg-blue-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-blue-400 focus:outline-none">
                  <option>USER</option>
                  <option>ADMIN</option>
                </select>
              </div>
            </div>
            ${buttonSubmit("Crear cuenta")}
          </form>
        </div>
      </section>
    </main>
  `
}

export function setupRegister() {
  const registerForm = document.getElementById("form-d")
  const nombreInput = document.getElementById("register-name")
  const apellidoInput = document.getElementById("register-lastname")
  const emailInput = document.getElementById("register-email")
  const passwordInput = document.getElementById("register-password")
  const roleSelect = document.getElementById("register-role")

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const submitBtn = registerForm.querySelector("button[type='submit']")
    submitBtn.disabled = true

    const nombre = nombreInput.value.trim()
    const apellido = apellidoInput.value.trim()
    const email = emailInput.value.trim()
    const password = passwordInput.value.trim()

    // 2. SWEETALERT PARA CAMPOS VACÍOS
    if (!nombre || !apellido || !email || !password) {
      Swal.fire({
        title: "Campos incompletos",
        text: "Todos los campos son obligatorios",
        icon: "warning",
        confirmButtonColor: "#2563eb"
      });
      submitBtn.disabled = false
      return
    }

    try {
      const users = await obtainUsers()
      const emailExists = users.some(u => u.email === email)

      // 3. SWEETALERT PARA EMAIL DUPLICADO
      if (emailExists) {
        Swal.fire({
          title: "Email ya registrado",
          text: "Este correo electrónico ya está en uso",
          icon: "error",
          confirmButtonColor: "#ef4444"
        });
        submitBtn.disabled = false
        return
      }

      const newUser = {
        name: nombre,
        lastname: apellido,
        email: email,
        password: password,
        roles: [roleSelect.value]
      }

      await createUser(newUser)

      // 4. SWEETALERT PARA USUARIO CREADO EXITOSAMENTE
      Swal.fire({
        title: "¡Registro Exitoso!",
        text: "Tu usuario ha sido creado correctamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });

      // Esperamos el segundo y medio para que el usuario disfrute la animación
      setTimeout(() => {
        registerForm.reset()
        window.history.pushState({}, "", "/login")
        renderRoute()
      }, 1500);

    } catch (error) {
      console.error("Error al registrar:", error)
      Swal.fire({
        title: "Error en el servidor",
        text: "No se pudo completar el registro.",
        icon: "error",
        confirmButtonColor: "#ef4444"
      });
      submitBtn.disabled = false
    }
  })
}