/**
 * Image Path Utilities
 * 
 * THE PROBLEM WE'RE SOLVING:
 * Our backend API returns image paths like "/public/pizzas/bbq_ckn.webp"
 * But Vite serves files from the public folder directly at the root!
 * 
 * So when the browser tries to load "/public/pizzas/bbq_ckn.webp", it gets 404
 * Because the actual file is served at "/pizzas/bbq_ckn.webp" (no /public prefix)
 * 
 * VITE'S RULE: Files in public/ folder are available directly from root URL
 * public/pizzas/image.webp → http://localhost:5174/pizzas/image.webp ✅
 * NOT http://localhost:5174/public/pizzas/image.webp ❌
 */

/**
 * Fixes image paths returned by our API to work with Vite's static asset serving
 * 
 * @param {string} imagePath - The path from API (e.g., "/public/pizzas/image.webp")
 * @returns {string} - Fixed path for Vite (e.g., "/pizzas/image.webp")
 * 
 * Examples:
 * fixImagePath("/public/pizzas/bbq_ckn.webp") → "/pizzas/bbq_ckn.webp"
 * fixImagePath("/pizzas/already_good.webp") → "/pizzas/already_good.webp" (unchanged)
 * fixImagePath("") → "" (handles empty/null safely)
 */
export function fixImagePath(imagePath) {
  // Safety check - handle null/undefined/empty strings gracefully
  if (!imagePath) return "";

  // Remove /public prefix if it exists using regex
  // ^\/public means "starts with /public"
  // This transforms: "/public/pizzas/image.webp" → "/pizzas/image.webp"
  return imagePath.replace(/^\/public/, "");
}
