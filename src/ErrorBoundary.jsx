import { Component } from "react";
import { Link } from "@tanstack/react-router";

/**
 * ErrorBoundary - One of the few places we still need class components!
 * 
 * This acts like a try-catch block for React components. When any child component
 * crashes with a JavaScript error, this catches it and shows a nice error page
 * instead of a white screen of death.
 * 
 * Key concept: Only class components can catch errors from children - hooks can't do this yet!
 */
class ErrorBoundary extends Component {
  // Initial state - assume everything is working fine
  state = {
    hasError: false,
  };

  /**
   * STATIC method - called on the CLASS, not on an instance
   * React calls this FIRST when a child component crashes
   * 
   * Why static? React needs to figure out the new state BEFORE creating/updating 
   * the component instance. No access to 'this' here!
   * 
   * This is like the "catch" part of try-catch - it updates state to show error UI
   */
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  /**
   * Called AFTER getDerivedStateFromError
   * This has access to 'this' because the component instance is ready now
   * 
   * Perfect place for:
   * - Logging errors to console (like we do)
   * - Sending error reports to services like Sentry
   * - Any cleanup or side effects
   */
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error: ", error, errorInfo);
  }

  /**
   * The render method handles TWO scenarios:
   * 1. Normal: hasError = false → show the wrapped components (this.props.children)  
   * 2. Error: hasError = true → show our custom error UI
   * 
   * Remember: this.props.children contains whatever was wrapped inside <ErrorBoundary>
   * If we forgot to return this.props.children, wrapped components would disappear!
   */
  render() {
    if (this.state.hasError) {
      // Show our custom "something went wrong" page
      return (
        <div className="error-boundary">
          <h2>Uh Oh!</h2>
          <p>
            There was an error with this page. <Link to="/">Click Here</Link>
            to go back to home page!
          </p>
        </div>
      );
    }
    
    // Everything is fine - show the wrapped components normally
    return this.props.children;
  }
}

export default ErrorBoundary;
// This component can be used to wrap around other components to catch errors
