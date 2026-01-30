function Register({ onRegister, onNavigate }) {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate',
    github_link: '',
    linkedin_link: ''
  });
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Basic validation
      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const user = await apiRegisterUser(formData);
      alert(user);
      loginUser(user);
      onRegister(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button onClick={() => onNavigate('login')} className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Alert type="error" message={error} onClose={() => setError('')} />
            
            <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
            />

            <Input
                label="Email address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
            />

            <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
            />

            <Input
                label="I am a"
                name="role"
                type="select"
                value={formData.role}
                onChange={handleChange}
                options={[
                    { value: 'candidate', label: 'Candidate (Looking for jobs)' },
                    { value: 'recruiter', label: 'Recruiter (Hiring)' }
                ]}
            />
            
            {formData.role === 'candidate' && (
                <>
                    <Input
                        label="GitHub Profile (Optional)"
                        name="github_link"
                        value={formData.github_link}
                        onChange={handleChange}
                        placeholder="https://github.com/username"
                    />
                     <Input
                        label="LinkedIn Profile (Optional)"
                        name="linkedin_link"
                        value={formData.linkedin_link}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/in/username"
                    />
                </>
            )}

            <div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}