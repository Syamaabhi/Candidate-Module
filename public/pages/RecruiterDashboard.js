function RecruiterDashboard({ user, onNavigate }) {
  const [activeTab, setActiveTab] = React.useState('jobs');
  const [jobs, setJobs] = React.useState([]);
  const [newJob, setNewJob] = React.useState({
      title: '',
      description: '',
      skills: '',
      experience_level: 'Entry',
      min_ai_score: 70
  });
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
      loadJobs();
  }, [user]);

  const loadJobs = async () => {
      try {
          const allJobs = await apiGetJobs();
          // Filter jobs created by this recruiter
          const myJobs = allJobs.filter(j => j.recruiter_id === user.id);
          setJobs(myJobs);
      } catch (error) {
          console.error(error);
      }
  };

  const handleCreateJob = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
          const jobData = {
              ...newJob,
              recruiter_id: user.id,
              skills: newJob.skills.split(',').map(s => s.trim())
          };
          await apiCreateJob(jobData);
          setNewJob({ title: '', description: '', skills: '', experience_level: 'Entry', min_ai_score: 70 });
          setActiveTab('jobs');
          loadJobs(); // refresh list
      } catch (error) {
          alert('Failed to create job: ' + error.message);
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="space-y-6">
        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
                <button
                    onClick={() => setActiveTab('jobs')}
                    className={`${activeTab === 'jobs' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                    Manage Jobs
                </button>
                <button
                    onClick={() => setActiveTab('create')}
                    className={`${activeTab === 'create' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                    Post New Job
                </button>
            </nav>
        </div>

        {activeTab === 'jobs' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                 <ul className="divide-y divide-gray-200">
                    {jobs.length === 0 ? (
                        <li className="px-6 py-4 text-center text-gray-500">You haven't posted any jobs yet.</li>
                    ) : (
                        jobs.map(job => (
                            <li key={job.id} className="px-6 py-4 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                                        <div className="text-sm text-gray-500 mt-1">
                                            {job.experience_level} • Min Score: {job.min_ai_score}
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Active
                                    </span>
                                </div>
                            </li>
                        ))
                    )}
                 </ul>
            </div>
        )}

        {activeTab === 'create' && (
            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Post a new job position</h3>
                    <form onSubmit={handleCreateJob} className="mt-5 space-y-6">
                        <Input 
                            label="Job Title"
                            value={newJob.title}
                            onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                            required
                        />
                        
                        <Input 
                            label="Description"
                            type="textarea"
                            value={newJob.description}
                            onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                            required
                        />

                        <Input 
                            label="Required Skills (comma separated)"
                            value={newJob.skills}
                            onChange={(e) => setNewJob({...newJob, skills: e.target.value})}
                            placeholder="React, Node.js, Python"
                            required
                        />

                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                             <Input 
                                label="Experience Level"
                                type="select"
                                value={newJob.experience_level}
                                onChange={(e) => setNewJob({...newJob, experience_level: e.target.value})}
                                options={[
                                    { value: 'Entry', label: 'Entry Level' },
                                    { value: 'Mid', label: 'Mid Level' },
                                    { value: 'Senior', label: 'Senior Level' },
                                    { value: 'Lead', label: 'Lead / Manager' }
                                ]}
                            />
                             <Input 
                                label="Minimum AI Score (0-100)"
                                type="number"
                                value={newJob.min_ai_score}
                                onChange={(e) => setNewJob({...newJob, min_ai_score: parseInt(e.target.value)})}
                                required
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Posting...' : 'Post Job'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
}