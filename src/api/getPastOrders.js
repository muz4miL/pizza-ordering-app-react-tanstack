/**
 * Fetch Past Orders List (Paginated)
 * 
 * This fetches a list of past orders for the current page
 * Used in the past orders table with Previous/Next pagination
 * 
 * PAGINATION CONCEPT:
 * Instead of loading ALL orders at once (which could be thousands!),
 * we load them in "pages" of ~10 orders each
 * Page 1: orders 1-10, Page 2: orders 11-20, etc.
 * Much better for performance and user experience!
 * 
 * @param {number} page - Which page of orders to fetch (1, 2, 3, etc.)
 * @returns {Promise<Array>} - Array of order objects with basic info (ID, date, time)
 */
export default async function getPastOrders(page) {
  // Make request with page parameter in query string
  // URL becomes: /api/past-orders?page=1 or /api/past-orders?page=2
  const response = await fetch(`https://pizza-api-99.vercel.app/api/past-orders?page=${page}`);
  
  // Convert JSON response to JavaScript array
  const data = await response.json();
  
  // Return the array of orders for TanStack Query to cache
  // Each order has: order_id, date, time (basic info only, not full details)
  return data;
}
