import { renderHome } from "../views/home" 
import { renderLogin } from "../views/auth/login" 
import { rederRegister } from "../views/auth/resgister"
import {renderAdmin} from "../views/admin/admin"
import { renderNotFound } from "../views/not-found"
import { renderDashboard } from "../views/app/dashboard"
import { renderProfile } from "../views/admin/profile"
import { setupRegister } from "../views/auth/resgister"
import { renderTaskForm } from "../views/tasks/task-form"
import { renderTask } from "../views/tasks/task"

export const routes = {
    "/": {
        render: renderHome,
        isAutorized: false,
    },
    "/login": {
        render: renderLogin,
        isAutorized: false,
    },
    "/register": {
        render: rederRegister,
        setup : setupRegister,
        isAutorized: true,
    },
    "/admin": {
        render: renderAdmin,
        isAutorized: true,
    },
    "/dashboard": {
        render: renderDashboard,
        isAutorized: true,
    },
    "/profile": {
        render: renderProfile,
        isAutorized: true,
    },
    "/tasks": {
        render: renderTask,
        isAutorized: true,
    },
    "/task-form": {
        render: renderTaskForm,
        isAutorized: true,
    },

}


export const notfound = renderNotFound()