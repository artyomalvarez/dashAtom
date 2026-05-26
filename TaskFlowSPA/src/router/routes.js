import { renderHome } from "../views/home" 
import { renderLogin } from "../views/login" 
import { rederRegister } from "../views/resgister"


const routes = {
    "/": renderHome(),
    "/login.js": renderLogin(),
    "/register.js": {
        render: rederRegister(),
        setup : setupRegister(),
        isAutorized: true,
    }

}









export const notfound = renderNotFound()