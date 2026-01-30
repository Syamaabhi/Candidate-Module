function AdminHeader() {
    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40" data-name="admin-header">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center mr-8">
                            <div className="w-8 h-8 rounded bg-gray-900 flex items-center justify-center mr-2">
                                <div className="icon-briefcase text-white text-lg"></div>
                            </div>
                            <span className="text-xl font-bold text-gray-900 tracking-tight">Recruiter<span className="text-[var(--primary)]">Pro</span></span>
                        </div>
                        <div className="hidden md:flex space-x-4">
                             <a href="index.html" className="text-sm text-gray-500 hover:text-gray-900 flex items-center">
                                <div className="icon-external-link w-4 h-4 mr-1"></div>
                                View Public Site
                             </a>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end mr-2">
                            <span className="text-sm font-medium text-gray-900">Acme Corkkp</span>
                            <span className="text-xs text-gray-500">Admin Account</span>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-sm">
                            AC
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}