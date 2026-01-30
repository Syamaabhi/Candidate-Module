
function JobApplicationForm({ job, onSubmit, onCancel, isSubmitting }) {
    // const [showChat, setShowChat] = useState(false); // State to 
    const [formData, setFormData] = React.useState({
        applicant_name: '',
        applicant_email: '',
        applicant_phone: '',
        cover_letter: '',
        resume: null 
    });


const handleFileChange = (e) => {
  const file = e.target.files[0];

  if (file) {
    // Optional validation
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Please upload PDF or DOC/DOCX only');
      e.target.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Resume size must be less than 2MB');
      e.target.value = '';
      return;
    }

    setFormData(prev => ({
      ...prev,
      resume: file
    }));
  }
};
//mm
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

  const data = new FormData();

  data.append('job_id', job.id); // ✅ REQUIRED
  data.append('applicant_name', formData.applicant_name);
  data.append('applicant_email', formData.applicant_email);
  data.append('applicant_phone', formData.applicant_phone);
  data.append('cover_letter', formData.cover_letter);
  data.append('resume', formData.resume);

  onSubmit(data); // ✅ SEND FormData
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
                <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Upload Resume <span className="text-red-500">*</span>
  </label>

  <input
    type="file"
    accept=".pdf,.doc,.docx"
    required
    onChange={handleFileChange}
    className="block w-full text-sm text-gray-700
               file:mr-4 file:py-2 file:px-4
               file:rounded-lg file:border-0
               file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700
               hover:file:bg-blue-100"
  />

  {formData.resume && (
    <p className="text-xs text-green-600 mt-1">
      Selected: {formData.resume.name}
    </p>
  )}
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
               {/* <button onClick={() => JobApplicationChat(12345)}>Apply chat</button> */}
              
            </div>
        </form>
    );
}
