import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { devSmoke } from './devSmoke'; if (import.meta.env.DEV) devSmoke();

createRoot(document.getElementById("root")!).render(<App />);
