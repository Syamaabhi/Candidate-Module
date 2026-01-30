function InterviewSession({ application, onComplete, onCancel }) {
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [stage, setStage] = React.useState('intro'); // intro, questioning, closing, finished
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [isTyping, setIsTyping] = React.useState(false);

  const questions = [
    "Tell me a little about yourself and your background.",
    `What specific experience do you have with ${Array.isArray(application.job_skills) ? application.job_skills[0] : 'the required skills'}?`,
    "Describe a challenging technical problem you solved recently.",
    "Where do you see yourself in 5 years in your career?",
    "Do you have any questions for us about the role?"
  ];
  if (!application) {
    return <div>Loading interview data...</div>;
  }

  const skills = application.job_skills || [];

  React.useEffect(() => {
    // Initial greeting
     if (!application) return;


    addMessage('ai', `Hello! I'm your AI Interviewer for the ${application.job_title} position. I'll be asking you a few questions to assess your fit. Are you ready to begin?`);
  }, []);

  const addMessage = (sender, text) => {
    setMessages(prev => [...prev, { sender, text, time: new Date() }]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    addMessage('user', userText);
    setInput('');
    setIsTyping(true);

    // Simulate AI processing delay
    setTimeout(() => {
        processResponse(userText);
        setIsTyping(false);
    }, 1500);
  };

  const processResponse = (response) => {
    if (stage === 'intro') {
        setStage('questioning');
        addMessage('ai', "Great! Let's get started. " + questions[0]);
    } else if (stage === 'questioning') {
        if (questionIndex < questions.length - 1) {
            const nextIndex = questionIndex + 1;
            setQuestionIndex(nextIndex);
            addMessage('ai', "Thank you. " + questions[nextIndex]);
        } else {
            setStage('closing');
            addMessage('ai', "Thank you for sharing that. We've reached the end of our interview session. I will now analyze your responses and generate a score. Please wait a moment.");
            setTimeout(finishInterview, 2000);
        }
    }
  };

  const finishInterview = () => {
    // Simulate score generation (70-95 range)
    const score = Math.floor(Math.random() * (95 - 70 + 1)) + 70;
    onComplete(score);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden flex flex-col h-[600px] max-w-2xl mx-auto border border-gray-200">
        {/* Header */}
        <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center">
                <div className="icon-bot mr-2 text-xl"></div>
                <div>
                    <h3 className="font-bold">AI Interview Assistant</h3>
                    <p className="text-xs text-blue-100">{application.job_title}</p>
                </div>
            </div>
            <button onClick={onCancel} className="text-white hover:text-gray-200">
                <div className="icon-x"></div>
            </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                        msg.sender === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none'
                    }`}>
                        <p className="text-sm">{msg.text}</p>
                        <span className={`text-xs block mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                            {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>
            ))}
            {isTyping && (
                <div className="flex justify-start">
                    <div className="bg-white text-gray-500 shadow-sm border border-gray-100 rounded-lg p-3 rounded-bl-none">
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex space-x-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={stage === 'finished' ? "Interview completed" : "Type your answer..."}
                    disabled={stage === 'finished' || isTyping}
                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button 
                    onClick={handleSend}
                    disabled={!input.trim() || stage === 'finished' || isTyping}
                    className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="icon-send text-lg"></div>
                </button>
            </div>
        </div>
    </div>
  );
}