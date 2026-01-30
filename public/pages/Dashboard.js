function Dashboard({ user, onNavigate }) {
  const [applications, setApplications] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [activeInterview, setActiveInterview] = React.useState(null);
  const [notifications, setNotifications] = React.useState([]);
 const [resumeFile, setResumeFile] = React.useState(null);
  const [parsedData, setParsedData] = React.useState({ resume: [], github: [] });
      const [githubUser, setGithubUser] = React.useState('');
      const [step, setStep] = React.useState(1);
       const [finalSkills, setFinalSkills] = React.useState([]);
       
  React.useEffect(() => {
    loadApplications();
  }, [user]);
function handleApiError(error) {
  console.error("API Error:", error);

  if (error?.message) {
    alert(error.message);
  } else {
    alert("Something went wrong. Please try again.");
  }
}

  const loadApplications = async () => {
    if (!user) return;
    console.log(user.user_id);
   
try {
    console.log("Applications");

    setLoading(true);

    const apps = await apiGetMyApplications(user.user_id);
    console.log("Applications:", apps);

    setApplications(apps);
    generateNotifications(apps); 
  } catch (error) {
    handleApiError(error);
  } finally {
    setLoading(false);
  }

//     try {
//       //const apps = await apiGetMyApplications(user.id);
//       const apps = await apiGetMyApplications(user.user_id);
//       console.log(apps);
//        console.log("Applications from API:", apps);
// console.log("User object:", user);
// console.log("apps passed to notifications:", apps);

//       setApplications(apps);
//       generateNotifications(apps);
//     } catch (error) {
//       //console.error("Failed to load applications", error);
//     } finally {
//       setLoading(false);
//     }
  };

  const generateNotifications = (apps) => {
   // console.log(apps);
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
    //   if (!user.user_resume_url) {
    if (!user.resume_url) {
          notifs.push({
              id: 'resume-missing',
              type: 'warning',
              message: 'Please upload your resume to improve your chancesyaa.',
              link: 'profile'
          });
      }
      
      setNotifications(notifs);
  };
const handleGithubAnalyze = async () => {
    if (githubUser.includes("github.com")) {
  alert("Please enter only the GitHub username");
  return;
}

    if (!githubUser) return;
    setLoading(true);
    try {
        const result = await fetchGithubSkills(githubUser);
        console.log(result);
        setParsedData(prev => ({ ...prev, github: result.skills }));
    } catch (err) {
        alert("Failed to analyze GitHub");
    } finally { setLoading(false); }
};


const fetchGithubSkills = async (username) => {
  try {
    const cleanUsername = username.replace("https://github.com/", "").trim();

    const reposRes = await fetch(`https://api.github.com/users/${cleanUsername}/repos`);
    const repos = await reposRes.json();

    if (!Array.isArray(repos)) throw new Error("User not found");

    const skillMap = {};

    for (const repo of repos) {
        console.log("priya");
      const langRes = await fetch(repo.languages_url);
      const languages = await langRes.json();
 //console.log(langRes);
      // If languages detected
      if (languages && Object.keys(languages).length > 0) {
        Object.keys(languages).forEach(lang => {
          skillMap[lang] = (skillMap[lang] || 0) + 1;
        });
      } 
      // Fallback: repo name inference
      else {
        const name = repo.name.toLowerCase();
        if (name.includes("react")) skillMap["React"] = (skillMap["React"] || 0) + 1;
        if (name.includes("laravel")) skillMap["PHP"] = (skillMap["PHP"] || 0) + 1;
         if (name.includes("html")) skillMap["HTML"] = (skillMap["HTML"] || 0) + 1;
        if (name.includes("node")) skillMap["JavaScript"] = (skillMap["JavaScript"] || 0) + 1;
      }
    }

    return {
      skills: Object.entries(skillMap).map(([name, count]) => ({
        name,
        score: Math.min(10, count * 2),
        source: "GitHub"
      }))
    };

  } catch (err) {
    console.error("GitHub parse failed", err);
    return { skills: [] };
  }
};
  const handleStartInterview = (app) => {
      setActiveInterview(app);
  };
const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  if (!allowedTypes.includes(file.type)) {
    alert("Only PDF, DOC, or DOCX files are allowed.");
    e.target.value = "";
    return;
  }

  setLoading(true);

  try {
    const result = await parseResumeAPI(file, 2);

    console.log("Resume API result:", result);

    if (result.success && Array.isArray(result.skills) && result.skills.length > 0) {
      setParsedData(prev => ({ ...prev, resume: result.skills }));
    } else {
      alert("Failed to parse resume");
    }

  } catch (err) {
    console.error(err);
    alert("Failed to parse resume");
  } finally {
    setLoading(false);
  }
};
const parseResumeAPI = async (file, candidateId) => {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("candidate_id", candidateId);

  const res = await fetch("http://localhost/testremote/upload_resume.php", {
    method: "POST",
    body: formData
  });

  return await res.json();
};
  const generateReport = async () => {
        const final = calculateFinalScore(parsedData.resume, parsedData.github);
        setFinalSkills(final);
        setStep(2);
        
        // Save score to DB
        if (currentUser) {
            const avgScore = final.reduce((acc, curr) => acc + curr.score, 0) / final.length || 0;
            await safeUpdateObject('candidate', currentUser.objectId, {
                overall_score: parseFloat(avgScore.toFixed(1))
            });
            console.log(overall_score);
        }
        
        localStorage.setItem('candidateSkills', JSON.stringify(final));
        if (currentUser) localStorage.setItem('candidateId', currentUser.objectId);
    };
    const calculateFinalScore = (resumeSkills, githubSkills) => {
    // A simple mock normalization logic
    const allSkills = {};

    // Process Resume (30% weight in mock logic context, but here we just merge)
    resumeSkills.forEach(s => {
        if (!allSkills[s.name]) allSkills[s.name] = { score: 0, sources: [] };
        // Normalize 0-1 to 0-10
        allSkills[s.name].score += (s.confidence * 10) * 0.4; 
        allSkills[s.name].sources.push('Resume');
    });

    // Process GitHub (50% weight)
    githubSkills.forEach(s => {
        if (!allSkills[s.name]) allSkills[s.name] = { score: 0, sources: [] };
        allSkills[s.name].score += s.score * 0.6;
        allSkills[s.name].sources.push('GitHub');
    });

    // Finalize
    return Object.entries(allSkills).map(([name, data]) => ({
        name,
        score: Math.min(Math.round(data.score), 10),
        sources: data.sources
    }));
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
 const startInterview = () => {
  window.location.href = `interview.html?user_id=${userIdFromUrl}`;
};
const normalizeResumeSkills = (skills) =>
  skills.map(s => ({
    name: s.name,
    score: Math.round(s.confidence * 10),
    source: "Resume"
  }));

  const matchSkills = (resumeSkills, jobSkills) => {
  const resumeSet = resumeSkills.map(s => s.name.toLowerCase());
  const matched = jobSkills.filter(skill =>
    resumeSet.includes(skill.toLowerCase())
  );

  return {
    matched,
    percentage: Math.round((matched.length / jobSkills.length) * 100)
  };
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
              </div>
              

              {/* Applications List */}
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">AI INTERVIEW</h3>
                   {/* <a
  href={`http://localhost/candidatemodule/Candidate/book_interview.html?user_id=${user.user_id}`}
  className="btn btn-primary text-sm"
>
  BOOK INTERVIEW
</a> */}
                   <a
  href={`http://localhost/candidatemodule/Candidate/candidate-dashboard.html?user_id=${user.user_id}`}
  className="btn btn-primary text-sm"
>
  ATTEND INTERVIEW
</a>

                    {/* <button onClick={() => onNavigate('jobs')} className="text-sm text-blue-600 hover:text-blue-500 font-medium">Find more jobs &rarr;</button> */}
                </div>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Your Applicationswmww</h3>
                    <button onClick={() => onNavigate('jobss')} className="text-sm text-blue-600 hover:text-blue-500 font-medium"> </button>
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
{app && app.status == null && (
  <a
    href={`http://localhost/candidatemodule/Candidate/candidate-dashboard.html?user_id=${user.user_id}`}
    className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
  >
    ATTEND INTERVIEW
  </a>
)}

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
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                   
                    
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Inputs */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Resume Section */}
                        <div className="card">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                    <div className="icon-file-text text-indigo-600"></div>
                                </div>
                                <h3 className="font-semibold">Resume Parsing</h3>
                            </div>
                            
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                               <input type="file"
  id="resume"
  name="resume"   
  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  className="hidden"
  onChange={handleFileUpload}
  disabled={loading}
/>

                                <label htmlFor="resume" className="cursor-pointer block">
                                    {resumeFile ? (
                                        <div className="text-green-600 font-medium flex flex-col items-center">
                                            <div className="icon-circle-check mb-2"></div>
                                            {resumeFile.name}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="icon-cloud-upload text-gray-400 text-2xl mb-2 mx-auto"></div>
                                           <span className="text-sm text-gray-500">Upload resume (PDF, DOC, DOCX)</span>

                                        </>
                                    )}
                                </label>
                            </div>
                            {parsedData.resume && parsedData.resume.length > 0 && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                                    Extracted {parsedData.resume.length} skills from resume.
                                </div>
                            )}
                        </div>

                        {/* GitHub Section */}
                        <div className="card">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <div className="icon-github text-gray-800"></div>
                                </div>
                                <h3 className="font-semibold">GitHub Analysis</h3>
                            </div>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                   placeholder="GitHub username (e.g. Syamaabhi)"
                                    className="input-field text-sm"
                                    value={githubUser}
                                    onChange={(e) => setGithubUser(e.target.value)}
                                />
                                <button 
                                    onClick={handleGithubAnalyze}
                                    disabled={loading || !githubUser}
                                    className="btn btn-primary p-2"
                                >
                                    <div className="icon-search text-white"></div>
                                </button>
                            </div>
                            {parsedData.github.length > 0 && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                                    Analyzed repos. Found {parsedData.github.length} top languages.
                                </div>
                            )}
                        </div>

                        {/* Action Button */}
                        <button 
                            onClick={generateReport}
                            disabled={parsedData.resume.length === 0 && parsedData.github.length === 0}
                            className={`w-full btn ${loading ? 'bg-gray-400' : 'btn-primary'} py-3 text-lg shadow-lg`}
                        >
                            {loading ? (
                                <>
                                    <div className="icon-loader animate-spin"></div> Processing...
                                </>
                            ) : (
                                <>
                                    Generate Skill Matrix <div className="icon-arrow-right"></div>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Right Column: Results */}
                    <div className="lg:col-span-2">
                        {step === 1 && finalSkills.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-gray-200 rounded-xl">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                    <div className="icon-chart-bar text-gray-400 text-4xl"></div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Waiting for Data</h3>
                                <p className="text-gray-500 max-w-sm">
                                    Upload your resume or connect GitHub to visualize your skill matrix and proficiency scores.
                                </p>
                            </div>
                        )}

                        {step === 2 && finalSkills.length > 0 && (
                            <div className="space-y-6">
                                {/* Chart Section */}
                                <div className="card">
                                    <h3 className="font-bold text-lg mb-6">Skill Proficiency Map</h3>
                                    <SkillChart skills={finalSkills} />
                                </div>

                                {/* Skills List */}
                                <div className="card">
                                    <h3 className="font-bold text-lg mb-6">Detailed Breakdown</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {finalSkills.map((skill, idx) => (
                                            <SkillCard 
                                                key={idx} 
                                                skill={skill.name} 
                                                score={skill.score} 
                                                sources={skill.sources} 
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Call to Action: Interview */}
                                <div className="bg-indigo-900 rounded-xl p-8 text-white text-center shadow-lg">
                                    <h2 className="text-2xl font-bold mb-4">Validate Your Skills with AI</h2>
                                    <p className="text-indigo-200 mb-8 max-w-xl mx-auto">
                                        Take a short AI-driven technical interview. We'll generate custom questions based on your skill profile to certify your expertise.
                                    </p>
                                    <button onClick={startInterview} className="btn bg-white text-indigo-900 hover:bg-indigo-50 px-8 py-3 text-lg font-bold border-none">
                                        <div className="icon-bot mr-2"></div> Start AI Technical Interview
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                    <button onClick={() => onNavigate('jobss')} className="text-sm text-blue-600 hover:text-blue-500 font-medium"> &rarr;</button>
                </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
              {/* Notifications */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <button
        onClick={() => {
          // ✅ Use backticks for template literal
          window.location.href = `http://localhost/candidatemodule/Recruter?user_id=${user.user_id}`;
        }}
        className="font-medium text-blue-600 hover:text-blue-500"
      >
        APPLY JOB
      </button>

                  </h3>
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

function SkillCard({ skill, score, sources }) {
    const getScoreColor = (s) => {
        if (s >= 8) return 'bg-green-100 text-green-800';
        if (s >= 5) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    return (
        <div className="border border-gray-100 rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-gray-900">{skill}</h4>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(score)}`}>
                    {score}/10
                </span>
            </div>
            <div className="flex gap-2 mt-2">
                {sources.map((source, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-white border border-gray-200 rounded text-gray-500 flex items-center gap-1">
                        {source === 'GitHub' && <div className="icon-github w-3 h-3"></div>}
                        {source === 'Resume' && <div className="icon-file-text w-3 h-3"></div>}
                        {source}
                    </span>
                ))}
            </div>
        </div>
    );
}
function SkillChart({ skills }) {
    const canvasRef = React.useRef(null);
    const chartRef = React.useRef(null);

    React.useEffect(() => {
        if (!canvasRef.current || !skills || skills.length === 0) return;

        const ctx = canvasRef.current.getContext('2d');
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const labels = skills.map(s => s.name);
        const data = skills.map(s => s.score);

        chartRef.current = new window.ChartJS(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Skill Proficiency (0-10)',
                    data: data,
                    fill: true,
                    backgroundColor: 'rgba(79, 70, 229, 0.2)',
                    borderColor: 'rgb(79, 70, 229)',
                    pointBackgroundColor: 'rgb(79, 70, 229)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(79, 70, 229)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(0,0,0,0.1)' },
                        grid: { color: 'rgba(0,0,0,0.1)' },
                        pointLabels: { font: { size: 12 } },
                        suggestedMin: 0,
                        suggestedMax: 10
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });

        return () => {
            if (chartRef.current) chartRef.current.destroy();
        };
    }, [skills]);

    return (
        <div className="h-[300px] w-full flex items-center justify-center">
            <canvas ref={canvasRef}></canvas>
        </div>
    );
}
