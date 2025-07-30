// Utility function to fix image paths from the API
// The API returns paths like "/public/pizzas/image.webp"
// but Vite serves public assets directly from root, so we need "/pizzas/image.webp"
export function fixImagePath(imagePath) {
  if (!imagePath) return "";

  // Remove /public prefix if it exists
  return imagePath.replace(/^\/public/, "");
}
