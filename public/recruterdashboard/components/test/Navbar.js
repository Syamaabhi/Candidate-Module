function Navbar({ userType }) {
    const isCandidate = userType === 'candidate';
    const isAdmin = userType === 'admin';

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <a href="index.html" className="flex items-center gap-2">
                            <div className="bg-indigo-600 p-2 rounded-lg">
                                <div className="icon-cpu text-white text-xl"></div>
                            </div>
                            <span className="font-bold text-xl text-gray-900">SkillMatrix</span>
                        </a>
                    </div>
                    <div className="flex items-center gap-4">
                        {!isCandidate && !isAdmin && (
                            <>
                                <a href="index.html" className="text-gray-600 hover:text-indigo-600 font-medium">Home</a>
                                <a href="#features" className="text-gray-600 hover:text-indigo-600 font-medium">Features</a>
                                <a href="candidate-dashboard.html" className="btn btn-primary text-sm">
                                    Candidate Login
                                </a>
                                <a href="admin-dashboard.html" className="text-gray-600 hover:text-indigo-600 text-sm font-medium">
                                    Admin Portal
                                </a>
                            </>
                        )}
                        {isCandidate && (
                            <div className="flex items-center gap-4">
                                <NotificationCenter userRole="candidate" userId={window.currentCandidateId} />
                                <span className="text-sm text-gray-600">Welcome,... <strong>Candidate</strong></span>
                                <a href="index.html" className="btn border border-gray-200 hover:bg-gray-50 text-sm text-gray-700">Logout</a>
                            </div>
                        )}
                        {isAdmin && (
                            <div className="flex items-center gap-4">
                                <NotificationCenter userRole="admin" userId="admin-1" />
                                <span className="text-sm text-gray-600">Welcome, <strong>Admin</strong></span>
                                <a href="index.html" className="btn border border-gray-200 hover:bg-gray-50 text-sm text-gray-700">Logout</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}