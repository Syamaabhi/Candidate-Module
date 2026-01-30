// Simulating an AI parser delay and result
const mockResumeParsing = async (file) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                skills: [
                    { name: "Python", category: "Backend", confidence: 0.9 },
                    { name: "SQL", category: "Database", confidence: 0.85 },
                    { name: "React", category: "Frontend", confidence: 0.7 },
                    { name: "Docker", category: "DevOps", confidence: 0.8 },
                ]
            });
        }, 2000);
    });
};

const mockGitHubAnalysis = async (username) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                stats: {
                    repos: 12,
                    commits: 450,
                    active_days: 180
                },
                skills: [
                    { name: "Python", score: 9.5, repo_count: 8 },
                    { name: "JavaScript", score: 8.0, repo_count: 4 },
                    { name: "Go", score: 6.5, repo_count: 2 }
                ]
            });
        }, 2500);
    });
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