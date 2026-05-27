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
    document.addEventListener("click", (event) => {
        const link =event.target.closest("a")
        if(!link){
        return
        }
        const href =link.getAttribute("href")

        if (!href || !href.startsWith("/")){
            return
        }

        event.preventDefault()
        window.history.pushState({}, "",href)
        renderRoute()
    })

    window.addEventListener("popstate",  (event) => {
        renderRoute()
        
    })
    
}