import { renderHome } from "../views/home" 
import { rederRegister, setupRegister } from "../views/auth/resgister"
import { renderLogin, setupLogin } from "../views/auth/login";
import {renderAdmin, setupAdmin} from "../views/admin/admin"
import { renderNotFound } from "../views/not-found"
import { renderDashboard } from "../views/app/dashboard"
import { renderProfile, setupProfile } from "../views/admin/profile"
import { renderTaskForm, setupTaskForm } from "../views/tasks/task-form"
import { renderTask, setupTask } from "../views/tasks/task"

export const routes = {
    "/": {
        render: renderHome,
        isAutorized: false,
    },
    "/login": {
        render: renderLogin,
        setup : setupLogin,
        isAutorized: false,
    },
    "/register": {
        render: rederRegister,
        setup : setupRegister,
        isAutorized: false,
    },
    "/admin": {
        render: renderAdmin,
        setup: setupAdmin,
        isAutorized: true,
    },
    "/dashboard": {
        render: renderDashboard,
        isAutorized: true,
    },
    "/profile": {
        render: renderProfile,
        setup: setupProfile,
        isAutorized: true,
    },
    "/tasks": {
        render: renderTask,
        setup: setupTask,
        isAutorized: true,
    },
    "/task-form": {
        render: renderTaskForm,
        setup:setupTaskForm,
        isAutorized: true,
    },

}


export const notfound = renderNotFound()