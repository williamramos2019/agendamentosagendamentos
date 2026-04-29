import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Força tema dark em toda a aplicação para manter a identidade visual da marca
document.documentElement.classList.add("dark");
document.documentElement.style.colorScheme = "dark";

createRoot(document.getElementById("root")!).render(<App />);
