// Main App Component
const { useState, useEffect } = React;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-4">We apologize for the inconvenience. Please try refreshing the page.</p>
            <details className="whitespace-pre-wrap text-sm text-gray-500 bg-gray-100 p-4 rounded overflow-auto max-h-48">
              {this.state.error && this.state.error.toString()}
            </details>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
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

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      // Redirect to dashboard if on auth pages
      if (['login', 'register'].includes(currentPage)) {
        setCurrentPage('dashboard');
      }
    }
    setLoading(false);
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage(userData.role === 'recruiter' ? 'recruiter-dashboard' : 'dashboard');
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setCurrentPage('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} user={user} />;
      case 'login':
        return <Login onLogin={handleLogin} onNavigate={handleNavigate} />;
      case 'register':
        return <Register onRegister={handleLogin} onNavigate={handleNavigate} />;
      case 'dashboard':
        return <Dashboard user={user} onNavigate={handleNavigate} />;
      case 'recruiter-dashboard':
        return <RecruiterDashboard user={user} onNavigate={handleNavigate} />;
      case 'jobs':
        return <JobBoard user={user} onNavigate={handleNavigate} />;
      case 'profile':
        return <Profile user={user} onUpdateUser={setUser} />;
      default:
        return <Home onNavigate={handleNavigate} user={user} />;
    }
  };

  return (
    <Layout user={user} onNavigate={handleNavigate} onLogout={handleLogout}>
      {renderPage()}
    </Layout>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);