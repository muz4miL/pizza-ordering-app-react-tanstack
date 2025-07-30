import { createContext } from "react";

/**
 * Shopping Cart Context
 * 
 * CONTEXT PATTERN EXPLAINED:
 * Instead of passing cart data through props down multiple component levels (prop drilling),
 * Context lets us share cart state across the entire app from any component!
 * 
 * USAGE PATTERN:
 * 1. Provider (in __root.jsx): <CartContext.Provider value={cartHook}>
 * 2. Consumer (in Header.jsx, Cart.jsx): const [cart, setCart] = useContext(CartContext)
 * 
 * DEFAULT VALUE STRUCTURE:
 * [[], () => {}] represents [cartItems, setCartItems] - same shape as useState hook
 * This is just a fallback - the real value comes from the Provider
 */
export const CartContext = createContext([[], () => {}]);
