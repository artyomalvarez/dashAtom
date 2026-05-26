import "./styles/global.css";
import { renderHome } from "./views/home";

const app = document.getElementById("app")

app.innerHTML = renderHome();