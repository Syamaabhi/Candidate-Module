function Home({ onNavigate, user }) {
  return (
    <div className="space-y-16">
        {/* Hero Section */}
        <div className="relative bg-white overflow-hidden rounded-2xl shadow-xl">
            <div className="max-w-7xl mx-auto">
                <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 p-8 lg:p-12">
                    <main className="mt-10 mx-auto max-w-7xl sm:mt-12 md:mt-16 lg:mt-20 xl:mt-28">
                        <div className="sm:text-center lg:text-left">
                            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                <span className="block xl:inline">Find your dream job </span>{' '}
                                <span className="block text-blue-600 xl:inline">5 lakh+ jobs for you to explore</span>
                            </h1>
                            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                Introducing a career platform for college students & fresh grads.
                            </p>
                            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                <div className="rounded-md shadow">
                                    <button
                                        onClick={() => onNavigate(user ? 'jobs' : 'register')}
                                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                                    >
                                        Get Started
                                    </button>
                                </div>
                                <div className="mt-3 sm:mt-0 sm:ml-3">
                                    <button
                                        onClick={() => onNavigate('jobs')}
                                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                                    >
                                        Browse Jobs
                                    </button>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-blue-50 flex items-center justify-center">
                 <div className="p-12">
                     <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto transform rotate-2 hover:rotate-0 transition-transform duration-300">
                        <div className="flex items-center mb-4">
                             <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <div className="icon-check"></div>
                             </div>
                             <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">Application Status</div>
                                <div className="text-xs text-gray-500">Just Now</div>
                             </div>
                        </div>
                        <p className="text-gray-600 text-sm">Your AI interview score of 85% has qualified you for the next round!</p>
                     </div>
                 </div>
            </div>
        </div>

        {/* Features Grid */}
        <div className="py-12 bg-white rounded-2xl shadow-sm p-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center">
                    <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        A better way to get hired
                    </p>
                </div>

                <div className="mt-10">
                    <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                        <div className="relative">
                            <dt>
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                                    <div className="icon-brain-circuit text-xl"></div>
                                </div>
                                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">AI-Powered Matching</p>
                            </dt>
                            <dd className="mt-2 ml-16 text-base text-gray-500">
                                Our algorithms analyze your skills and resume to find jobs where you'll truly shine.
                            </dd>
                        </div>

                        <div className="relative">
                            <dt>
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                                    <div className="icon-video text-xl"></div>
                                </div>
                                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Smart Interviews</p>
                            </dt>
                            <dd className="mt-2 ml-16 text-base text-gray-500">
                                Take preliminary interviews with our AI assistant anytime, anywhere. Instant feedback.
                            </dd>
                        </div>

                        <div className="relative">
                            <dt>
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                                    <div className="icon-file-text text-xl"></div>
                                </div>
                                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Resume Analysis</p>
                            </dt>
                            <dd className="mt-2 ml-16 text-base text-gray-500">
                                Get insights on your resume and how well it matches your target roles.
                            </dd>
                        </div>

                         <div className="relative">
                            <dt>
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                                    <div className="icon-chart-bar text-xl"></div>
                                </div>
                                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Real-time Tracking</p>
                            </dt>
                            <dd className="mt-2 ml-16 text-base text-gray-500">
                                Never wonder where you stand. Track every step of your application in real-time.
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    </div>
  );
}