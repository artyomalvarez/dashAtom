import "./styles/global.css";
import { renderHome } from "./views/home";
import { renderLogin } from "./views/login";
import { rederRegister } from "./views/resgister";

const app = document.getElementById("app")

app.innerHTML = rederRegister();