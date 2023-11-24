import React, { ReactNode } from "react";

type ErrorProps = {
  children: ReactNode;
};

type ErrorState = {
  hasError: boolean;
  error: Error | null;
  stack: string;
};

class ErrorBoundary extends React.Component<ErrorProps, ErrorState> {
  constructor(props: ErrorProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      stack: "",
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState(() => {
      return {
        error,
        stack: errorInfo.componentStack,
      };
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <h1>{this.state.error?.name}</h1>
          <br />
          <h3>{this.state.error?.message}</h3>
          <br />
          <p>{this.state.stack}</p>
        </>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
