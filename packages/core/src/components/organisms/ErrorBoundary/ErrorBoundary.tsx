import { Component, type ErrorInfo, type ReactNode } from 'react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  /** Optional fallback UI. If not provided, renders a default error state. */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  /** Called when an error is caught. */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Unique key to reset the boundary when it changes. */
  resetKey?: string | number;
}

interface ErrorBoundaryState {
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/** Detect if running in development mode. Declared for bundler replacement. */
declare const process:
  | {
      env: { NODE_ENV: string };
    }
  | undefined;

const IS_DEV: boolean =
  typeof process !== 'undefined' && process.env.NODE_ENV === 'development';

function isChunkLoadError(error: Error): boolean {
  return (
    error.name === 'ChunkLoadError' ||
    error.message?.includes('Loading chunk') ||
    error.message?.includes('ChunkLoadError')
  );
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.props.resetKey !== prevProps.resetKey && this.state.error) {
      this.reset();
    }
  }

  reset = () => {
    this.setState({ error: null, errorInfo: null });
  };

  render() {
    const { error } = this.state;
    const { children, fallback } = this.props;

    if (!error) {
      return children;
    }

    if (fallback) {
      if (typeof fallback === 'function') {
        return fallback(error, this.reset);
      }
      return fallback;
    }

    // Default fallback UI
    const isChunkError = isChunkLoadError(error);

    return (
      <div className="error-boundary">
        <div className="error-boundary__icon">!</div>
        <h3 className="error-boundary__title">
          {isChunkError ? 'Failed to load module' : 'Something went wrong'}
        </h3>
        <p className="error-boundary__message">
          {isChunkError
            ? 'A part of the application failed to load. ' +
              'This usually happens after a new deployment.'
            : 'An unexpected error occurred. Please try again.'}
        </p>
        {isChunkError ? (
          <button
            type="button"
            className="button button--default"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
        ) : (
          <button
            type="button"
            className="button button--default"
            onClick={this.reset}
          >
            Try again
          </button>
        )}
        {IS_DEV && (
          <details className="error-boundary__details">
            <summary>Error details</summary>
            <pre className="error-boundary__stack">{error.stack}</pre>
          </details>
        )}
      </div>
    );
  }
}
