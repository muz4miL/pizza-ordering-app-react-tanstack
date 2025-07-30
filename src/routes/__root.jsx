import { useState } from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import PizzaOfTheDay from "../PizzaOfTheDay";
import Header from "../Header";
import { CartContext } from "../contexts";

/**
 * Root Route Component
 * 
 * This is the "layout" component that wraps ALL pages in your app
 * Every route (/order, /past, /) will render inside the <Outlet />
 * 
 * SHARED LAYOUT PATTERN:
 * - Header appears on every page
 * - PizzaOfTheDay appears on every page  
 * - Page-specific content renders in <Outlet />
 * - Cart context is available to all pages
 * 
 * CONTEXT PROVIDER PATTERN:
 * We create cart state here and provide it to all child components
 * Any component can import CartContext and useContext to access cart data
 */
export const Route = createRootRoute({
  component: () => {
    /**
     * Cart State Management
     * 
     * useState returns [state, setState] - exactly what Context consumers expect!
     * cartHook = [cart, setCart] where:
     * - cart is array of pizza items: [{ pizza: {...}, size: "M", price: "$12.99" }]
     * - setCart is function to update the cart
     * 
     * WHY HERE? Root route ensures cart state persists across all page navigation
     */
    const cartHook = useState([]);

    return (
      <>
        {/* Provide cart state to ALL child components */}
        <CartContext.Provider value={cartHook}>
          <div>
            {/* Header with cart counter - appears on every page */}
            <Header />
            
            {/* This is where page content renders! */}
            {/* When you navigate to /order, Order component renders here */}
            {/* When you navigate to /past, PastOrders component renders here */}
            <Outlet />
            
            {/* Pizza of the day - appears on every page */}
            <PizzaOfTheDay />
          </div>
        </CartContext.Provider>
        
        {/* Development tools - only show in development mode */}
        <TanStackRouterDevtools />
        <ReactQueryDevtools />
      </>
    );
  },
});
