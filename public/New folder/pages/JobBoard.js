function JobBoard({ user, onNavigate }) {
  const [jobs, setJobs] = React.useState([]);
  const [myApplications, setMyApplications] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [allJobs, apps] = await Promise.all([
          apiGetJobsw(),
          user ? apiGetMyApplications(user.id) : Promise.resolve([])
      ]);
      
    //   alert(JSON.stringify(allJobs));
    //   alert(allJobs);
      setJobs(allJobs);
      setMyApplications(apps);
    } catch (error) {
      console.error("Failed to load jobs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (job) => {
    alert("tte");
      if (!user) {
          onNavigate('login');
          return;
      }
      try {
          await apiApplyForJob({
              job_id: job.id,
              candidate_id: user.id
          });
          // Refresh state
          const apps = await apiGetMyApplications(user.id);
          setMyApplications(apps);
      } catch (error) {
          alert('Failed to apply: ' + error.message);
      }
  };

  const filteredJobs = jobs.filter(job => {
      const skillsArray = Array.isArray(job.skills) ? job.skills : (typeof job.skills === 'string' ? job.skills.split(',') : []);
      return job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skillsArray.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Available Positions</h1>
            <div className="mt-4 sm:mt-0 sm:w-1/3">
                 <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <div className="icon-search text-gray-400"></div>
                    </div>
                    <input
                        type="text"
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                        placeholder="Search jobs or skills..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                 </div>
            </div>
        </div>

        {loading ? (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        ) : (
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map(job => (
                        <JobCard 
                            key={job.id} 
                            job={job} 
                            onApply={handleApply}
                            isApplied={myApplications.some(app => app.job_id === job.id)}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                        No jobs found matching your criteria.
                    </div>
                )}
            </div>
        )}
    </div>
  );
}