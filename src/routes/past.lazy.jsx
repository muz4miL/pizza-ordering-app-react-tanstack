import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import getPastOrders from "../api/getPastOrders";
import getPastOrder from "../api/getPastOrder";
import Modal from "../Modal";
import { fixImagePath } from "../utils/imageUtils";
import ErrorBoundary from "../ErrorBoundary";

/**
 * TanStack Router Route Definition
 * 
 * LAZY LOADING CONCEPT:
 * This route is "lazy" - it only loads when user navigates to /past
 * Helps with app performance by not loading all routes upfront
 * 
 * STRATEGIC ERROR BOUNDARY PLACEMENT:
 * We wrap just this page component, not individual small components
 * If this page crashes, user can still navigate to other pages
 * Header/navigation stays working - only the problem area gets error UI
 */
export const Route = createLazyFileRoute("/past")({
  component: ErrorBoundryWrappedPastOrdersRoutes,
});

/**
 * Wrapper component that adds ErrorBoundary protection
 * 
 * COMPONENT-LEVEL ERROR HANDLING STRATEGY:
 * - Granular protection: only risky/complex components are wrapped
 * - Better UX: if one part fails, rest of app keeps working  
 * - Easier debugging: we know exactly which component failed
 */
function ErrorBoundryWrappedPastOrdersRoutes() {
  return (
    <ErrorBoundary>
      <PastOrdersRoute />
    </ErrorBoundary>
  );
}

// Number formatter for displaying prices in US currency format
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/**
 * Past Orders Page Component
 * 
 * COMPLEX STATE MANAGEMENT:
 * This component demonstrates several React patterns:
 * - Multiple useState hooks for different pieces of state
 * - Multiple TanStack Query hooks for different API calls
 * - Conditional rendering based on loading states
 * - Modal state toggling
 * 
 * TWO-LEVEL DATA FETCHING:
 * 1. Load list of orders (basic info: ID, date, time)
 * 2. When user clicks an order, load detailed info (items, prices, quantities)
 */
function PastOrdersRoute() {
  // Pagination state - which page of orders are we showing?
  const [page, setPage] = useState(1);
  
  // Modal state - which order details are we showing? (undefined = modal closed)
  const [focusedOrder, setFocusedOrder] = useState();

  /**
   * FIRST QUERY: Get list of past orders for current page
   * 
   * QUERY KEY BREAKDOWN:
   * ["past-orders", page] - unique identifier for caching
   * When page changes (1→2), TanStack Query knows to fetch new data
   * 
   * STALE TIME: Data stays "fresh" for 30 seconds
   * Within 30s, switching pages uses cached data (fast!)
   * After 30s, data is "stale" and gets refetched (up-to-date!)
   */
  const { isLoading, data } = useQuery({
    queryKey: ["past-orders", page],
    queryFn: () => getPastOrders(page),
    staleTime: 30000, // 30 seconds
  });

  /**
   * SECOND QUERY: Get detailed info for selected order
   * 
   * CONDITIONAL QUERY:
   * enabled: !!focusedOrder means "only run this query if focusedOrder has a value"
   * Prevents API call when modal is closed (focusedOrder = undefined)
   * 
   * LONGER STALE TIME: Order details don't change often, so cache for 24 hours
   * Performance optimization - once we load order details, keep them cached
   */
  const { isLoading: isLoadingPastOrder, data: pastOrderData } = useQuery({
    queryKey: ["past-order", focusedOrder],
    queryFn: () => getPastOrder(focusedOrder),
    enabled: !!focusedOrder, // Only fetch when we have an order ID to fetch
    staleTime: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  });

  // Show loading state for initial page load
  if (isLoading) {
    return (
      <div className="past-orders">
        <h2>LOADING …</h2>
      </div>
    );
  }

  return (
    <div className="past-orders">
      {/* ORDERS TABLE: List of past orders with basic info */}
      <table>
        <thead>
          <tr>
            <td>ID</td>
            <td>Date</td>
            <td>Time</td>
          </tr>
        </thead>
        <tbody>
          {data.map((order) => (
            <tr key={order.order_id}>
              <td>
                {/* Clicking order ID opens modal with details */}
                <button onClick={() => setFocusedOrder(order.order_id)}>
                  {order.order_id}
                </button>
              </td>
              <td>{order.date}</td>
              <td>{order.time}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION CONTROLS */}
      <div className="pages">
        {/* Disable Previous if we're on page 1 */}
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <div>{page}</div>
        {/* Disable Next if we got less than 10 orders (last page) */}
        <button disabled={data.length < 10} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>

      {/* MODAL: Show order details when focusedOrder is set */}
      {focusedOrder ? (
        <Modal>
          <h2>Order #{focusedOrder}</h2>
          {!isLoadingPastOrder ? (
            // Order details loaded - show the items table
            <table>
              <thead>
                <tr>
                  <td>Image</td>
                  <td>Name</td>
                  <td>Size</td>
                  <td>Quantity</td>
                  <td>Price</td>
                  <td>Total</td>
                </tr>
              </thead>
              <tbody>
                {pastOrderData.orderItems.map((pizza) => (
                  <tr key={`${pizza.pizzaTypeId}_${pizza.size}`}>
                    <td>
                      {/* Using our utility to fix API image paths for Vite */}
                      <img src={fixImagePath(pizza.image)} alt={pizza.name} />
                    </td>
                    <td>{pizza.name}</td>
                    <td>{pizza.size}</td>
                    <td>{pizza.quantity}</td>
                    <td>{intl.format(pizza.price)}</td>
                    <td>{intl.format(pizza.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            // Still loading order details - show loading state
            <p>Loading …</p>
          )}
          {/* Close modal by clearing focusedOrder */}
          <button onClick={() => setFocusedOrder()}>Close</button>
        </Modal>
      ) : null}
    </div>
  );
}
