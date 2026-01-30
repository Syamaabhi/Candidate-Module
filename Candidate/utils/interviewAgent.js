/**
 * AI Agent with Offline Fallback
 */

// Safe JSON Parser
const parseAIJSON = (text) => {
    if (!text || typeof text !== 'string') return null;
    try { 
        // Attempt strict parse
        return JSON.parse(text); 
    } catch (e) {
        // Attempt lenient parse (extract JSON from code blocks or braces)
        try {
            const match = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
            if (match) return JSON.parse(match[0]);
        } catch (e2) {}
    }
    return null;
};

// Fallback Data
const FALLBACK_QUESTIONS = [
    {
        id: 1,
        type: "mcq",
        text: "Which of the following best describes the 'Single Responsibility Principle'?",
        options: ["A class should have only one reason to change", "A function should have only one argument", "A module should have only one export", "A variable should be assigned only once"]
    },
    {
        id: 2,
        type: "text",
        text: "Explain the difference between synchronous and asynchronous programming."
    },
    {
        id: 3,
        type: "text",
        text: "Describe a situation where you had to optimize code performance."
    }
];

const FALLBACK_EVALUATION = {
    technical_score: 80,
    communication_score: 85,
    overall_rating: "Goodkk",
    decision: "Qualified",
    interview_log: "Offline Mode: Based on the provided answers, the candidate demonstrates solid understanding. (AI Service Unavailable)"
};
//mm
////mmmmmmmmmmm
const QUESTION_BANK = {
    JavaScript: [
        {
            id: 1,
            type: "mcq",
            text: "Which keyword declares a block-scoped variable?",
            options: ["var", "let", "static", "define"]
        },
        {
            id: 2,
            type: "text",
            text: "Explain closures in JavaScript."
        }
    ],

    React: [
        {
            id: 1,
            type: "mcq",
            text: "Which hook is used for side effects?",
            options: ["useState", "useEffect", "useMemo", "useRef"]
        },
        {
            id: 2,
            type: "text",
            text: "Explain virtual DOM."
        }
    ],

    PHP: [
        {
            id: 1,
            type: "mcq",
            text: "What does PDO stand for?",
            options: ["PHP Data Object", "Private Data Output", "Public Data Object", "PHP Driver Object"]
        },
        {
            id: 2,
            type: "text",
            text: "Difference between include and require."
        }
    ],

    SQL: [
        {
            id: 1,
            type: "mcq",
            text: "Which SQL clause is used to filter rows?",
            options: ["ORDER BY", "WHERE", "GROUP BY", "HAVING"]
        },
        {
            id: 2,
            type: "text",
            text: "Explain indexing in databases."
        }
    ]
};

window.invokeAIAgent = async (systemPrompt, userPrompt) => {
    console.log("SYSTEM:", systemPrompt);
    console.log("USER:", userPrompt);

    /* ===========================
       1️⃣ QUESTION GENERATION
    ============================ */
    if (systemPrompt.toLowerCase().includes("generate")) {
        return JSON.stringify([
            {
                id: 1,
                type: "mcq",
                text: "Which keyword declares a block-scoped variable in JavaScript?",
                options: ["var", "let", "const", "static"],
                correctAnswer: "let"
            },
            {
                id: 2,
                type: "text",
                text: "Explain what a closure is in JavaScript.",
                correctAnswer: "A closure is a function that remembers its outer scope"
            },
            {
                id: 3,
                type: "text",
                text: "What is React used for?",
                correctAnswer: "Building user interfaces"
            }
        ]);
    }

    /* ===========================
       2️⃣ ANSWER EVALUATION
    ============================ */
    if (systemPrompt.toLowerCase().includes("evaluate")) {
        let qaPairs;

        try {
            qaPairs = JSON.parse(userPrompt);
        } catch (err) {
            console.error("Failed to parse QA pairs:", err);
            return JSON.stringify(FALLBACK_EVALUATION);
        }

        let correctCount = 0;

        qaPairs.forEach(q => {
            if (
                q.candidate_answer &&
                q.correctAnswer &&
                q.candidate_answer.trim().toLowerCase()
                    .includes(q.correctAnswer.trim().toLowerCase())
            ) {
                correctCount++;
            }
        });

        const score = Math.round((correctCount / qaPairs.length) * 100);

        return JSON.stringify({
            technical_score: score,
            communication_score: 80,
            overall_rating: score > 70 ? "Good" : "Average",
            decision: score > 70 ? "Qualified" : "Not Qualified",
            interview_log: qaPairs.map(q => ({
                question: q.question,
                answer: q.candidate_answer,
                correctAnswer: q.correctAnswer,
                result:
                    q.candidate_answer?.toLowerCase().includes(
                        q.correctAnswer?.toLowerCase()
                    )
                        ? "Correct"
                        : "Incorrect"
            }))
        });
    }

    return JSON.stringify(FALLBACK_EVALUATION);
};




