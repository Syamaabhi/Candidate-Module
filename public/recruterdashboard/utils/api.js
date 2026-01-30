// Database interaction utilities

const DB_TABLES = {
  USER: 'user',
  JOB: 'job',
  APPLICATION: 'application'
};



//mycode
export async function apiRegisterUser(userData) {
  
 
  const res = await fetch("http://localhost/candidatemodule/public/api/register.php", {
    method: "POST",
     body: JSON.stringify(userData),
    headers: { "Content-Type": "application/json" }
   
    
  });
alert(JSON.stringify(await res.json()));
  return await res.json();
}

// User API
export async function apiLoginUser(email, password) {
  alert("kkk");

  const res = await fetch("http://localhost/candidatemodule/public/api/login.php", {
    method: "POST",
    body: JSON.stringify({ email, password }) ,       // must stringify
    headers: { "Content-Type": "application/json" } // must be JSON
  });

  const data = await res.json(); // read JSON once

  if (!res.ok) {
    
    throw new Error(data.message);
  }
   
  return data;
}



// async function apiLoginUser(email, password) {
//   alert(email);
//    alert(password);
//   try {
//     const users = await trickleListObjects(DB_TABLES.USER, 100, true);
//     const user = users.items.find(u => 
//       u.objectData.email === email && u.objectData.password === password
//     );

//     if (!user) {
//       throw new Error('Invalid email or password');
//     }

//     return { ...user.objectData, id: user.objectId };
//   } catch (error) {
//     handleApiError(error, 'loginUser');
//   }
// }

async function apiUpdateUser(userId, data) {
    try {
        const result = await trickleUpdateObject(DB_TABLES.USER, userId, data);
        return { ...result.objectData, id: result.objectId };
    } catch (error) {
        handleApiError(error, 'updateUser');
    }
}
//mycode
export async function apiGetJobs() {
  try {
    const res = await fetch("http://localhost/candidatemodule/public/api/jobs.php");
    if (!res.ok) {
      throw new Error("Failed to fetch jobs");
    }
    return await res.json();
  } catch (error) {
    console.error("API Error:", error); // 🔥 inline handling
    throw error;
  }
}



// ✅ MUST be a function


//mycode
async function apiGetJobsw() {
  try {
    const res = await fetch("http://localhost/candidatemodule/public/api/jobs.php");
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch jobs");
    }

    return data;
  } catch (error) {
    handleApiError(error, "apiGetJobs");
  }
}

export async function apiCreateJob(jobData) {
   alert(JSON.stringify(jobData));
  const res = await fetch("http://localhost/candidatemodule/public/api/jobadd.php", {
    method: "POST",
     body: JSON.stringify(jobData),
    headers: { "Content-Type": "application/json" }
   
    
  });
alert(JSON.stringify(await res.json()));
  return await res.json();
}
// async function apiCreateJob(jobData) {
//     alert(JSON.stringify(jobData));
  
//     try {
//         const result = await trickleCreateObject(DB_TABLES.JOB, jobData);
//         return { ...result.objectData, id: result.objectId };
//     } catch (error) {
//         handleApiError(error, 'createJob');
//     }
// }

// Application API

export async function apiApplyForJob(applicationData) {
 
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

export async function apiGetMyApplications(candidateId) {

  const res = await fetch(
    `http://localhost/candidatemodule/public/api/get_applications.php?candidate_id=${candidateId}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch applications");
  }

  const data = await res.json();

  return data.applications;

  // alert(candidateId);
  //   try {
  //       // Since we can't filter by field in listObjects, we fetch all and filter client side
  //       // In a real app with index, this would be optimized
  //       // const result = await trickleListObjects(DB_TABLES.APPLICATION, 100, true);
  //       // const allApplications = result.items.map(item => ({...item.objectData, id: item.objectId}));
        
  //       // Enhance with job details
  //       const jobs = await apiGetJobs();
        
  //       return allApplications
  //           .filter(app => app.candidate_id === candidateId)
  //           .map(app => {
  //               const job = jobs.find(j => j.id === app.job_id);
  //               return { 
  //                   ...app, 
  //                   job_title: job ? job.title : 'Unknown Job',
  //                   job_description: job ? job.description : '',
  //                   job_skills: job ? job.skills : []
  //               };
  //           });
  //   } catch (error) {
  //       handleApiError(error, 'getMyApplications');
  //   }
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
window.alert(appId);
window.alert(data);
  
    try {
        const result = await trickleUpdateObject(DB_TABLES.APPLICATION, appId, data);
        return { ...result.objectData, id: result.objectId };
    } catch (error) {
        handleApiError(error, 'updateApplication');
    }
}