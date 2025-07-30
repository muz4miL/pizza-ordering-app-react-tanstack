import { Component } from "react";
import { Link } from "@tanstack/react-router";

class ErrorBoundary extends Component {
  state = {
    hasError: false,
  };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error: ", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
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
    return this.props.children;
  }
}

export default ErrorBoundary;
// This component can be used to wrap around other components to catch errors
