function Layout({ children, user, onNavigate, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              
<div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => {
  if (user) {
    onNavigate(user.role === 'recruiter' ? 'recruiter-dashboard' : 'dashboard');
  } else {
    onNavigate('home');
  }
}}>
              {/* <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => onNavigate('home')}> */}
                <div className="bg-blue-600 p-2 rounded-lg mr-2">
                    <div className="icon-cpu text-white text-xl"></div>
                </div>
                <span className="font-bold text-xl text-gray-900">AI JobPortal</span>
              </div>
              {!user && (
  <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
    <button onClick={() => onNavigate('home')} className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
      Companies
    </button>

    <button onClick={() => onNavigate('homeop')} className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
      Services
    </button>

    <button onClick={() => onNavigate('jobs')} className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
      Find Jobs
    </button>
  </div>
)}

              {/* <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                <button onClick={() => onNavigate('home')} className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Companies
                </button>
                <button onClick={() => onNavigate('homeop')} className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Services
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
              </div> */}
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
              {user ? (
                
                <div className="flex items-center space-x-4">
                   <NotificationBell user={user} />
                   {/* <NotificationCenter userRole="candidate" userId={window.currentCandidateId} /> */}


                 {/* <button
  onClick={() => onNavigate('notice')}
  className="text-sm font-medium text-gray-700 hover:text-gray-900"
>
  Notifications
</button> */}

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
                {/* <button onClick={() => onNavigate('recruiter-dashboard')} className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                 recruiter-dashboard
                </button> */}
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
function NotificationBell({ user }) {
  const [open, setOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState([]);

  const fetchNotifications = () => {
    if (!user) return;

    fetch(`http://localhost/candidatemodule/public/get_interview_bookingss.php?candidate_id=${user.objectId}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) setNotifications(json.data);
      });
  };

  React.useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // auto refresh
    return () => clearInterval(interval);
  }, [user]);

  const markAsRead = async (id) => {
    await fetch(
      'http://localhost/candidatemodule/public/mark_notification_read.php',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `id=${id}`
      }
    );

    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: 1 } : n)
    );
  };

  const unreadCount = notifications.filter(n => n.is_read == 0).length;

  return (
    <div className="relative">
      {/* 🔔 Bell */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <div className="icon-bell text-xl"></div>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 📋 Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white border rounded-lg shadow-lg z-50">
          <div className="px-4 py-2 border-b flex justify-between">
            <span className="font-semibold text-sm">Notifications</span>
            <button onClick={fetchNotifications} className="text-xs text-blue-600">
              Refresh
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            ) : (
             notifications.map(n => {
  const bookingUrl = `http://localhost/candidatemodule/Candidate/candidate-dashboard.html?user_id=${n.candidate_id || user.objectId}`;

  return (
    <div
      key={n.id}
      onClick={() => markAsRead(n.id)}
      className={`p-4 flex gap-3 cursor-pointer border-b hover:bg-gray-50 ${
        n.is_read == 0 ? 'bg-blue-50' : ''
      }`}
    >
      {/* 🔴 red dot */}
      {n.is_read == 0 && (
        <span className="mt-2 w-2 h-2 bg-red-500 rounded-full"></span>
      )}

      <div>
        <p className="font-semibold">
          {n.type} Interview Scheduled
        </p>

        <p className="text-sm text-gray-600">
          {new Date(n.scheduled_time).toLocaleString()}
        </p>

        {/* ✅ Booking link */}
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-sm text-blue-600 underline mt-1 inline-block"
        >
          Book Interview
        </a>

        <p className="text-xs text-gray-500 mt-1">
          Status: {n.status}
        </p>
      </div>
    </div>
  );
})

            )}
          </div>
        </div>
      )}
    </div>
  );
}

