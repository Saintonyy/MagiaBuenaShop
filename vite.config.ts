import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  // 👇 En Vercel debe ser raíz. El default de Vite ya es '/', pero lo ponemos explícito.
  base: "/",
  build: { sourcemap: true },
  // Vercel no usa este server; lo puedes dejar o quitar.
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
