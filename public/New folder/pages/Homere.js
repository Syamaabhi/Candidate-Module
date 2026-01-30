// Important: DO NOT remove this `ErrorBoundary` component.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <div className="icon-triangle-alert text-2xl text-red-600"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-6">We're sorry, but something unexpected happened.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function Home() {
//   try {
    
    const [jobs, setJobs] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedJob, setSelectedJob] = React.useState(null);
    const [isApplicationModalOpen, setIsApplicationModalOpen] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [alert, setAlert] = React.useState(null); // { type, message }

    // Search filters state
    const [searchTerm, setSearchTerm] = React.useState('');
    const [locationFilter, setLocationFilter] = React.useState('');
 React.useEffect(() => {
    fetchJobs();
}, []); // run only once on mount

const fetchJobs = async () => {
  try {
    setLoading(true);
    const data = await getJobs();
    console.log("Fetched jobs:", data); // for DevTools
    
    setJobs(data);
  } catch (e) {
    window.alert("Failed to load jobs");
  } finally {
    setLoading(false);
  }
};

    const showAlert = (type, message) => {
      setAlert({ type, message });
      // Auto dismiss after 5 seconds
      setTimeout(() => setAlert(null), 5000);
    };

    const handleApplyClick = (job) => {
        console.log("Apply clicked:", job);
      setSelectedJob(job);
      setIsApplicationModalOpen(true);
    };

    const handleApplicationSubmit = async (formData) => {
        window.alert(formData);
      if (!selectedJob) return;

      try {
        setIsSubmitting(true);
        const applicationData = {
  job_title: selectedJob.title,
  job_company: selectedJob.company,
  ...formData,
  applied_at: new Date().toISOString()
};

//mm
 const data = await submitApplication(applicationData);
  
        setIsApplicationModalOpen(false);
        setSelectedJob(null);
        showAlert('success', 'Application submitted successfully! Good luck!');
      } catch (error) {
        showAlert('error', 'Failed to submit application. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    };

  const filteredJobs = jobs.filter(job => {
  const { title, company, location } = job;
  if (!title || !company || !location) return false;
  return (
    (title + company).toLowerCase().includes(searchTerm.toLowerCase()) &&
    location.toLowerCase().includes(locationFilter.toLowerCase())
  );
});
//gg



    return (
        
      <div className="min-h-screen bg-[var(--bg-light)]" data-name="app">
        <Header />

        {/* Alert Container */}
        {alert && (
            <Alert 
                type={alert.type} 
                message={alert.message} 
                onClose={() => setAlert(null)} 
            />
        )}

        {/* Hero / Search Section */}
        <div className="bg-[var(--primary)] py-12 sm:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
                    Find your dream job now
                </h1>
                <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                    5 lakh+ jobs for you to explore
                </p>
                
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-2 sm:p-4 flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 flex items-center px-4 py-2 border-b sm:border-b-0 sm:border-r border-gray-200">
                        <div className="icon-search text-gray-400 mr-3 text-xl"></div>
                        <input 
                            type="text" 
                            placeholder="Skills, Designations, Companies"
                            className="w-full outline-none text-gray-700 placeholder-gray-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex-1 flex items-center px-4 py-2 border-b sm:border-b-0 sm:border-r border-gray-200">
                         <div className="icon-map-pin text-gray-400 mr-3 text-xl"></div>
                         <select 
                            className="w-full outline-none text-gray-700 bg-transparent cursor-pointer"
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                        >
                             <option value="">All Locations</option>
                             <option value="Remote">Remote</option>
                             <option value="Bangalore">Bangalore</option>
                             <option value="Mumbai">Mumbai</option>
                             <option value="Delhi">Delhi</option>
                             <option value="Hyderabad">Hyderabad</option>
                         </select>
                    </div>
                    <button className="btn btn-primary px-8 rounded-lg shadow-md">
                        Search
                    </button>
                </div>
            </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Filters Sidebar (Mock) */}
                <div className="hidden lg:block lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-24">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900">All Filters</h3>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">Work Mode</h4>
                                <div className="space-y-2">
                                    {['Work from office', 'Remote', 'Hybrid'].map((mode) => (
                                        <label key={mode} className="flex items-center">
                                            <input type="checkbox" className="rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]" />
                                            <span className="ml-2 text-sm text-gray-600">{mode}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                             <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">Experience</h4>
                                <div className="space-y-2">
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
                                        <div className="bg-[var(--primary)] h-1.5 rounded-full" style={{width: '45%'}}></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>0 Yrs</span>
                                        <span>30 Yrs</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">Department</h4>
                                <div className="space-y-2">
                                    {['Engineering', 'Design', 'Product', 'Sales', 'Marketing'].map((dept) => (
                                        <label key={dept} className="flex items-center">
                                            <input type="checkbox" className="rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]" />
                                            <span className="ml-2 text-sm text-gray-600">{dept}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Job List */}
                <div className="col-span-1 lg:col-span-3">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">
                            {filteredJobs.length} Jobs Based on your search
                        </h2>
                        <div className="flex items-center text-sm text-gray-500">
                            <span>Sort by:</span>
                            <select className="ml-2 border-none bg-transparent font-medium text-gray-900 focus:ring-0 cursor-pointer">
                                <option>Relevance</option>
                                <option>Date Posted</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
                                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredJobs.length > 0 ? (
                                filteredJobs.map((job, index) => (
      <JobCard 
          key={index} 
          job={job} 
          onApply={handleApplyClick} 
      />
  ))
                            ) : (
                                <div className="bg-white rounded-xl p-10 text-center border border-gray-100">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                        <div className="icon-search-x text-2xl text-gray-400"></div>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
                                    <p className="text-gray-500">Try adjusting your search filters.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </main>

        {/* Application Modal */}
        <Modal 
            isOpen={isApplicationModalOpen} 
            onClose={() => setIsApplicationModalOpen(false)}
            title="Apply for Job"
        >
            {selectedJob && (
                <JobApplicationForm 
                    job={selectedJob}
                    onSubmit={handleApplicationSubmit}
                    onCancel={() => setIsApplicationModalOpen(false)}
                    isSubmitting={isSubmitting}
                />
            )}
        </Modal>
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-12 py-10">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                     <span className="text-xl font-bold text-gray-900 tracking-tight flex items-center">
                        <div className="icon-briefcase text-[var(--primary)] mr-2"></div>
                        JobSeek
                     </span>
                     <p className="text-sm text-gray-500 mt-2">Connecting talent with opportunity.</p>
                </div>
                <div className="flex space-x-6 text-sm text-gray-500">
                    <a href="#" className="hover:text-[var(--primary)]">About Us</a>
                    <a href="#" className="hover:text-[var(--primary)]">Privacy Policy</a>
                    <a href="#" className="hover:text-[var(--primary)]">Terms & Conditions</a>
                    <a href="#" className="hover:text-[var(--primary)]">Contact</a>
                </div>
                <div className="mt-4 md:mt-0 text-sm text-gray-400">
                    &copy; 2026 JobSeek. All rights reserved.
                </div>
             </div>
        </footer>
      </div>
      
    );
//   } catch (error) {
//     console.error('App component error:', error);
//     return null;
//   }
}

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <ErrorBoundary>
//     <App />
//   </ErrorBoundary>
// );

