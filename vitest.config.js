import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [TanStackRouterVite(), react()],
  optimizeDeps: {
    include: [
      "react-dom/client",
      "@tanstack/router-devtools",
      "@tanstack/react-query-devtools",
    ],
  },
  test: {
    environment: "happy-dom",
    coverage: {
      reporter: ["text", "json", "html"],
    },
    // Browser testing configuration (disabled by default)
    browser: {
      enabled: false, // Enable with --browser.enabled
      provider: "playwright",
      name: "firefox",
      headless: true,
    },
  },
});
