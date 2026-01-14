// Database interaction utilities

const DB_TABLES = {
  USER: 'user',
  JOB: 'job',
  APPLICATION: 'application'
};

// Generic error handler
const handleApiError = (error, context) => {
  console.error(`API Error in ${context}:`, error);
  throw new Error(error.message || 'An unexpected error occurred');
};
//my
export async function apiRegisterUser(data) {
  const formData = new FormData();
  Object.keys(data).forEach(key =>
    formData.append(key, data[key])
  );

  const res = await fetch("http://localhost/student/register.php", {
    method: "POST",
    body: formData
  });

  return await res.json();
}

//my

// User API
// async function apiRegisterUser(userData) {
//   try {
//     // // Check if email exists
//     // const users = await trickleListObjects(DB_TABLES.USER, 100, true);
//     // const existing = users.items.find(u => u.objectData.email === userData.email);
    
//     // if (existing) {
//     //   throw new Error('Email already registered');
//     // }

//     // const result = await trickleCreateObject(DB_TABLES.USER, userData);
//     // return { ...result.objectData, id: result.objectId };
//   } catch (error) {
//     handleApiError(error, 'registerUser');
//   }
// }

export async function apiLoginUser(email, password) {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);

  const response = await fetch("http://localhost/student/login.php", {
    method: "POST",
    body: formData
  });

  return await response.json();
}

async function apiUpdateUser(userId, data) {
    try {
        const result = await trickleUpdateObject(DB_TABLES.USER, userId, data);
        return { ...result.objectData, id: result.objectId };
    } catch (error) {
        handleApiError(error, 'updateUser');
    }
}

// Job API
// async function apiGetJobs() {
//   try {
//     const result = await trickleListObjects(DB_TABLES.JOB, 100, true);
//     return result.items.map(item => ({ ...item.objectData, id: item.objectId }));
//   } catch (error) {
//     handleApiError(error, 'getJobs');
//   }
// }

//my
// api.js (browser-safe, NO exports keyword issues)

export async function apiGetJobs() {
  try {
    const response = await fetch("http://localhost/student/jobs.php");
    if (!response.ok) {
      throw new Error("Failed to fetch jobs");
    }
    const data = await response.json();
    alert( data);
    return data.jobs;
  } catch (error) {
    console.error("Failed to load jobs", error);
    throw error;
  }
}


//my
async function apiCreateJob(jobData) {
    try {
        const result = await trickleCreateObject(DB_TABLES.JOB, jobData);
        return { ...result.objectData, id: result.objectId };
    } catch (error) {
        handleApiError(error, 'createJob');
    }
}

// Application API
async function apiApplyForJob(applicationData) {
  try {
    const result = await trickleCreateObject(DB_TABLES.APPLICATION, {
        ...applicationData,
        status: 'Applied',
        interview_stage: 'Pending',
        ai_score: 0
    });
    return { ...result.objectData, id: result.objectId };
  } catch (error) {
    handleApiError(error, 'applyForJob');
  }
}

async function apiGetMyApplications(candidateId) {
    try {
        // Since we can't filter by field in listObjects, we fetch all and filter client side
        // In a real app with index, this would be optimized
        const result = await trickleListObjects(DB_TABLES.APPLICATION, 100, true);
        const allApplications = result.items.map(item => ({...item.objectData, id: item.objectId}));
        
        // Enhance with job details
        const jobs = await apiGetJobs();
        
        return allApplications
            .filter(app => app.candidate_id === candidateId)
            .map(app => {
                const job = jobs.find(j => j.id === app.job_id);
                return { 
                    ...app, 
                    job_title: job ? job.title : 'Unknown Job',
                    job_description: job ? job.description : '',
                    job_skills: job ? job.skills : []
                };
            });
    } catch (error) {
        handleApiError(error, 'getMyApplications');
    }
}

async function apiGetJobApplications(jobId) {
    try {
        const result = await trickleListObjects(DB_TABLES.APPLICATION, 100, true);
        const allApplications = result.items.map(item => ({...item.objectData, id: item.objectId}));
        
        // Enhance with candidate details
        const usersResult = await trickleListObjects(DB_TABLES.USER, 100, true);
        const users = usersResult.items.map(item => ({...item.objectData, id: item.objectId}));

        return allApplications
            .filter(app => app.job_id === jobId)
            .map(app => {
                const candidate = users.find(u => u.id === app.candidate_id);
                return { 
                    ...app, 
                    candidate_name: candidate ? candidate.name : 'Unknown Candidate',
                    candidate_email: candidate ? candidate.email : ''
                };
            });

    } catch (error) {
        handleApiError(error, 'getJobApplications');
    }
}

async function apiUpdateApplication(appId, data) {
    try {
        const result = await trickleUpdateObject(DB_TABLES.APPLICATION, appId, data);
        return { ...result.objectData, id: result.objectId };
    } catch (error) {
        handleApiError(error, 'updateApplication');
    }
}