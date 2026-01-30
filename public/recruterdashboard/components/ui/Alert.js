function Alert({ type = 'info', message, onClose }) {
    const bgColors = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800'
    };

    const icons = {
        success: 'icon-circle-check',
        error: 'icon-circle-alert',
        info: 'icon-info'
    };

    return (
        <div className={`fixed top-4 right-4 z-50 flex items-center p-4 mb-4 text-sm border rounded-lg shadow-lg ${bgColors[type]}`} role="alert" data-name="alert">
            <div className={`${icons[type]} text-lg mr-2`}></div>
            <div className="font-medium">{message}</div>
            {onClose && (
                <button onClick={onClose} className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-lg inline-flex items-center justify-center h-8 w-8 opacity-50 hover:opacity-100 transition-opacity">
                    <span className="sr-only">Close</span>
                    <div className="icon-x text-lg"></div>
                </button>
            )}
        </div>
    );
}