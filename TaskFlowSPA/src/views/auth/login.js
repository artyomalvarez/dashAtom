import { loginUser } from "../../services/auth.service";
import { renderRoute } from '../../router/router.js';
import { buttonSubmit } from "../../components/atoms/registerButton.js";
import Swal from 'sweetalert2';

export function renderLogin() {
  return `
    <main class="grid min-h-screen lg:grid-cols-[1fr_0.95fr] transition-colors duration-300">
      
      <section class="flex items-center justify-center px-6 py-10 bg-white dark:bg-slate-950">
        <div class="w-full max-w-xl rounded-4xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl shadow-blue-100/70 dark:shadow-none">
          <div class="flex items-center justify-between">
            <a class="text-xl font-black tracking-tight text-blue-900 dark:text-blue-400" href="/">TaskFlowSPA</a>
            <a class="rounded-full border border-blue-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-800" href="/register">Registrarse</a>
          </div>

          <div class="mt-8">
            <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">Inicio de sesion</p>
            <h1 class="mt-2 text-4xl font-black tracking-tight text-slate-900 dark:text-white">Bienvenido de nuevo</h1>
            <p class="mt-4 text-slate-600 dark:text-slate-400">Ingresa a tu espacio de trabajo y continua organizando tus tareas.</p>
          </div>

          <form id="login-form" class="mt-8 grid gap-5">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="email">Correo</label>
              <input id="email" type="email" placeholder="usuario@taskflow.com" class="w-full rounded-2xl border border-blue-100 dark:border-slate-700 bg-blue-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-400 focus:outline-none" />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="password">Contrasena</label>
              <input id="password" type="password" placeholder="Ingresa tu contrasena" class="w-full rounded-2xl border border-blue-100 dark:border-slate-700 bg-blue-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-400 focus:outline-none" />
            </div>
            
            ${buttonSubmit("Entrar al dashboard")}
          </form>
        </div>
      </section>

      <section class="hidden bg-blue-600 dark:bg-blue-950 p-10 text-white lg:flex lg:flex-col lg:justify-center transition-colors duration-300">
        <div class="mx-auto max-w-lg">
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100 dark:text-blue-300">TaskFlowSPA</p>
          <h2 class="mt-4 text-5xl font-black tracking-tight">Una experiencia limpia para aprender una primera SPA.</h2>
          <ul class="mt-8 space-y-4 text-lg leading-8 text-blue-50 dark:text-blue-200">
            <li>Autenticacion simplificada con localStorage.</li>
            <li>Gestion de tareas con enfoque claro y visual.</li>
            <li>Roles y permisos entendibles desde el primer recorrido.</li>
          </ul>
        </div>
      </section>
    </main>
  `;
}

export async function setupLogin() {
  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      Swal.fire({
        title: "Campos incompletos",
        text: "Por favor completa todos los campos",
        icon: "warning",
        confirmButtonColor: "#2563eb"
      });
      submitBtn.disabled = false;
      return;
    }

    try {
      const userFound = await loginUser(email, password);

      if (userFound) {
        localStorage.setItem("currentUser", JSON.stringify(userFound));

        Swal.fire({
          title: "¡Bienvenido!",
          text: "Iniciando sesión correctamente...",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });

        setTimeout(() => {
          const esAdmin = userFound.roles && userFound.roles.includes("ADMIN");
          window.history.pushState({}, "", esAdmin ? "/admin" : "/dashboard");
          renderRoute();
        }, 1500);

      } else {
        Swal.fire({
          title: "Error de acceso",
          text: "Credenciales incorrectas",
          icon: "error",
          confirmButtonColor: "#ef4444"
        });
        submitBtn.disabled = false;
      }
    } catch (error) {
      console.error("Error en flujo de login de la vista:", error);
      Swal.fire({
        title: "Oops...",
        text: "Ocurrió un error al procesar la solicitud.",
        icon: "error",
        confirmButtonColor: "#ef4444"
      });
      submitBtn.disabled = false;
    }
  });
}