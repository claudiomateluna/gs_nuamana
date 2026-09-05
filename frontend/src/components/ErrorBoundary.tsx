'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold text-clr4 mb-2">Algo salió mal</h2>
          <p className="text-clr2 mb-4">{this.state.error?.message || 'Error inesperado'}</p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              this.props.onReset?.();
            }}
            className="px-4 py-2 bg-clr4 text-clr1 rounded hover:bg-clr4"
          >
            Intentar de nuevo
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
