function Layout({ children, user, onNavigate, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
                <div className="bg-blue-600 p-2 rounded-lg mr-2">
                    <div className="icon-cpu text-white text-xl"></div>
                </div>
                <span className="font-bold text-xl text-gray-900">AI JobPortal</span>
              </div>
              
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                <button onClick={() => onNavigate('home')} className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Home
                </button>
                <button onClick={() => onNavigate('jobs')} className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Find Jobs
                </button>
                {user && user.role === 'recruiter' && (
                    <button onClick={() => onNavigate('recruiter-dashboard')} className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                        Recruiter Dashboard
                    </button>
                )}
                 {user && user.role === 'candidate' && (
                    <button onClick={() => onNavigate('dashboard')} className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                        My Dashboard
                    </button>
                )}
              </div>
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                   <button onClick={() => onNavigate('profile')} className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center">
                     <div className="icon-user mr-2"></div>
                     {user.name}
                   </button>
                   <button 
                    onClick={onLogout}
                    className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium"
                   >
                    Sign out
                   </button>
                </div>
              ) : (
                <>
                  <button onClick={() => onNavigate('login')} className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    Log in
                  </button>
                  <button onClick={() => onNavigate('register')} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium">
                    Sign up
                  </button>
                </>
              )}
            </div>

             {/* Mobile menu button */}
            <div className="-mr-2 flex items-center sm:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <div className={mobileMenuOpen ? 'icon-x' : 'icon-menu'}></div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-white border-t border-gray-200 pb-4">
            <div className="pt-2 pb-3 space-y-1">
               <button onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 w-full text-left">Home</button>
               <button onClick={() => { onNavigate('jobs'); setMobileMenuOpen(false); }} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 w-full text-left">Jobs</button>
               {user && (
                   <>
                    <button onClick={() => { onNavigate(user.role === 'recruiter' ? 'recruiter-dashboard' : 'dashboard'); setMobileMenuOpen(false); }} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 w-full text-left">Dashboard</button>
                    <button onClick={() => { onNavigate('profile'); setMobileMenuOpen(false); }} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 w-full text-left">Profile</button>
                    <button onClick={() => { onLogout(); setMobileMenuOpen(false); }} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 w-full text-left">Sign Out</button>
                   </>
               )}
               {!user && (
                   <>
                    <button onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 w-full text-left">Log In</button>
                    <button onClick={() => { onNavigate('register'); setMobileMenuOpen(false); }} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 w-full text-left">Sign Up</button>
                   </>
               )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
           <div className="md:flex md:items-center md:justify-between">
              <div className="flex justify-center md:justify-start space-x-6 md:order-2">
                 <p className="text-center text-base text-gray-400">
                   &copy; 2026 AI JobPortal. All rights reserved.
                 </p>
              </div>
              <div className="mt-8 md:mt-0 md:order-1">
                 <div className="flex items-center justify-center md:justify-start">
                    <div className="icon-cpu text-blue-600 mr-2"></div>
                    <span className="text-gray-900 font-semibold">AI JobPortal</span>
                 </div>
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
}