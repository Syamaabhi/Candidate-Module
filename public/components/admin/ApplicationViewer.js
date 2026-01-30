function ApplicationViewer({ jobId, jobs, onBack }) {
    const [applications, setApplications] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [filterJobId, setFilterJobId] = React.useState(jobId || '');

    React.useEffect(() => {
        if (filterJobId) {
            fetchApplications(filterJobId);
        } else {
            setApplications([]); // Clear or fetch all if needed
        }
    }, [filterJobId]);

    // Update internal state if prop changes
    React.useEffect(() => {
        if (jobId) setFilterJobId(jobId);
    }, [jobId]);

    const fetchApplications = async (id) => {
        try {
            setLoading(true);
            const apps = await db.getApplicationsForJob(id);
            setApplications(apps);
        } catch (error) {
            console.error('Failed to fetch applications', error);
        } finally {
            setLoading(false);
        }
    };

    const selectedJobTitle = jobs.find(j => j.objectId === filterJobId)?.objectData.title || 'Unknown Job';

    return (
        <div className="space-y-6" data-name="application-viewer">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                        <div className="icon-arrow-left text-xl"></div>
                    </button>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Viewing Candidates For</label>
                        <select 
                            className="block w-full sm:w-64 pl-0 pr-8 py-1 border-b-2 border-gray-200 focus:border-[var(--primary)] text-gray-900 font-medium focus:ring-0 bg-transparent text-sm cursor-pointer"
                            value={filterJobId}
                            onChange={(e) => setFilterJobId(e.target.value)}
                        >
                            <option value="" disabled>Select a job...</option>
                            {jobs.map(job => (
                                <option key={job.objectId} value={job.objectId}>{job.objectData.title}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-50 text-[var(--primary)] rounded-lg text-sm font-medium">
                        {applications.length} Applicants
                    </span>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                        <div className="icon-download text-xl"></div>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="icon-loader animate-spin text-3xl text-[var(--primary)]"></div>
                </div>
            ) : !filterJobId ? (
                 <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                    <div className="icon-users text-4xl text-gray-300 mx-auto mb-3"></div>
                    <p className="text-gray-500">Please select a job to view candidates.</p>
                </div>
            ) : applications.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                    <div className="icon-inbox text-4xl text-gray-300 mx-auto mb-3"></div>
                    <h3 className="text-lg font-medium text-gray-900">No applications yet</h3>
                    <p className="text-gray-500">Candidates who apply will appear here.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cover Letter</th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {applications.map((app) => (
                                    <tr key={app.objectId} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                                    {app.objectData.applicant_name.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{app.objectData.applicant_name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{app.objectData.applicant_email}</div>
                                            <div className="text-sm text-gray-500">{app.objectData.applicant_phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(app.objectData.applied_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-500 line-clamp-2 max-w-xs" title={app.objectData.cover_letter}>
                                                {app.objectData.cover_letter || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-[var(--primary)] hover:text-[var(--primary-dark)] mr-3">View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}