class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) { return { hasError: true }; }
    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught error:", error, errorInfo);
        this.setState({ error });
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 text-center">
                    <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
                    <p className="text-gray-600 mb-4">Please refresh the page.</p>
                    <button onClick={() => window.location.reload()} className="px-4 py-2 bg-indigo-600 text-white rounded">Refresh</button>
                    <pre className="mt-4 text-xs text-left bg-gray-100 p-4 rounded overflow-auto text-red-500">
                        {this.state.error && this.state.error.toString()}
                    </pre>
                </div>
            );
        }
        return this.props.children;
    }
}

function CandidateDashboard() {


     const params = new URLSearchParams(window.location.search);
  const userIdFromUrl = params.get("user_id");

  console.log("User ID from URL:", userIdFromUrl);


    const [currentUser, setCurrentUser] = React.useState(null);
    const [bookings, setBookings] = React.useState([]);
    //mm
const [showBooking, setShowBooking] = React.useState(false);
const [bookingType, setBookingType] = React.useState("Technical");
const [editBooking, setEditBooking] = React.useState(null);
const [newTime, setNewTime] = React.useState("");
 const[bookingTime, setBookingTime] = React.useState("");

    //mm
    // Resume/Skill State
    const [step, setStep] = React.useState(1);
    const [loading, setLoading] = React.useState(false);
    const [parsedData, setParsedData] = React.useState({ resume: [], github: [] });
    const [finalSkills, setFinalSkills] = React.useState([]);
    const [resumeFile, setResumeFile] = React.useState(null);
    const [githubUser, setGithubUser] = React.useState('');

    React.useEffect(() => {
        const initUser = async () => {
            try {
                // Find or create a demo user
                const candidates = await safeListObjects('candidate');
                let user = null;

      if (userIdFromUrl) {
        // 🔥 Find user by ID from URL
        user = candidates.find(
          c => String(c.objectId) === String(userIdFromUrl)
        );
      }

      if (!user && candidates.length > 0) {
        // fallback
        user = candidates[0];
      }

      if (!user) {
        alert("Invalid user. Please login again.");
        return;
      }


                setCurrentUser(user);
                window.currentCandidateId = user.objectId; // For Navbar notification polling

                // Fetch bookings
                const allBookings = await safeListObjects('interview_booking');
                const myBookings = allBookings.filter(b => b.candidate_id === user.objectId);
                setBookings(myBookings);

            } catch (e) {
                console.error("Init failed", e);
            }
        };
        initUser();
    }, []);

    // Existing Logic Preserved
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
//mm
const normalizeResumeSkills = (skills) =>
  skills.map(s => ({
    name: s.name,
    score: Math.round(s.confidence * 10),
    source: "Resume"
  }));

//mm
//mm
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

//mm

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

const confirmBooking = async () => {
  if (!bookingTime) {
    alert("Please select date and time");
    return;
  }

  try {
    const booking = await safeCreateObject("interview_booking", {
      candidate_id: currentUser.objectId,
      type: bookingType,
      status: "Scheduled",
      scheduled_time: new Date(bookingTime).toISOString(),
      meeting_link: "#"
    });

    setBookings(prev => [...prev, booking]);
    setShowBooking(false);
    setBookingTime("");

    alert("Interview booked successfully!");
  } catch (err) {
    console.error(err);
    alert("Booking failed");
  }
};
const cancelBooking = async (bookingId) => {
  if (!window.confirm("Cancel this interview?")) return;

  try {
    await safeUpdateObject("interview_booking", bookingId, {
      status: "Cancelled"
    });

    setBookings(prev =>
      prev.map(b =>
        b.objectId === bookingId
          ? { ...b, status: "Cancelled" }
          : b
      )
    );
  } catch (err) {
    alert("Failed to cancel interview");
  }
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

    const startInterview = () => {
  window.location.href = `interview.html?user_id=${userIdFromUrl}`;
};

    if (!currentUser) return <div className="p-10 text-center">Loading profile...</div>;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar userType="candidate" />
            
            <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
                {/* Header with Status */}
                <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome,wwwwwwwww {currentUser.name}</h1>
                        <p className="text-gray-500">Track your application and verify your skills.</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3">
                        <span className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Current Stage</span>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold">
                            {currentUser.stage}
                        </span>
                    </div>
                </div>
<button
  onClick={() => setShowBooking(true)}
  className="btn btn-secondary px-8 py-3 text-lg mt-6"
>
  📅 Book Human Interview
</button>
{showBooking && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
      <h3 className="text-xl font-bold mb-4">Book Interview</h3>

      <label className="block text-sm font-medium mb-1">Interview Type</label>
      <select
        className="input-field mb-4"
        value={bookingType}
        onChange={(e) => setBookingType(e.target.value)}
      >
        <option value="Technical">Technical</option>
        <option value="HR">HR</option>
      </select>

      <label className="block text-sm font-medium mb-1">Date & Time</label>
      <input
        type="datetime-local"
        className="input-field mb-6"
        value={bookingTime}
        onChange={(e) => setBookingTime(e.target.value)}
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowBooking(false)}
          className="btn btn-secondary"
        >
          Cancel
        </button>

        <button
          onClick={confirmBooking}
          className="btn btn-primary"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}

                {/* Upcoming Interviews Section */}
                {bookings.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Upcoming Interviewsmmmm</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            {bookings.map(booking => (
                                <div key={booking.objectId} className="card border-l-4 border-l-indigo-500">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-gray-900">{booking.type} Interview</h3>
                                            <div className="flex items-center gap-2 text-gray-600 mt-1">
                                                <div className="icon-calendar w-4 h-4"></div>
                                                <span className="text-sm">
                                                    {new Date(booking.scheduled_time).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-600 font-medium">
                                            {booking.status}
                                        </span>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                        <span className="text-xs text-gray-500">Virtual Meeting</span>
                                        <a 
                                            href={booking.meeting_link} 
                                            target="_blank" 
                                            className="btn btn-primary py-1.5 px-3 text-sm"
                                        >
                                            <div className="icon-video w-4 h-4"></div> Join Meetinggg
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                
            </main>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ErrorBoundary>
        <CandidateDashboard />
    </ErrorBoundary>
);