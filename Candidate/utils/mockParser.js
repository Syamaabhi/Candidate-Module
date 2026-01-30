// Simulating an AI parser delay and result
const mockResumeParsing = async (file) => {
    console.log("ddddddddddddddddd");
    window.alert(file);
    
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                skills: [
                    { name: "Python", category: "Backend", confidence: 0.9 },
                    { name: "SQL", category: "Database", confidence: 0.85 },
                    { name: "React", category: "Frontend", confidence: 0.7 },
                    { name: "Docker", category: "DevOps", confidence: 0.8 },
                     { name: "Php", category: "Backend", confidence: 0.8 },
                      { name: ".Net", category: "Backend", confidence: 0.8 },
                       { name: "Symfony", category: "Backend", confidence: 0.8 },
                        { name: "Wordpress", category: "Backend", confidence: 0.8 },
                         { name: "Codeignitor", category: "Backend", confidence: 0.8 },
                          { name: "ceo", category: "ceo", confidence: 0.8 },
                ]
            });
        }, 2000);
    });
};
//my
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
const fetchMyBookings = async (userIdFromUrl) => {
  const res = await fetch(
    `http://localhost/candidatemodule/public/get_interview_bookings.php?candidate_id=${userIdFromUrl}`
  );

  const json = await res.json();

  if (!json.success) {
    console.error(json.message || 'Failed to fetch bookings');
    return [];
  }

  return json.data; // always return array
};

const bookinjobinterview = async (bookingData) => {
  const res = await fetch(
    "http://localhost/candidatemodule/public/interview_booking.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    }
  );

  return await res.json();
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