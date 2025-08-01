/**
 * Fetch Individual Past Order Details
 *
 * This fetches detailed information about a specific order (pizza items, quantities, prices)
 * Used when user clicks on an order ID in the past orders table
 *
 * LEARNING NOTE: The 5-second delay is intentional!
 * It simulates a slow network/server response so you can see loading states in action
 * In real apps, some API calls can be slow, so this helps you build better UX
 *
 * @param {string|number} order - The order ID to fetch details for
 * @returns {Promise<Object>} - Order details with items array
 */
export default async function getPastOrder(order) {
  // Artificial delay to simulate slow network - great for testing loading states!
  // In production, you'd remove this line
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Fetch specific order details from backend
  // URL becomes: /api/past-order/12345 (where 12345 is the order ID)
  const response = await fetch(`https://pizza-qei1istsz-muzamil-shirazs-projects.vercel.app/api/past-order/${order}`);

  // Parse JSON response into JavaScript object
  const data = await response.json();

  // Return the data for TanStack Query to cache and manage
  return data;
}
