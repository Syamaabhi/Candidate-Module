function Dashboard() {
    const [candidates, setCandidates] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [filter, setFilter] = React.useState('All');

    React.useEffect(() => {
        
        const auth = sessionStorage.getItem("auth_user");

    if (!auth) {
      window.location.href = "/login.html";
      return;
    }
  

        const fetchData = async () => {
            
            try {
                 const response= await fetch('fetch_jobs_applications.php');
                const data = await response.json();
                // const data = await db.getAllCandidates();
                setCandidates(data);
                
                // Initialize Charts (Mock data for now or aggregate real data)
                // If using Chart.js, we would do it here or in a sub-component
            } catch (error) {
                console.error("Dashboard fetch error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);




    const filteredCandidates =
  filter === 'All'
    ? candidates
    : candidates.filter(c => c.status === filter);


   const exportToCSV = () => {
  const headers = ["ID", "Name", "Email", "Role ID", "Status", "Tech Score", "Comm Score", "Decision Reason"];
  const rows = filteredCandidates.map(c => [
    c.id, // Use candidate.id directly
    c.applicant_name, // Use candidate.applicant_name directly
    c.email, // Use candidate.email directly
    c.job_id, // Use candidate.job_id directly
    c.status, // Use candidate.status directly
    c.score_technical, // Use candidate.score_technical directly
    c.score_communication, // Use candidate.score_communication directly
    `"${c.ai_decision_reason || ''}"` // Escape commas
  ]);

  const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "candidates_export.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


    if (loading) return <div className="p-12 text-center">Loading Dashboard...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Recruiter Dashboard
                    </h2>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                    <button 
                        onClick={exportToCSV}
                        className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                        <div className="icon-download mr-2 -ml-1 text-gray-500"></div>
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
               <StatCard
  title="Qualified"
  value={candidates.filter(c => c.status === 'Qualified').length}
/>

<StatCard
  title="Rejected"
  value={candidates.filter(c => c.status === 'Rejected').length}
/>

<StatCard
  title="Pending"
  value={candidates.filter(
    c => c.status === 'Interviewing' || c.status === 'Applied'
  ).length}
/>

            </div>

            {/* Candidate List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Candidate Evaluations</h3>
                    <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                        className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Applied">Applied</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
                <ul className="divide-y divide-gray-200">
                 {filteredCandidates.map(candidate => (
  <li key={candidate.id}>
    <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
            {candidate.applicant_name?.charAt(0)}
          </div>

          <div className="ml-4">
            <div className="text-sm font-medium text-blue-600 truncate">
              {candidate.applicant_name}
            </div>

            <div className="text-sm text-gray-500">
              {candidate.applicant_email}
            </div>
          </div>
        </div>

        <div className="ml-2 flex flex-col items-end">
          <StatusBadge status={candidate.status} />

          <div className="mt-2 text-xs text-gray-500">
            AI Score: <span className="font-semibold">{candidate.ai_score}</span>
          </div>
        </div>
      </div>
    </div>
  </li>
))}

                    {filteredCandidates.length === 0 && (
                        <li className="px-4 py-8 text-center text-gray-500">No candidates found with this filter.</li>
                    )}
                </ul>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }) {
    const colorClasses = {
        blue: "bg-blue-500",
        green: "bg-green-500",
        red: "bg-red-500",
        yellow: "bg-yellow-500"
    };

    return (
        <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className={`rounded-md p-3 ${colorClasses[color]} bg-opacity-10`}>
                            <div className={`${icon} text-xl text-${color}-600`}></div> 
                            {/* Note: Tailwind dynamic classes might not work with arbitrary values without safelist, using style or explicit map is safer but for now standard colors should work if pre-compiled or CDN JIT handles it.
                                However, CDN Tailwind JIT mode (script) works client side scanning classes. 
                                Safer to use explicit color text class in prop if needed or static map. 
                                Let's fix icon color since dynamic string interpolation for color usually fails in purge if not seen.
                            */}
                        </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                            <dd>
                                <div className="text-lg font-medium text-gray-900">{value}</div>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        'Applied': 'bg-gray-100 text-gray-800',
        'Interview Pending': 'bg-yellow-100 text-yellow-800',
        'Interviewing': 'bg-blue-100 text-blue-800',
        'Qualified': 'bg-green-100 text-green-800',
        'Rejected': 'bg-red-100 text-red-800'
    };
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
}

function App() {
  return (
    <div data-name="admin-app" data-file="admin-app.js">
      <Header />
      <main>
        <Dashboard />
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);