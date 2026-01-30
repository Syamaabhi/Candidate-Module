async function getJobs() {
  try {
    const res = await fetch("http://localhost/noww/jobs.php");
    if (!res.ok) throw new Error("Failed to fetch jobs");

    const data = await res.json();
    console.log("Fetched jobs:", data); // debug
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
}
//mm
async function getJobss() {
  try {
    const res = await fetch("http://localhost/noww/jobss.php");
    if (!res.ok) throw new Error("Failed to fetch jobs");

    const data = await res.json();
    console.log("Fetched jobs:", data); // debug
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
}
//mm
//  // Submit an application
//   async function submitApplication(applicationData)
//    {
//     alert(applicationData);
//         //checkDbAvailabilitalert()y();
//         try {
//             // return await fetchWithRetry(() => 
//             //     trickleCreateObject(DB_TABLES.APPLICATIONS, applicationData)
//             // );
//         } catch (error) {
//             console.error('Error submitting application:', error);
//             throw error;
//         }
//     },
//     //mm
async function submitApplication(applicationData)

{
 
  const res = await fetch("http://localhost/noww/register.php", {
    method: "POST",
     body: JSON.stringify(applicationData),
    headers: { "Content-Type": "application/json" }
   
    
  });

  return await res.json();
}

async function createJob(jobData)

{
  alert("tttttttttttttttttttt");
  //alert(JSON.stringify(applicationData));
  const res = await fetch("http://localhost/candidatemodule/public/api/createjob.php", {
    method: "POST",
     body: JSON.stringify(jobData),
    headers: { "Content-Type": "application/json" }
   
    
  });
// alert(JSON.stringify(await res.json()));
  return await res.json();
}
 async function getApplicationsForJob(jobIndex) {
  alert(JSON.stringify(jobIndex));
  const res = await fetch(
    `http://localhost/noww/jobselect.php?jobIndex=${jobIndex}`
  );
    alert(JSON.stringify(res));
  if (!res.ok) throw new Error('Failed to load applications');
  return await res.json();
}

