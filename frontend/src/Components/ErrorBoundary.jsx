import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false, errorMessage: '' };

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message || 'Unknown error' };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-500 text-center py-10">
          <span className="text-2xl font-bold block mb-4">
            Something went wrong. Please check your connection and try again.
          </span>
          <span className="text-red-200 text-lg">
            Error: {this.state.errorMessage}
          </span>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
