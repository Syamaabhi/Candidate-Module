// Global Mock Mode Switch
window.IS_MOCK_MODE = false;

// Mock Data Generator
const getMockData = (type) => {
    const now = new Date().toISOString();
    switch(type) {
        case 'candidate':
            return [
                { objectId: 'mock-c-1', name: 'Alice Johnsonoo ', role: 'Frontend Developer', stage: 'Applied', overall_score: 8.5, email: 'alice@example.com', last_updated: now },
                { objectId: 'mock-c-2', name: 'Bob Smith (Demo)', role: 'Backend Engineer', stage: 'Interview', overall_score: 7.2, email: 'bob@example.com', last_updated: now }
            ];
        case 'notification':
            return [
                { objectId: 'mock-n-1', message: 'Welcome to SkillMatrix (Offline Mode)', type: 'info', is_read: false, created_at: now }
            ];
        case 'interview_booking':
            return [
                { objectId: 'mock-b-1', candidate_id: '2', type: 'Technical', status: 'Scheduled', scheduled_time: new Date(Date.now() + 86400000).toISOString(), meeting_link: '#' }
            ];
        default:
            return [];
    }
};

const safeListObjects = async (type) => {
    // 1. Check Mock Mode first
    if (window.IS_MOCK_MODE) return getMockData(type);

    try {
        // 2. Check SDK presence
        if (typeof trickleListObjects === 'undefined') {
            console.warn('Trickle DB SDK missing. Switching to Mock Mode.');
            window.IS_MOCK_MODE = true;
            return getMockData(type);
        }

        // 3. Attempt Network Call with Timeout
        const result = await Promise.race([
            trickleListObjects(type, 100, true),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000))
        ]);

        return result && result.items ? result.items : [];
    } catch (e) {
        console.warn(`DB List Error (${type}). Switching to Mock Mode.`, e);
        window.IS_MOCK_MODE = true;
        return getMockData(type);
    }
};
// const safeCreateObjecty = async (type, data) => {
    

//     window.alert("momkkkk");

//     const mockObj = { objectId: 'mock-new-' + Date.now(), ...data };
//     window.alert(mockObj);
//     window.alert(data);
//     console.log(data);

//     window.alert(JSON.stringify(data));
//     //llllllll
// //     const ress = await fetch("http://localhost/testremote/airesult.php", {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify({
// //       user_id: data.user_id,
// //       decision: data.decision,
// //       ai_score: data.technical_score
// //     })
// //   });

// //   const resultr = await ress.json();
// //   console.log("Saved AI Result:", resultr);
// //   return resultr;
  
//     //lllllllllll
//     // if (window.IS_MOCK_MODE) return mockObj;

//     // try {
//     //     if (typeof trickleCreateObject === 'undefined') {
//     //         window.IS_MOCK_MODE = true;
//     //         return mockObj;
//     //     }

//     //     const result = await Promise.race([
//     //         trickleCreateObject(type, data),
//     //         new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000))
//     //     ]);
        
//     //     return result;
//     // } catch (e) {
//     //     console.warn(`DB Create Error (${type}). Switching to Mock Mode.`, e);
//     //     window.IS_MOCK_MODE = true;
//     //     return mockObj;
//     // }
// };

const safeCreateObject = async (type, data) => {
    

   

    const mockObj = { objectId: 'mock-new-' + Date.now(), ...data };
   // window.alert(mockObj);
    //window.alert(data);
    console.log(data);

    //window.alert(JSON.stringify(data));
    //llllllll
    const ress = await fetch("http://localhost/testremote/airesult.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: data.user_id,
      decision: data.decision,
      ai_score: data.technical_score
    })
  });

  const resultr = await ress.json();
  console.log("Saved AI Result:", resultr);
  return resultr;
  
    //lllllllllll
    if (window.IS_MOCK_MODE) return mockObj;

    try {
        if (typeof trickleCreateObject === 'undefined') {
            window.IS_MOCK_MODE = true;
            return mockObj;
        }

        const result = await Promise.race([
            trickleCreateObject(type, data),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000))
        ]);
        
        return result;
    } catch (e) {
        console.warn(`DB Create Error (${type}). Switching to Mock Mode.`, e);
        window.IS_MOCK_MODE = true;
        return mockObj;
    }
};

const safeUpdateObject = async (type, id, data) => {
    const mockObj = { objectId: id, ...data };

    if (window.IS_MOCK_MODE) return mockObj;

    try {
        if (typeof trickleUpdateObject === 'undefined') {
            window.IS_MOCK_MODE = true;
            return mockObj;
        }

        return await trickleUpdateObject(type, id, data);
    } catch (e) {
        console.warn(`DB Update Error (${type}). Switching to Mock Mode.`, e);
        window.IS_MOCK_MODE = true;
        return mockObj;
    }
};

// Global Error Handler for Unhandled Rejections (Network failures)
window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.message && event.reason.message.includes('Failed to fetch')) {
        console.warn("Suppressing unhandled 'Failed to fetch' error. Switching to Mock Mode.");
        window.IS_MOCK_MODE = true;
        event.preventDefault();
    }
});