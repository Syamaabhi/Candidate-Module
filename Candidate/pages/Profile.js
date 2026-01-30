function Profile({ user, onUpdateUser }) {
    alert("lll");
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    github_link: '',
    linkedin_link: '',
    resume_url: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = React.useState({ type: '', text: '' });

  React.useEffect(() => {
    if (user) {
        setFormData({
            name: user.name || '',
            email: user.email || '',
            github_link: user.github_link || '',
            linkedin_link: user.linkedin_link || '',
            resume_url: user.resume_url || ''
        });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
        const updatedUser = await apiUpdateUser(user.id, formData);
        onUpdateUser(updatedUser);
        localStorage.setItem('job_portal_user', JSON.stringify(updatedUser));
        setMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
        setMsg({ type: 'error', text: 'Failed to update profile: ' + error.message });
    } finally {
        setLoading(false);
    }
  };

  const handleSimulateUpload = () => {
      // Simulating a file upload for demo purposes
      setFormData(prev => ({
          ...prev,
          resume_url: `https://storage.example.com/resumes/${user.name.replace(/\s+/g, '_').toLowerCase()}_cv.pdf`
      }));
  };

  if (!user) return <div>Please login first.</div>;

  return (
    <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
                {user.role} Account
            </span>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <Alert type={msg.type} message={msg.text} onClose={() => setMsg({ type: '', text: '' })} />
                    
                    {/* Personal Info Section */}
                    <div className="border-b border-gray-200 pb-8">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4 flex items-center">
                            <div className="icon-user mr-2 text-blue-500"></div> Personal Information
                        </h3>
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            <Input
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled
                            />
                        </div>
                    </div>

                    {user.role === 'candidate' && (
                        <>
                            {/* Professional Links Section */}
                            <div className="border-b border-gray-200 pb-8">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4 flex items-center">
                                    <div className="icon-link mr-2 text-blue-500"></div> Professional Presence
                                </h3>
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                    <div className="relative">
                                        <div className="absolute top-8 left-0 pl-3 flex items-center pointer-events-none">
                                            <div className="icon-github text-gray-400"></div>
                                        </div>
                                        <Input
                                            label="GitHub Profile"
                                            name="github_link"
                                            value={formData.github_link}
                                            onChange={handleChange}
                                            placeholder="https://github.com/..."
                                            className="pl-10" // This would require Input component update, but keeping simple for now
                                        />
                                    </div>
                                    <div className="relative">
                                        <div className="absolute top-8 left-0 pl-3 flex items-center pointer-events-none">
                                            <div className="icon-linkedin text-gray-400"></div>
                                        </div>
                                        <Input
                                            label="LinkedIn Profile"
                                            name="linkedin_link"
                                            value={formData.linkedin_link}
                                            onChange={handleChange}
                                            placeholder="https://linkedin.com/in/..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Resume Section */}
                            <div>
                                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4 flex items-center">
                                    <div className="icon-file-text mr-2 text-blue-500"></div> Resume / CV
                                </h3>
                                <div className="bg-blue-50 rounded-md p-4 border border-blue-100 mb-4">
                                    <p className="text-sm text-blue-800 mb-2">
                                        Please provide a direct link to your PDF resume (Google Drive, Dropbox, or public URL).
                                    </p>
                                    <div className="flex gap-2">
                                        <div className="flex-grow">
                                            <Input
                                                name="resume_url"
                                                value={formData.resume_url}
                                                onChange={handleChange}
                                                placeholder="https://example.com/my-resume.pdf"
                                            />
                                        </div>
                                        <div className="pt-6"> {/* align with input */}
                                             <button
                                                type="button"
                                                onClick={handleSimulateUpload}
                                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                             >
                                                <div className="icon-cloud-upload mr-2"></div> Simulate Upload
                                             </button>
                                        </div>
                                    </div>
                                    {formData.resume_url && (
                                        <div className="mt-2 flex items-center text-sm text-green-600">
                                            <div className="icon-circle-check mr-1"></div> Resume linked successfully
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                            {loading ? 'Saving Changes...' : 'Save Profile Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
}