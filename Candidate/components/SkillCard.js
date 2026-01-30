function SkillCard({ skill, score, sources }) {
    const getScoreColor = (s) => {
        if (s >= 8) return 'bg-green-100 text-green-800';
        if (s >= 5) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    return (
        <div className="border border-gray-100 rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-gray-900">{skill}</h4>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(score)}`}>
                    {score}/10
                </span>
            </div>
            <div className="flex gap-2 mt-2">
                {sources.map((source, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-white border border-gray-200 rounded text-gray-500 flex items-center gap-1">
                        {source === 'GitHub' && <div className="icon-github w-3 h-3"></div>}
                        {source === 'Resume' && <div className="icon-file-text w-3 h-3"></div>}
                        {source}
                    </span>
                ))}
            </div>
        </div>
    );
}