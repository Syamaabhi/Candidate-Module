function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-indigo-600 p-1.5 rounded-lg">
                                <div className="icon-cpu text-white text-lg"></div>
                            </div>
                            <span className="font-bold text-lg text-gray-900">SkillMatrix</span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            Advanced candidate assessment platform powered by AI. We analyze code, experience, and projects to find your perfect match.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Platform</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-indigo-600">Resume Parsing</a></li>
                            <li><a href="#" className="hover:text-indigo-600">GitHub Analysis</a></li>
                            <li><a href="#" className="hover:text-indigo-600">Skill Mapping</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-indigo-600">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-indigo-600">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-100 mt-12 pt-8 flex justify-between items-center text-sm text-gray-400">
                    <p>&copy; 2026 SkillMatrix Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}