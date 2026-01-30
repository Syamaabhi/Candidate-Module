import React from 'react';

function App() {
    const candidateData = {
        objectId: 'candidate-12345',
        name: 'John Doe',
        role: 'Software Engineer'
    };

    const isOpen = true;  // Modal open or close state
    const onClose = () => {
        console.log('Modal closed');
    };
    const onSuccess = () => {
        console.log('Booking successful');
    };

    return (
        <div>
            <BookingModal 
                isOpen={isOpen} 
                onClose={onClose} 
                candidate={candidateData} 
                onSuccess={onSuccess} 
            />
        </div>
    );
}

function BookingModal({ isOpen, onClose, candidate, onSuccess }) {
  
    //if (!isOpen || !candidate) return null;

    const [formData, setFormData] = React.useState({
        type: 'Technical',
        date: '20/05/1987',
        time: '11:00',
        link: 'https://meet.google.com/abc-defg-hij' // Mock default
    });
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const scheduledTime = new Date(`${formData.date}T${formData.time}`).toISOString();

            // 1. Create Booking Record
            await safeCreateObject('interview_booking', {
                candidate_id: 2,
                type: formData.type,
                scheduled_time: scheduledTime,
                status: 'Scheduled',
                meeting_link: formData.link
            });

            // // 2. Update Candidate Stage
            // await safeUpdateObject('candidate', candidate.objectId, {
            //     stage: 'Interview',
            //     last_updated: new Date().toISOString()
            // });

            // // 3. Create Notification for Candidate
            // await safeCreateObject('notification', {
            //     target_role: 'candidate',
            //     target_user_id: candidate.objectId,
            //     message: `New ${formData.type} interview scheduled for ${new Date(scheduledTime).toLocaleString()}`,
            //     type: 'info',
            //     is_read: false,
            //     created_at: new Date().toISOString()
            // });

            // // 4. Create Notification for Admin (Self confirmation)
            // await safeCreateObject('notification', {
            //     target_role: 'admin',
            //     message: `Interview scheduled with ${candidate.name}`,
            //     type: 'success',
            //     is_read: false,
            //     created_at: new Date().toISOString()
            // });

            onSuccess();
            onClose();
        } catch (error) {
            console.error("Booking failed", error);
            alert("Failed to book interview");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-fade-in">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="font-bold text-xl text-gray-900">Schedule Interview</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <div className="icon-x text-xl"></div>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="bg-indigo-50 p-3 rounded-lg text-sm text-indigo-800 mb-4">
                        Booking for <strong>{candidate.name}</strong> ({candidate.role})
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Interview Type</label>
                        <select 
                            className="input-field"
                            value={formData.type}
                            onChange={e => setFormData({...formData, type: e.target.value})}
                        >
                            <option value="Technical">Technical Assessment</option>
                            <option value="HR">HR Screening</option>
                            <option value="Final">Final Culture Fit</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input 
                                type="date" 
                                required
                                className="input-field"
                                value={formData.date}
                                onChange={e => setFormData({...formData, date: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                            <input 
                                type="time" 
                                required
                                className="input-field"
                                value={formData.time}
                                onChange={e => setFormData({...formData, time: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Link</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <div className="icon-link text-gray-400"></div>
                            </div>
                            <input 
                                type="url" 
                                required
                                className="input-field pl-10"
                                placeholder="https://..."
                                value={formData.link}
                                onChange={e => setFormData({...formData, link: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="btn border border-gray-300 hover:bg-gray-50">Cancel</button>
                        <button type="submit" disabled={loading} className="btn btn-primary">
                            {loading ? 'Scheduling...' : 'Confirm Booking'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default App;
