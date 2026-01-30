function Dashboard({ user, onNavigate }) {
  const [applications, setApplications] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [activeInterview, setActiveInterview] = React.useState(null);
  const [notifications, setNotifications] = React.useState([]);

  React.useEffect(() => {
    loadApplications();
  }, [user]);

  const loadApplications = async () => {
   
    if (!user) return;
    try {
      //const apps = await apiGetMyApplications(user.id);
      const apps = await apiGetMyApplications(3);
      setApplications(apps);
      generateNotifications(apps);
    } catch (error) {
      console.error("Failed to load applications", error);
    } finally {
      setLoading(false);
    }
  };

  const generateNotifications = (apps) => {
      const notifs = [];
      // Mock notifications based on app status
      apps.forEach(app => {
          if (app.status === 'Interviewing' && !app.ai_score) {
              notifs.push({
                  id: Date.now() + Math.random(),
                  type: 'action',
                  message: `Interview pending for ${app.job_title}`,
                  action: () => handleStartInterview(app)
              });
          }
          if (app.status === 'Offer') {
             notifs.push({
                  id: Date.now() + Math.random(),
                  type: 'success',
                  message: `Congratulations! You received an offer for ${app.job_title}`
              });
          }
      });
      
      // Profile completion check
      if (!user.resume_url) {
          notifs.push({
              id: 'resume-missing',
              type: 'warning',
              message: 'Please upload your resume to improve your chances.',
              link: 'profile'
          });
      }
      
      setNotifications(notifs);
  };

  const handleStartInterview = (app) => {
      setActiveInterview(app);
  };

  const handleCompleteInterview = async (score) => {
      try {
          await apiUpdateApplication(activeInterview.id, {
              ai_score: score,
              status: 'Screening', // Move to screening after interview
              interview_stage: 'Completed'
          });
          setActiveInterview(null);
          loadApplications(); // Reload to show new score
          alert(`Interview Completed! Your AI Score: ${score}`);
      } catch (error) {
          console.error('Failed to update interview score', error);
      }
  };

  if (activeInterview) {
      return (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 flex items-center justify-center p-4">
              <div className="w-full max-w-2xl">
                <InterviewSession 
                    application={activeInterview} 
                    onComplete={handleCompleteInterview}
                    onCancel={() => setActiveInterview(null)}
                />
              </div>
          </div>
      );
  }

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  const getStatusColor = (status) => {
      const map = {
          'Applied': 'bg-gray-100 text-gray-800',
          'Screening': 'bg-blue-100 text-blue-800',
          'Interviewing': 'bg-purple-100 text-purple-800',
          'Offer': 'bg-green-100 text-green-800',
          'Rejected': 'bg-red-100 text-red-800'
      };
      return map[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Candidate Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">Track your applications and interviews</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <div className="bg-white overflow-hidden shadow rounded-lg p-5 border-l-4 border-blue-500">
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Apps</dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">{applications.filter(a => a.status !== 'Rejected').length}</dd>
                 </div>
                 <div className="bg-white overflow-hidden shadow rounded-lg p-5 border-l-4 border-purple-500">
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg Score</dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">
                         {applications.filter(a => a.ai_score > 0).length > 0
                            ? Math.round(applications.filter(a => a.ai_score > 0).reduce((acc, curr) => acc + (curr.ai_score || 0), 0) / applications.filter(a => a.ai_score > 0).length) 
                            : '-'}
                    </dd>
                 </div>
                 <div className="bg-white overflow-hidden shadow rounded-lg p-5 border-l-4 border-green-500">
                    <dt className="text-sm font-medium text-gray-500 truncate">Offers</dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">{applications.filter(a => a.status === 'Offer').length}</dd>
                 </div>
                  <div className="bg-white overflow-hidden shadow rounded-lg p-5 border-l-4 border-green-500">
                    <dt className="text-sm font-medium text-gray-500 truncate">Offers</dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">{applications.filter(a => a.status === 'Offer').length}</dd>
                 </div>
              </div>

              {/* Applications List */}
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Your Applicationskkkkkkkkkkkkk</h3>
                    <button onClick={() => onNavigate('jobs')} className="text-sm text-blue-600 hover:text-blue-500 font-medium"> &rarr;</button>
                </div>
                
                 <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">AI INTERVIEW</h3>
                    <a href="candidate-dashboard.html" className="btn btn-primary text-sm">
                                    ATTEND INTERVIEW
                                </a>
                    {/* <button onClick={() => onNavigate('jobs')} className="text-sm text-blue-600 hover:text-blue-500 font-medium">Find more jobs &rarr;</button> */}
                </div>
                <ul className="divide-y divide-gray-200">
                    {applications.length === 0 ? (
                        <li className="px-6 py-12 text-center text-gray-500">
                            <div className="icon-folder-open text-4xl mb-3 text-gray-300 mx-auto"></div>
                            <p>No applications yet.</p>
                        </li>
                    ) : (
                        applications.map((app) => (
                            <li key={app.id}>
                                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-blue-600 truncate">{app.job_title}</span>
                                            <span className="text-xs text-gray-500">Applied: {new Date(app.createdAt || Date.now()).toLocaleDateString()}</span>
                                        </div>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between items-center">
                                        <div className="sm:flex">
                                            <div className="mr-6 flex items-center text-sm text-gray-500">
                                                <div className="icon-brain-circuit mr-1.5 text-gray-400"></div>
                                                Score: <span className="font-semibold ml-1 text-gray-700">{app.ai_score ? app.ai_score : 'N/A'}</span>
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                <div className="icon-flag mr-1.5 text-gray-400"></div>
                                                Stage: {app.interview_stage || 'Initial'}
                                            </div>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm sm:mt-0">
                                            {app.status === 'Interviewing' && !app.ai_score && (
                                                <button 
                                                    onClick={() => handleStartInterview(app)}
                                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                    <div className="icon-circle-play mr-1"></div> Start Interview
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
              </div>
          </div>
          

          {/* Sidebar */}
          <div className="space-y-6">
              {/* Notifications */}
              <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <div className="icon-bell mr-2 text-gray-500"></div> Notifications
                  </h3>
                  <div className="space-y-3">
                      {notifications.length === 0 ? (
                          <p className="text-sm text-gray-500">No new notifications.</p>
                      ) : (
                          notifications.map(notif => (
                              <div key={notif.id} className={`p-3 rounded-md text-sm border ${
                                  notif.type === 'action' ? 'bg-blue-50 border-blue-100 text-blue-700' :
                                  notif.type === 'warning' ? 'bg-yellow-50 border-yellow-100 text-yellow-700' :
                                  'bg-green-50 border-green-100 text-green-700'
                              }`}>
                                  <p>{notif.message}</p>
                                  {notif.action && (
                                      <button 
                                        onClick={notif.action}
                                        className="mt-2 text-xs font-semibold underline hover:no-underline"
                                      >
                                          Take Action
                                      </button>
                                  )}
                                  {notif.link && (
                                      <button 
                                        onClick={() => onNavigate(notif.link)}
                                        className="mt-2 text-xs font-semibold underline hover:no-underline"
                                      >
                                          Go to {notif.link}
                                      </button>
                                  )}
                              </div>
                          ))
                      )}
                  </div>
              </div>

              {/* Pending Actions */}
              <div className="bg-white shadow rounded-lg p-6">
                   <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <div className="icon-list-check mr-2 text-gray-500"></div> Pending Actions
                  </h3>
                  <ul className="space-y-3">
                      {!user.resume_url && (
                          <li className="flex items-start">
                              <div className="icon-circle-alert text-yellow-500 mt-0.5 mr-2"></div>
                              <div className="text-sm">
                                  <p className="font-medium text-gray-900">Upload Resume</p>
                                  <button onClick={() => onNavigate('profile')} className="text-blue-600 hover:text-blue-500 text-xs">Update Profile &rarr;</button>
                              </div>
                          </li>
                      )}
                      {applications.some(a => a.status === 'Interviewing' && !a.ai_score) && (
                          <li className="flex items-start">
                              <div className="icon-video text-purple-500 mt-0.5 mr-2"></div>
                              <div className="text-sm">
                                  <p className="font-medium text-gray-900">Pending Interviews</p>
                                  <p className="text-gray-500 text-xs">You have interviews waiting.</p>
                              </div>
                          </li>
                      )}
                      {notifications.length === 0 && user.resume_url && (
                           <li className="text-sm text-gray-500">You're all caught up!</li>
                      )}
                  </ul>
              </div>
              
          </div>
      </div>
    </div>
  );
}