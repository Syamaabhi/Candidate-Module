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

function InterviewApp() {
    const params = new URLSearchParams(window.location.search);
const userId = params.get("user_id");

console.log("Interview for user:", userId);

    const [status, setStatus] = React.useState('loading'); // loading, ready, active, evaluating, completed
    const [questions, setQuestions] = React.useState([]);
    const [currentQIndex, setCurrentQIndex] = React.useState(0);
    const [answers, setAnswers] = React.useState({});
    const [result, setResult] = React.useState(null);

    React.useEffect(() => {
        const initInterview = async () => {
            try {
                // Get skills from localStorage set by dashboard
                const skillsJson = localStorage.getItem('candidateSkills');
                let skills = [];
                try {
                    skills = skillsJson ? JSON.parse(skillsJson) : [];
                } catch (e) {
                    console.warn("Failed to parse skills from localStorage", e);
                }

                // Ensure skills is a valid array and has content
                if (!Array.isArray(skills) || skills.length === 0) {
                    skills = [{name: 'General Software Engineering'}];
                }
                
                const generatedQuestions = await generateInterviewQuestions(skills);
                setQuestions(generatedQuestions);
                setStatus('ready');
            } catch (e) {
                console.error(e);
                alert("Failed to initialize interview.");
            }
        };
        initInterview();
    }, []);

    const handleStart = () => setStatus('active');

    const handleAnswer = (val) => {
        setAnswers(prev => ({
            ...prev,
            [questions[currentQIndex].id]: val
        }));
    };

    const handleNext = () => {
        if (currentQIndex < questions.length - 1) {
            setCurrentQIndex(prev => prev + 1);
        } else {
          
            submitInterview();
        }
    };

    const submitInterview = async () => {
        setStatus('evaluating');
        
        // Prepare data for AI
       const qaPairs = questions.map(q => ({
    question: q.text,
    type: q.type,
    candidate_answer: answers[q.id] || "No Answer",
    correctAnswer: q.correctAnswer || ""
}));

        try {
            
            
            const evaluation = await evaluateInterviewSession(qaPairs);
          
            //setResult( evaluation.interview_log);
            setResult(evaluation);

           
            // window.alert(userId);
            //   window.alert(evaluation.decision);
            //mmmmmmmmmmmmm
//             const payloadw= {
//   user_id: userId,
// //   technical_score: 33,
// //   communication_score: 80,
// //   overall_rating: "Average",
//   decision:evaluation.decision
  
// };



           

            //mmmmmmmmmmmmmmmmmmm
            //const candidateId = localStorage.getItem('candidateId') || 'unknown-' + Date.now();
            const candidateId = localStorage.getItem(2) || 'unknown-' + Date.now();
           
            await safeCreateObject('interview_result', {
                 user_id: userId,
                candidate_id: candidateId,
                technical_score: evaluation.technical_score,
                communication_score: evaluation.communication_score,
                overall_rating: evaluation.overall_rating,
                decision: evaluation.decision,
                interview_log: evaluation.interview_log
            });
            
            setStatus('completed');
        } catch (e) {
            console.error("Submission failed", e);
            alert("Error submitting interview. Please try again.");
            setStatus('active'); // allow retry
        }
    };

    // Render Logic
    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="icon-loader animate-spin text-4xl text-indigo-600 mb-4 mx-auto"></div>
                    <h2 className="text-xl font-semibold text-gray-700">AI is preparing your interview...</h2>
                    <p className="text-gray-500">Analyzing your skill profile</p>
                </div>
            </div>
        );
    }

    if (status === 'ready') {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar userType="candidate" />
                <div className="flex-grow flex items-center justify-center p-4">
                    <div className="card max-w-2xl w-full text-center py-12">
                        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <div className="icon-bot text-indigo-600 text-4xl"></div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Ready for your AI Interview?</h1>
                        <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                            You will be asked {questions.length} questions based on your profile. 
                            The AI will evaluate your technical accuracy and communication style in real-time.
                        </p>
                        <div className="flex justify-center gap-4">
                            <a href="candidate-dashboard.html" className="btn btn-secondary">Cancel</a>
                            <button onClick={handleStart} className="btn btn-primary px-8 text-lg">
                                Start Interview <div className="icon-arrow-right"></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'active') {
        const q = questions[currentQIndex];
        const progress = ((currentQIndex + 1) / questions.length) * 100;

        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar userType="candidate" />
                <div className="max-w-3xl mx-auto w-full px-4 py-8 flex-grow flex flex-col">
                    {/* Progress */}
                    <div className="mb-8">
                        <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
                            <span>Question {currentQIndex + 1} of {questions.length}</span>
                            <span>{Math.round(progress)}% Completed</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={{width: `${progress}%`}}></div>
                        </div>
                    </div>

                    {/* Question Card */}
                    <div className="card flex-grow flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">{q.text}</h2>
                        
                        <div className="flex-grow">
                            {q.type === 'mcq' ? (
                                <div className="space-y-3">
                                    {q.options?.map((opt, idx) => (
                                        <label key={idx} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${answers[q.id] === opt ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                                            <input 
                                                type="radio" 
                                                name={`q-${q.id}`} 
                                                value={opt}
                                                checked={answers[q.id] === opt}
                                                onChange={(e) => handleAnswer(e.target.value)}
                                                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                            />
                                            <span className="ml-3 text-gray-700">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <textarea 
                                    className="input-field h-48 resize-none"
                                    placeholder="Type your answer here..."
                                    value={answers[q.id] || ''}
                                    onChange={(e) => handleAnswer(e.target.value)}
                                ></textarea>
                            )}
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button 
                                onClick={handleNext}
                                disabled={!answers[q.id]}
                                className={`btn ${!answers[q.id] ? 'bg-gray-300 cursor-not-allowed' : 'btn-primary'}`}
                            >
                                {currentQIndex === questions.length - 1 ? 'Submit Interview' : 'Next Question'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'evaluating') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md px-4">
                    <div className="icon-brain-circuit animate-pulse text-5xl text-indigo-600 mb-6 mx-auto"></div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">AI is evaluating your responses...</h2>
                    <p className="text-gray-500">
                        Checking technical accuracy, communication clarity, and confidence indicators.
                    </p>
                </div>
            </div>
        );
    }

    if (status === 'completed' && result) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar userType="candidate" />
                <div className="max-w-4xl mx-auto w-full px-4 py-10">
                    <div className="card text-center mb-8 relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-full h-2 ${result.decision === 'Qualified' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Result</h1>
                        <div className={`inline-flex items-center px-4 py-1 rounded-full text-sm font-bold mb-6 ${result.decision === 'Qualified' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {result.decision === 'Qualified' ? <div className="icon-check mr-2"></div> : <div className="icon-x mr-2"></div>}
                            {result.decision}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="text-sm text-gray-500 mb-1">Overall Rating</div>
                                <div className="text-xl font-bold text-gray-900">{result.overall_rating}</div>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <div className="text-sm text-blue-600 mb-1">Technical Score</div>
                                <div className="text-3xl font-bold text-blue-700">{result.technical_score}</div>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg">
                                <div className="text-sm text-purple-600 mb-1">Communication</div>
                                <div className="text-3xl font-bold text-purple-700">{result.communication_score}</div>
                            </div>
                        </div>

                        <div className="text-left bg-gray-50 p-6 rounded-lg border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                                <div className="icon-clipboard-list mr-2 text-indigo-500"></div> 
                                AI Evaluation Log
                            </h3>
                            {/* <p className="text-gray-600 leading-relaxed">
                                {result.interview_log}
                            </p> */}
                            <div className="space-y-4">
    {result.interview_log.map((log, index) => (
        <div key={index} className="p-3 bg-white border rounded">
            <p className="font-semibold text-gray-800">
                Q{index + 1}: {log.question}
            </p>
            <p className="text-gray-600">
                Your Answer: {log.answer}
            </p>
            <p className="text-gray-600">
                Correct Answer: {log.correctAnswer}
            </p>
            <p className={`font-bold ${
                log.result === "Correct" ? "text-green-600" : "text-red-600"
            }`}>
                Result: {log.result}
            </p>
        </div>
    ))}
</div>

                        </div>

                        <div className="mt-8">
                            <a href="candidate-dashboard.html" className="btn btn-primary inline-flex">
                                Return to Dashboard
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    return null;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ErrorBoundary>
        <InterviewApp />
    </ErrorBoundary>
);