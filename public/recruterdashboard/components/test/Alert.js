function Alert({ type = 'info', message, onClose }) {
  if (!message) return null;

  const styles = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200'
  };

  const icons = {
    info: 'icon-info',
    success: 'icon-circle-check',
    error: 'icon-circle-alert',
    warning: 'icon-triangle-alert'
  };

  return (
    <div className={`p-4 rounded-md border flex items-start justify-between ${styles[type]} mb-4`}>
       <div className="flex items-center">
         <div className={`${icons[type]} mr-2 text-lg`}></div>
         <span>{message}</span>
       </div>
       {onClose && (
         <button onClick={onClose} className="ml-4 hover:opacity-75">
            <div className="icon-x"></div>
         </button>
       )}
    </div>
  );
}