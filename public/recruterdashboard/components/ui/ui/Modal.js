function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true" data-name="modal">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    {/* Header */}
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold leading-6 text-gray-900" id="modal-title">
                                {title}
                            </h3>
                            <button 
                                onClick={onClose}
                                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                            >
                                <span className="sr-only">Close</span>
                                <div className="icon-x text-xl"></div>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-white px-4 py-5 sm:p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}