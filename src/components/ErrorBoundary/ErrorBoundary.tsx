import React, { ReactNode } from "react";
import { Button, Result } from "antd";

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

  goHome() {
    location.replace(`${window.location.protocol}//${window.location.host}/`);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status={"500"}
          title={this.state.error?.name}
          subTitle="Looks like something went wrong."
          extra={
            <Button
              onClick={() => {
                this.goHome();
              }}
            >
              Go back home
            </Button>
          }
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
