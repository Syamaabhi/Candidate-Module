function JobApplicationForm({ job, onSubmit, onCancel, isSubmitting }) {
    const [formData, setFormData] = React.useState({
        applicant_name: '',
        applicant_email: '',
        applicant_phone: '',
        cover_letter: ''
    });
if (!job) return null; // 🛡 safety

  const {
    title,
    company
    
  } = job;
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4" data-name="application-form">
            <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Applying for position</p>
                <h4 className="font-semibold text-gray-900">{title}</h4>
                <p className="text-sm text-gray-600">{company}</p>
                
                
                
                
            </div>

            <div>
                <label htmlFor="applicant_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="applicant_name"
                    name="applicant_name"
                    required
                    className="input-field"
                    placeholder="e.g. John Doe"
                    value={formData.applicant_name}
                    onChange={handleChange}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="applicant_email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="applicant_email"
                        name="applicant_email"
                        required
                        className="input-field"
                        placeholder="john@example.com"
                        value={formData.applicant_email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="applicant_phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        id="applicant_phone"
                        name="applicant_phone"
                        required
                        className="input-field"
                        placeholder="+91 98765 43210"
                        value={formData.applicant_phone}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div>
                <label htmlFor="cover_letter" className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Letter (Optional)
                </label>
                <textarea
                    id="cover_letter"
                    name="cover_letter"
                    rows="4"
                    className="input-field resize-none"
                    placeholder="Tell us why you're a great fit..."
                    value={formData.cover_letter}
                    onChange={handleChange}
                ></textarea>
            </div>

            <div className="pt-4 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-outline"
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn btn-primary min-w-[120px]"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <span className="flex items-center">
                             <div className="icon-loader animate-spin mr-2"></div>
                             Sending...
                        </span>
                    ) : 'Submit Application'}
                </button>
            </div>
        </form>
    );
}