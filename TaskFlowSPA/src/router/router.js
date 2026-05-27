import { notfound, routes } from "./routes";

export function renderRoute() {
    const  app = document.getElementById("app")
    if(!app){
        return
    }
    const currentPath = window.location.pathname
    const route = routes[currentPath] ?? {render: notfound}


    app.innerHTML = route.render()

    if(route.setup){
        route.setup()
    }
}
export function initRouter() {
    
}