// mycode
// async function getApplicationsForJob(jobIndex) {
//   const response = await fetch(`/api/applications?jobIndex=${jobIndex}`);
//   if (!response.ok) {
//     throw new Error('Failed to fetch applications');
//   }
//   return await response.json();
// }


// async function getApplicationsForJob(jobIndex) {
//     window.alert(jobIndex);
//   // mock delay
//   await new Promise(res => setTimeout(res, 500));

//   return [
//     {
//       objectId: 'app1',
//       objectData: {
//         applicant_name: 'Rahul Sharma',
//         applicant_email: 'rahul@example.com',
//         applicant_phone: '9876543210',
//         applied_at: new Date().toISOString(),
//         cover_letter: 'I am very interested in this role.'
//       }
//     }
//   ];
// }
//mycode
function ApplicationViewer({ jobIndex, jobs = [], onBack }) {
  const [applications, setApplications] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [filterJobIndex, setFilterJobIndex] = React.useState(
    typeof jobIndex === 'number' ? jobIndex : ''
  );

  React.useEffect(() => {
    if (filterJobIndex !== '') {
      fetchApplications(filterJobIndex);
    } else {
      setApplications([]);
    }
  }, [filterJobIndex]);

  React.useEffect(() => {
    if (typeof jobIndex === 'number') {
      setFilterJobIndex(jobIndex);
    }
  }, [jobIndex]);

  const fetchApplications = async (index) => {
    try {
      setLoading(true);
      const apps = await getApplicationsForJob(index);
      setApplications(apps);
    } catch (error) {
      console.error('Failed to fetch applications', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedJob = jobs[filterJobIndex];

  return (
    <div className="space-y-6" data-name="application-viewer">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
            ←
          </button>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Viewing Candidates For
            </label>

            <select
              className="block w-64 border-b-2 border-gray-200 bg-transparent text-sm"
              value={filterJobIndex}
              onChange={(e) =>
                setFilterJobIndex(e.target.value === '' ? '' : Number(e.target.value))
              }
            >
              <option value="">Select a job...</option>
              {jobs.map((job, index) => (
                <option key={index} value={index}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium">
          {applications.length} Applicants
        </span>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">Loading…</div>
      ) : filterJobIndex === '' ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed">
          Please select a job to view candidates.
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed">
          No applications yet.
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs">Candidate</th>
                <th className="px-6 py-3 text-left text-xs">Contact</th>
                <th className="px-6 py-3 text-left text-xs">Applied</th>
                <th className="px-6 py-3 text-left text-xs">Cover Letter</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.objectId} className="border-t">
                  <td className="px-6 py-4">
                    {app.objectData.applicant_name}
                  </td>
                  <td className="px-6 py-4">
                    {app.objectData.applicant_email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(app.objectData.applied_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {app.objectData.cover_letter || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
