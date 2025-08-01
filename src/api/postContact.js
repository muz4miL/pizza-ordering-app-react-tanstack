/**
 * Contact Form Submission API
 *
 * This is a "data mutation" function - it CHANGES data on the server
 * (as opposed to just fetching/reading data)
 *
 * DESIGN PATTERN:
 * - This function handles pure data fetching logic
 * - TanStack Query (useMutation) handles the UI concerns like loading states, errors, retries
 * - Clean separation of concerns!
 *
 * @param {string} name - User's name from contact form
 * @param {string} email - User's email from contact form
 * @param {string} message - User's message from contact form
 * @returns {Promise<Response>} - The fetch response object
 */
export default async function postContact(name, email, message) {
  // Make HTTP POST request to our backend API
  // This gets proxied to http://localhost:3000/api/contact (see vite.config.js)
  const response = await fetch("https://pizza-qei1istsz-muzamil-shirazs-projects.vercel.app/api/contact", {
    method: "POST", // POST because we're SENDING data to server (not GET-ting data)

    headers: {
      // Tell server: "Hey, the data I'm sending is in JSON format"
      // Server needs this to know how to parse the body
      "Content-Type": "application/json",
    },

    // Convert JavaScript object to JSON string
    // Why? HTTP can only send text/bytes, not JS objects
    // { name: "John" } → '{"name":"John"}' (server can parse this!)
    body: JSON.stringify({ name, email, message }),
  });

  // Check if request failed (404, 500, network error, etc.)
  // response.ok is false for error status codes
  if (!response.ok) {
    // Throw error so TanStack Query knows something went wrong
    // This will trigger the onError callback in useMutation
    throw new Error("Failed to post contact information!");
  }

  // Return the response object for TanStack Query to handle
  return response;
}
