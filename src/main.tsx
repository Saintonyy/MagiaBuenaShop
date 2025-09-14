import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

if (import.meta.env.DEV) { import('./devSmoke').then(m => m.devSmoke()); }

createRoot(document.getElementById("root")!).render(<App />);
