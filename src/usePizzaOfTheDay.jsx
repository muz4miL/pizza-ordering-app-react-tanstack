import { useState, useEffect, useDebugValue } from "react";

/**
 * Custom Hook: usePizzaOfTheDay
 * 
 * CUSTOM HOOK PATTERN:
 * This encapsulates the logic for fetching today's featured pizza
 * Any component can use this hook to get the pizza of the day data + loading state
 * It's reusable and keeps components clean!
 * 
 * WHY CUSTOM HOOKS ARE AWESOME:
 * - Reusable logic across multiple components
 * - Keeps components focused on rendering, not data fetching
 * - Easy to test and maintain
 * - Follows React's "hooks" pattern
 * 
 * @returns {Object|null} - Pizza object with name, description, sizes, image OR null while loading
 */
export const usePizzaOfTheDay = () => {
  // Local state to store the fetched pizza data
  // Starts as null (loading state) until API responds  
  const [pizzaOfTheDay, setPizzaOfTheDay] = useState(null);

  // React DevTools debugging helper - shows current value in Components tab
  // When debugging, you'll see either "Loading..." or "Pepperoni Pizza" etc.
  useDebugValue(pizzaOfTheDay ? `${pizzaOfTheDay.name}` : "Loading...");

  // Effect runs once when component mounts (empty dependency array [])
  // This is where we fetch the data from our API
  useEffect(() => {
    /**
     * Async function to fetch today's featured pizza
     * We define this inside useEffect because useEffect can't be async directly
     */
    async function fetchPizzaOfTheDay() {
      // Call our backend API to get today's special
      const response = await fetch("/api/pizza-of-the-day");
      const data = await response.json();
      
      // Update state with the fetched pizza data
      // This will cause any component using this hook to re-render
      setPizzaOfTheDay(data);
    }

    // Actually call the async function
    fetchPizzaOfTheDay();
  }, []); // Empty array = run once on mount, never again

  // Return the current pizza data (null while loading, pizza object when loaded)
  return pizzaOfTheDay;
};
