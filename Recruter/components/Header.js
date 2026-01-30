function Header({ user, onNavigate, onLogout }) {

  const handleLogoClick = () => {
    if (!user) {
      window.location.replace('http://localhost/candidatemodule/public/');
      return;
    }

    window.location.replace('http://localhost/candidatemodule/public/');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* LEFT: Logo */}
          <div className="flex items-center">
            {/* <div
              className="flex items-center cursor-pointer"
              onClick={handleLogoClick}
            >
              <div className="w-8 h-8 rounded bg-[var(--primary)] flex items-center justify-center mr-2">
                <div className="icon-briefcase text-white text-lg"></div>
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                JobSeekh
              </span>
            </div> */}
          </div>

          {/* RIGHT: Dashboard actions */}
          <div className="flex items-center space-x-4">

            {/* Notifications */}
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 relative">
              <div className="icon-bell text-xl"></div>
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
            </button>

            {/* Profile */}
            <button
              onClick={() => onNavigate('dashboard-profile')}
              className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300"
            >
              <div className="icon-user text-lg"></div>
            </button>

            {/* Logout */}
            <button
              onClick={() => {
                onLogout();
                window.location.replace('http://localhost/');
              }}
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Sign out
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}


// function Header({ onNavigate, onLogout }) {
//   return (
//     <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">

//           {/* LEFT: Logo (dashboard only) */}
//           <div className="flex items-center">
//             <div
//               className="flex items-center cursor-pointer"
//   onClick={() => {if (!user) {
//       // Block access
//       alert('Please login to access dashboard');
//       window.location.href = 'http://localhost/login';
//       return;
//     }

//     window.location.href = 'http://localhost/candidatemodule/public/';
//   }}
//             >
//               <div className="w-8 h-8 rounded bg-[var(--primary)] flex items-center justify-center mr-2">
//                 <div className="icon-briefcase text-white text-lg"></div>
//               </div>
//               <span className="text-xl font-bold text-gray-900 tracking-tight">
//                 JobSeekh
//               </span>
//             </div>
//           </div>

//           {/* RIGHT: Dashboard actions only */}
//           <div className="flex items-center space-x-4">

//             {/* Notifications */}
//             <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 relative">
//               <span className="sr-only">Notifications</span>
//               <div className="icon-bell text-xl"></div>
//               <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
//             </button>

//             {/* Profile */}
//             <button
//               onClick={() => onNavigate('dashboard-profile')}
//               className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300"
//             >
//               <div className="icon-user text-lg"></div>
//             </button>

//             {/* Logout */}
//             <button
//               onClick={() => {
//                 onLogout();
//                 window.location.replace('http://localhost/');
//               }}
//               className="text-sm font-medium text-gray-600 hover:text-gray-900"
//             >
//               Sign out
//             </button>

//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }
