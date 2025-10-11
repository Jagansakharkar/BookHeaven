import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className=" bg-red-500 text-center py-10 ">
        <span className='text-4xl'>
          Something went wrong, Please Check Your Internet Connection.Please try Again
        </span>

      </div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;