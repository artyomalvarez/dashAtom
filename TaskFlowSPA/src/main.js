import "./styles/global.css";
import Swal from 'sweetalert2';
import { applyInitialTheme } from './utils/theme.js';
import { initRouter, renderRoute } from "./router/router.js";
applyInitialTheme();
renderRoute()
initRouter()
