(function() {
    class ErrorBoundary extends React.Component {
        constructor(props) {
            super(props);
            this.state = { hasError: false, error: null, errorInfo: null };
        }

        static getDerivedStateFromError(error) {
            return { hasError: true };
        }

        componentDidCatch(error, errorInfo) {
            console.error("Uncaught error:", error, errorInfo);
            this.setState({ error, errorInfo });
        }

        render() {
            if (this.state.hasError) {
                return (
                    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                        <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <div className="icon-triangle-alert text-red-600 text-2xl"></div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
                            <p className="text-gray-600 mb-6">
                                We encountered an unexpected error. Please try refreshing the page.
                            </p>
                            <details className="text-left text-xs bg-gray-100 p-4 rounded mb-6 overflow-auto max-h-40">
                                <summary className="cursor-pointer font-medium mb-2">Error Details</summary>
                                <pre className="whitespace-pre-wrap text-red-600">
                                    {this.state.error && this.state.error.toString()}
                                </pre>
                            </details>
                            <button 
                                onClick={() => window.location.reload()} 
                                className="btn btn-primary w-full"
                            >
                                Refresh Page
                            </button>
                        </div>
                    </div>
                );
            }

            return this.props.children;
        }
    }

    // Expose globally
    window.ErrorBoundary = ErrorBoundary;
})();