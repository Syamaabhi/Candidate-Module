function JobCard({ job, onApply }) {
    const { objectId, objectData } = job;
  //  const { title, company, location, type, salary_range, description, posted_at } = objectData;
if (!job) return null;
const normalizedJob = job.objectData ?? job;
  //const { title, company, location, type, salary_range, description, posted_at } = job;
const {
    title,
    company,
    location,
    type,
    salary_range,
    description,
    posted_at
  } = normalizedJob;

    // Format relative time (simple version)
    const getRelativeTime = (dateString) => {
        if (!dateString) return 'Recently';
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        return `${diffDays} days ago`;
    };

    return (
        <div className="card hover:shadow-md transition-shadow duration-200 group" data-name="job-card">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-[var(--primary)] transition-colors">
                        {title}
                    </h3>
                    <div className="mt-1 flex items-center text-sm text-gray-600">
                        <span className="font-medium">{company}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        <div className="flex items-center">
                            <div className="icon-star text-yellow-400 text-xs mr-1 fill-current"></div>
                            <span>4.5</span>
                        </div>
                    </div>
                </div>
                <div className="hidden sm:block">
                     <div className="icon-bookmark text-gray-300 hover:text-[var(--primary)] cursor-pointer text-xl"></div>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-500">
                <div className="flex items-center">
                    <div className="icon-map-pin text-gray-400 mr-1.5 text-base"></div>
                    {location}
                </div>
                <div className="flex items-center">
                    <div className="icon-briefcase text-gray-400 mr-1.5 text-base"></div>
                    {type}
                </div>
                <div className="flex items-center">
                    <div className="icon-wallet text-gray-400 mr-1.5 text-base"></div>
                    {salary_range || 'Not disclosed'}
                </div>
            </div>

            <div className="mt-4 text-sm text-gray-600 line-clamp-2">
                {description}
            </div>

            <div className="mt-6 flex items-center justify-between">
                <div className="text-xs text-gray-500 flex items-center">
                    <div className="icon-clock text-gray-400 mr-1.5 text-base"></div>
                    Posted {getRelativeTime(posted_at)}
                </div>
                <button 
                    onClick={() => onApply(normalizedJob)}
                    className="btn btn-primary text-sm px-6"
                >
                    Apply Now
                </button>
                
            </div>
        </div>
    );
}