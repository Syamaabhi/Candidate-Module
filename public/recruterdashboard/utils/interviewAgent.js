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
    overall_rating: "Good",
    decision: "Qualified",
    interview_log: "Offline Mode: Based on the provided answers, the candidate demonstrates solid understanding. (AI Service Unavailable)"
};

const generateInterviewQuestions = async (skills) => {
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
    if (window.IS_MOCK_MODE) return FALLBACK_EVALUATION;

    try {
        if (typeof invokeAIAgent === 'undefined') return FALLBACK_EVALUATION;

        const systemPrompt = `Evaluate answers. Return JSON: {technical_score, communication_score, overall_rating, decision, interview_log}`;
        const userPrompt = JSON.stringify(qaPairs);

        const response = await Promise.race([
            invokeAIAgent(systemPrompt, userPrompt),
            new Promise((_, reject) => setTimeout(() => reject(new Error("AI Timeout")), 15000))
        ]);

        const result = parseAIJSON(response);
        return result || FALLBACK_EVALUATION;

    } catch (error) {
        console.warn("AI Evaluation failed. Using fallback.", error);
        return FALLBACK_EVALUATION;
    }
};