import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Wind, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackView?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[FluteSangam ErrorBoundary caught error]:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallbackView) {
        return this.props.fallbackView;
      }

      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto my-12 bg-white/80 backdrop-blur-md rounded-3xl border border-amber-200/80 shadow-md">
          <div className="bg-amber-100 border border-amber-300/80 p-4 rounded-3xl mb-4 shadow-3xs">
            <Wind className="w-10 h-10 text-amber-800 animate-pulse" />
          </div>
          
          <h2 className="text-xl font-bold font-display text-bamboo-950 mb-2">
            Something Went Wrong
          </h2>
          
          <p className="text-xs text-gray-600 leading-relaxed mb-6 max-w-xs">
            FluteSangam encountered a temporary loading or rendering issue. Don't worry—your data and progress are safe.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
            <button
              onClick={this.handleReload}
              className="w-full py-2.5 px-4 bg-bamboo-700 hover:bg-bamboo-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reload App</span>
            </button>

            <button
              onClick={this.handleGoHome}
              className="w-full py-2.5 px-4 bg-amber-100 hover:bg-amber-200 text-bamboo-900 border border-amber-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Go to Home</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
