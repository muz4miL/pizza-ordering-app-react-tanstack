import { useState, use, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import getPastOrders from "../api/getPastOrders";
import getPastOrder from "../api/getPastOrder";
import Modal from "../Modal";
import { fixImagePath } from "../utils/imageUtils";
import ErrorBoundary from "../ErrorBoundary";

// Number formatter for displaying prices in US currency format
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

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
function ErrorBoundryWrappedPastOrdersRoutes(props) {
  const { page, setPage } = useState(1);
  const loadedPromise = useQuery({
    queryKey: ["past-orders", page],
    queryFn: () => getPastOrders(page),
    staleTime: 30000, // 30 seconds
  }).promise;

  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="past-orders">
            <h2>Loading Past Orders ... </h2>
          </div>
        }
      >
        <PastOrdersRoute
          loadedPromise={loadedPromise}
          page={page}
          setPage={setPage}
          {...props}
        />
      </Suspense>
    </ErrorBoundary>
  );
}

function PastOrdersRoute({ page, setPage, loadedPromise }) {
  const data = use(loadedPromise);

  // Modal state - which order details are we showing? (undefined = modal closed)
  const [focusedOrder, setFocusedOrder] = useState();

  const { isLoading: isLoadingPastOrder, data: pastOrderData } = useQuery({
    queryKey: ["past-order", focusedOrder],
    queryFn: () => getPastOrder(focusedOrder),
    enabled: !!focusedOrder, // Only fetch when we have an order ID to fetch
    staleTime: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  });

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
            <p className="single-order-loading">Loading …</p>
          )}
          {/* Close modal by clearing focusedOrder */}
          <button onClick={() => setFocusedOrder()}>Close</button>
        </Modal>
      ) : null}
    </div>
  );
}
