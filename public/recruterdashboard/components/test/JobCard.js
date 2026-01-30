function JobCard({ job,onSelect = () => {}, onApply, isApplied = false }) {
  let skills = [];
  if (Array.isArray(job.skills)) {
    skills = job.skills;
  } else if (typeof job.skills === 'string') {
    skills = job.skills.split(',').map(s => s.trim());
  }
  
  return (
    
    <div
      onClick={() => onSelect(job)}
      className="cursor-pointer bg-white overflow-hidden shadow rounded-lg border border-gray-100 hover:shadow-md"
    >
    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">{job.title}</h3>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 mr-2">
                        {job.experience_level}
                    </span>
                    <span>Min AI Score: {job.min_ai_score}</span>
                </div>
            </div>
            {isApplied ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <div className="icon-check mr-1 text-xs"></div> Applied
                </span>
            ) : (
                <button
                    onClick={() => onApply(job)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                    Apply Now
                </button>
            )}
        </div>
        
        <div className="mt-4 text-sm text-gray-600 line-clamp-3">
            {job.description}
        </div>

        <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900">Required Skills</h4>
            <div className="mt-2 flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                        {skill}
                    </span>
                ))}
            </div>
        </div>
      </div>
      
    </div>
    
    
    </div>
    
  );
  
}
