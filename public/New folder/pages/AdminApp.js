// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error('Admin Error:', error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return <div className="p-8 text-center text-red-600">Something went wrong in the Admin Panel.</div>;
    }
    return this.props.children;
  }
}

function AdminApp() {
    const [selectedJobIndex, setSelectedJobIndex] = React.useState(null);

    const [jobs, setJobs] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [activeTab, setActiveTab] = React.useState('jobs'); // 'jobs' | 'applications'
    const [selectedJobId, setSelectedJobId] = React.useState(null);
    const [isPostJobModalOpen, setIsPostJobModalOpen] = React.useState(false);
    const [alert, setAlert] = React.useState(null);
    const [stats, setStats] = React.useState({ totalJobs: 0, totalApplications: 0 });

    React.useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const jobsData = await getJobs();
            
            // Sort by posted_at desc
            // const sortedJobs = jobsData.sort((a, b) => 
            //     new Date(b.objectData.posted_at) - new Date(a.objectData.posted_at)
            // );
            
            setJobs(jobsData);
             
            // Mock stats calculation (in real app, would query DB count)
            // setStats({
            //     totalJobs: jobsData.length,
            //     totalApplications: 0 // We'll update this when fetching applications or add a counter in DB
            // });
        } catch (error) {
            showAlert('error', 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const showAlert = (type, message) => {
        setAlert({ type, message });
        setTimeout(() => setAlert(null), 5000);
    };

    const handleDeleteJob = async (jobId) => {
        if (!confirm('Are you sure you want to delete this job listing?')) return;
        try {
            await db.deleteJob(jobId);
            // setJobs(prev => prev.filter(j => j.objectId !== jobId));
            setJobs(prev => prev.filter((_, i) => i !== jobId));
            showAlert('success', 'Job listing deleted successfully');
        } catch (error) {
            showAlert('error', 'Failed to delete job');
        }
    };

    const handleCreateJob = async (jobData) => {
    //   window.alert(JSON.stringify(jobData));
        try {
            
            const newJob = await createJob(jobData);
            setJobs(prev => [newJob, ...prev]);
            setIsPostJobModalOpen(false);
            showAlert('success', 'New job posted successfully');
        } catch (error) {
            showAlert('error', 'Failed to post job');
        }
    };

    const [selectedJob, setSelectedJob] = React.useState(null);

const handleViewApplications = (job) => {
  setSelectedJob(job);
  setActiveTab('applications');
};

    

    return (
        <div className="min-h-screen bg-[var(--bg-light)] flex flex-col" data-name="admin-app">
            <AdminHeader />
            
            {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

            <div className="flex flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
                {/* Sidebar Navigation */}
                <aside className="w-64 flex-shrink-0 hidden lg:block">
                    <nav className="space-y-1">
                        <button 
                            onClick={() => { setActiveTab('jobs'); setSelectedJobId(null); }}
                            className={`w-full nav-link ${activeTab === 'jobs' ? 'active' : ''}`}
                        >
                            <div className="icon-briefcase mr-3 text-lg"></div>
                            Manage Jobs
                        </button>
                        <button 
                            onClick={() => { setActiveTab('applications'); }}
                            className={`w-full nav-link ${activeTab === 'applications' ? 'active' : ''}`}
                        >
                            <div className="icon-users mr-3 text-lg"></div>
                            Candidates
                        </button>
                        <button className="w-full nav-link">
                            <div className="icon-settings mr-3 text-lg"></div>
                            Settings
                        </button>
                    </nav>

                    <div className="mt-8 bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <h4 className="font-semibold text-blue-900 mb-2">Pro Tip</h4>
                        <p className="text-sm text-blue-800">Complete your company profile to attract 2x more candidates.</p>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 min-w-0">
                    {/* Header Action Bar */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {activeTab === 'jobs' ? 'Job Listings' : 'Candidate Applications'}
                            </h1>
                            <p className="text-gray-500 mt-1">
                                {activeTab === 'jobs' 
                                    ? `Managing ${jobs.length} active listings` 
                                    : selectedJobId 
                                        ? `Viewing applicants for selected job`
                                        : 'Select a job to view applicants'
                                }
                            </p>
                        </div>
                        {activeTab === 'jobs' && (
                            <button 
                                onClick={() => setIsPostJobModalOpen(true)}
                                className="btn btn-primary"
                            >
                                <div className="icon-plus mr-2"></div>
                                Post New Job
                            </button>
                        )}
                    </div>

                    {/* Content Switcher */}
                    {activeTab === 'jobs' ? (
                        <div className="space-y-4">
                            {loading ? (
                                <div className="animate-pulse space-y-4">
                                    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>)}
                                </div>
                            ) : jobs.length > 0 ? (
                                jobs.map((job, index) => (
                                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
                                        <div className="flex-1">
                                            <div className="flex items-center mb-1">
                                                <h3 className="text-lg font-bold text-gray-900 mr-3">{job.title}</h3>
                                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {job.type}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-500 flex items-center gap-4">
                                                <span className="flex items-center">
                                                    <div className="icon-map-pin w-4 h-4 mr-1"></div>
                                                    {job.location}
                                                </span>
                                                <span className="flex items-center">
                                                    <div className="icon-calendar w-4 h-4 mr-1"></div>
                                                   Posted {new Date(job.posted_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 w-full sm:w-auto">
                                           <button
  onClick={() => {
    setSelectedJobIndex(index);
    setActiveTab('applications');
  }}
  className="btn btn-outline"
>
  View Applicants
</button>

                                            <button 
                                                onClick={() => handleDeleteJob(job.objectId)}
                                                className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                                                title="Delete Job"
                                            >
                                                <div className="icon-trash-2 text-xl"></div>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                                    <div className="icon-briefcase text-4xl text-gray-300 mx-auto mb-3"></div>
                                    <h3 className="text-lg font-medium text-gray-900">No jobs posted yet</h3>
                                    <p className="text-gray-500 mb-4">Get started by creating your first job listing.</p>
                                    <button onClick={() => setIsPostJobModalOpen(true)} className="btn btn-primary">Post Job</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <ApplicationViewer
  jobIndex={selectedJobIndex}
  jobs={jobs}
  onBack={() => {
    setSelectedJobIndex(null);
    setActiveTab('jobs');
  }}
/>


                    )}
                </main>
            </div>

            {/* Post Job Modal */}
            <Modal
                isOpen={isPostJobModalOpen}
                onClose={() => setIsPostJobModalOpen(false)}
                title="Create New Job Listingrrrrrrrrrrrr"
            >
                <PostJobModal 
                    onSubmit={handleCreateJob}
                    onCancel={() => setIsPostJobModalOpen(false)}
                />
            </Modal>
        </div>
    );
}

