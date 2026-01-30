function JobApplicationChat ({ jobId,isSubmitting })  {
    const [step, setStep] = React.useState(0);
    const [questions, setQuestions] = React.useState([]);
    const [answers, setAnswers] = React.useState([]);
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [submitted, setSubmitted] = React.useState(false);
    const [jobTitle, setJobTitle] = React.useState("");

    React.useEffect(() => {
        // Fetch job details and questions from the PHP backend
        fetch(`/job_application.php?job_id=${jobId}`)
            .then((response) => response.json())
            .then((data) => {
                setJobTitle(data.job.title);
                setQuestions(data.questions);
            });
    }, [jobId]);

    return (
        <div
          className="chat-container"
          style={{
            // position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '300px',
            height: '400px',
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '10px',
            boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
            padding: '10px',
            zIndex: 1000,
          }}
        >
          {submitted ? (
            <div>Your application has been submitted successfully!</div>
          ) : (
            <div>
              {step === 0 ? (
                <div>
                  <h2>Apply for {jobTitle}</h2>
                  <label>
                    Name:
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        margin: '5px 0',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                      }}
                    />
                  </label>
                  <button
                    onClick={() => setStep(step + 1)}
                    style={{
                      padding: '10px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '4px',
                    }}
                  >
                    Next
                  </button>
                </div>
              ) : step === 1 ? (
                <div>
                  <label>
                    Email:
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        margin: '5px 0',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                      }}
                    />
                  </label>
                  <button
                    onClick={() => setStep(step + 1)}
                    style={{
                      padding: '10px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '4px',
                    }}
                  >
                    Next
                  </button>
                </div>
              ) : (
                <div>
                  <div>{questions[step]}</div>
                  <input
                    type="text"
                    placeholder="Your answer"
                    onBlur={(e) => handleAnswer(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      margin: '5px 0',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
    );
}