/////mmmmmmmmmmmmmmm
// MOCK AI AGENT (Safe Default)
// window.invokeAIAgent = async (systemPrompt, userPrompt) => {
//     console.log("AI SYSTEM PROMPT:", systemPrompt);
//     console.log("AI USER PROMPT:", userPrompt);

//     // Mock AI response (JSON STRING!)
//     return JSON.stringify([
//         {
//             id: 1,
//             type: "mcq",
//             text: "What does REST stand for?",
//             options: [
//                 "Representational State Transfer",
//                 "Remote Execution Standard Tool",
//                 "Reactive System Transfer",
//                 "None of the above"
//             ]
//         },
//         {
//             id: 2,
//             type: "text",
//             text: "Explain the difference between var, let, and const."
//         },
//         {
//             id: 3,
//             type: "text",
//             text: "What is a closure in JavaScript?"
//         }
//     ]);
// };

//mm
const generateInterviewQuestions = async (skills) => {
   
    // alert(JSON.stringify(skills, null, 2));
    // alert(typeof invokeAIAgent);

    console.log("poor............");
    // If Mock Mode is already active, return fallback immediately
    if (window.IS_MOCK_MODE) return FALLBACK_QUESTIONS;

    try {
        if (typeof invokeAIAgent === 'undefined') {
            return FALLBACK_QUESTIONS;
        }

        const skillNames = Array.isArray(skills) ? skills.map(s => s.name).join(", ") : "General Engineering";
        const systemPrompt = `Generate 3 technical interview questions for: ${skillNames}. Format: JSON Array. 1 MCQ, 2 Short Answer.`;
        const userPrompt = `Generate questions for ${skillNames}`;

        const response = await Promise.race([
            invokeAIAgent(systemPrompt, userPrompt),
            new Promise((_, reject) => setTimeout(() => reject(new Error("AI Timeout")), 10000))
        ]);

        const questions = parseAIJSON(response);
        return (questions && Array.isArray(questions) && questions.length > 0) ? questions : FALLBACK_QUESTIONS;

    } catch (error) {
        console.warn("AI Generation failed. Using fallback.", error);
        return FALLBACK_QUESTIONS;
    }
};

const evaluateInterviewSession = async (qaPairs) => {
    // console.log(qaPairs);
    // window.alert(JSON.stringify(qaPairs));
  
    //if (window.IS_MOCK_MODE) return FALLBACK_EVALUATION;

    try {
       
        if (typeof invokeAIAgent === 'undefined') return FALLBACK_EVALUATION;

        const systemPrompt = `Evaluate answers. Return JSON: {technical_score, communication_score, overall_rating, decision, interview_log}`;
        const userPrompt = JSON.stringify(qaPairs);
 //window.alert(JSON.stringify(userPrompt));
        const response = await Promise.race([
            invokeAIAgent(systemPrompt, userPrompt),
            new Promise((_, reject) => setTimeout(() => reject(new Error("AI Timeout")), 15000))
        ]);
//window.alert(JSON.stringify(response));
        const result = parseAIJSON(response);
      // window.alert(JSON.stringify(result));
       console.log("result");
       console.log(result);


        return result || FALLBACK_EVALUATION;

    } catch (error) {
        window.alert("loveyou");
        console.warn("AI Evaluation failed. Using fallback.", error);
        return FALLBACK_EVALUATION;
    }
};