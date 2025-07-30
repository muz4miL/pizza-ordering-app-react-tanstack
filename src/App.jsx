import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";

/**
 * Main App Entry Point
 * 
 * PROVIDER PATTERN SETUP:
 * This is where we set up the "providers" that wrap our entire app
 * Think of providers as "services" that any component can tap into
 * 
 * LAYER BY LAYER:
 * 1. StrictMode - React's development helper (finds potential problems)
 * 2. QueryClientProvider - Makes TanStack Query available everywhere  
 * 3. RouterProvider - Makes TanStack Router available everywhere
 * 4. Our actual app routes/components
 */

// Create TanStack Router instance with our route definitions
// routeTree.gen.ts is auto-generated from our route files
const router = createRouter({ routeTree });

// Create TanStack Query client with default configuration
// This manages all our server state, caching, background refetching, etc.
const queryClient = new QueryClient();

/**
 * Root App Component
 * 
 * PROVIDER NESTING ORDER MATTERS:
 * - QueryClientProvider must wrap RouterProvider (routes need access to queries)
 * - StrictMode wraps everything (helps catch bugs in development)
 */
const App = () => {
  return (
    <StrictMode>
      {/* Make TanStack Query available to all components */}
      <QueryClientProvider client={queryClient}>
        {/* Make TanStack Router available to all components */}
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>
  );
};

// React 18 rendering setup
const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
