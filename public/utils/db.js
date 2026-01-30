// Database utility functions wrapper
const DB_TABLES = {
    JOBS: 'job_listings',
    APPLICATIONS: 'job_applications'
};
const getAllCandidateskk = async () => {

    alert("LLL");
  try {
    alert("Fetching jobs...");

    const res = await fetch("http://localhost/candidatemodule/public/fetch_jobs_applications.php");

    alert(`Status: ${res.status}`);

    if (!res.ok) {
      throw new Error("Failed to fetch jobs");
    }

    const data = await res.json();
    alert(JSON.stringify(data));

    return data;

  } catch (error) {
    console.error("API Error:", error);
    alert("Error: " + error.message);
    throw error;
  }
}

//mmcode



// Helper for retrying failed requests
const fetchWithRetry = async (fn, retries = 3, delay = 1000) => {
    try {
        return await fn();
    } catch (error) {
        // If it's a network error (Failed to fetch) and we have retries left
        if (retries > 0 && error.message && error.message.includes('Failed to fetch')) {
            console.warn(`Network error detected. Retrying... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWithRetry(fn, retries - 1, delay * 2);
        }
        throw error;
    }
};

const checkDbAvailability = () => {
    if (typeof window.trickleListObjects !== 'function' || 
        typeof window.trickleCreateObject !== 'function') {
        throw new Error('Database connection not initialized. Please refresh the page.');
    }
};

const db = {
    // Fetch all jobs
    getJobsv: async () => {
        checkDbAvailability();
        try {
            const result = await fetchWithRetry(() => 
                trickleListObjects(DB_TABLES.JOBS, 100, true)
            );
            return result.items || [];
        } catch (error) {
            console.error('Error fetching jobs:', error);
            throw error;
        }
    },

    // Submit an application
    submitApplication: async (applicationData) => {
        checkDbAvailability();
        try {
            return await fetchWithRetry(() => 
                trickleCreateObject(DB_TABLES.APPLICATIONS, applicationData)
            );
        } catch (error) {
            console.error('Error submitting application:', error);
            throw error;
        }
    },

    // Admin: Create a new job
    createJob: async (jobData) => {
        checkDbAvailability();
        try {
            return await fetchWithRetry(() => 
                trickleCreateObject(DB_TABLES.JOBS, jobData)
            );
        } catch (error) {
            console.error('Error creating job:', error);
            throw error;
        }
    },

    // Admin: Delete a job
    deleteJob: async (jobId) => {
        checkDbAvailability();
        try {
            return await fetchWithRetry(() => 
                trickleDeleteObject(DB_TABLES.JOBS, jobId)
            );
        } catch (error) {
            console.error('Error deleting job:', error);
            throw error;
        }
    },
//admin
//  export getAllCandidatesj:async () => {
   
//     alert("LLL");


// },
    // Admin: Get applications for a specific job
    getApplicationsForJob: async (jobId) => {
        checkDbAvailability();
        try {
            const result = await fetchWithRetry(() => 
                trickleListObjects(DB_TABLES.APPLICATIONS, 1000, true)
            );
            const allApps = result.items || [];
            return allApps.filter(app => app.objectData.job_id === jobId);
        } catch (error) {
            console.error('Error fetching applications:', error);
            throw error;
        }
    }
};
