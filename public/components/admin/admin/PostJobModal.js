function PostJobModal({ onSubmit, onCancel }) {
    const [formData, setFormData] = React.useState({
        title: '',
        company: 'Acme Corp', // Defaulting for demo
        location: '',
        type: 'Full-time',
        salary_range: '',
        description: ''
    });
    const [loading, setLoading] = React.useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate posted_at
        await onSubmit({
            ...formData,
            posted_at: new Date().toISOString()
        });
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4" data-name="post-job-form">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input required type="text" name="title" value={formData.title} onChange={handleChange} className="input-field" placeholder="e.g. Senior Product Manager" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input required type="text" name="company" value={formData.company} onChange={handleChange} className="input-field" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input required type="text" name="location" value={formData.location} onChange={handleChange} className="input-field" placeholder="e.g. Remote, Bangalore" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="input-field cursor-pointer">
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Remote">Remote</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                    <input type="text" name="salary_range" value={formData.salary_range} onChange={handleChange} className="input-field" placeholder="e.g. ₹20L - ₹30L" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} rows="4" className="input-field resize-none" placeholder="Describe the role..."></textarea>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-4">
                <button type="button" onClick={onCancel} className="btn btn-outline" disabled={loading}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Posting...' : 'Post Job'}
                </button>
            </div>
        </form>
    );
}