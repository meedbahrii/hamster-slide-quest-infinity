
import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="text-center max-w-md">
        <AlertTriangle className="mx-auto mb-4 text-red-500" size={48} />
        <h1 className="text-2xl font-bold mb-2">Oops! Something went wrong</h1>
        <p className="text-gray-400 mb-4">
          Don't worry, your progress is saved. Try refreshing the game.
        </p>
        <details className="mb-4 text-left">
          <summary className="cursor-pointer text-sm text-gray-500 mb-2">
            Technical details
          </summary>
          <pre className="text-xs bg-gray-800 p-2 rounded overflow-auto max-h-32">
            {error.message}
          </pre>
        </details>
        <div className="space-y-2">
          <Button onClick={resetErrorBoundary} className="w-full">
            <RefreshCw size={16} className="mr-2" />
            Try Again
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()} 
            className="w-full"
          >
            Refresh Page
          </Button>
        </div>
      </div>
    </div>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Game Error:', error);
        console.error('Error Info:', errorInfo);
        
        // Here you could send error reports to analytics
        // trackError('game_error', { error: error.message, stack: error.stack });
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
