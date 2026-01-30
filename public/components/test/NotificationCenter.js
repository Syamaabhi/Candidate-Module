function NotificationCenter({ userRole, userId }) {
    const [notifications, setNotifications] = React.useState([]);
    const [isOpen, setIsOpen] = React.useState(false);
    const [unreadCount, setUnreadCount] = React.useState(0);
    const [hasError, setHasError] = React.useState(false);

    const fetchNotifications = async () => {
        if (hasError) return; // Stop polling if we hit a persistent error

        try {
            const allNotes = await safeListObjects('notification');
            if (!Array.isArray(allNotes)) return;

            const myNotes = allNotes.filter(n => {
                const targetMatch = n.target_role === userRole || n.target_user_id === userId;
                return targetMatch;
            }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            setNotifications(myNotes);
            setUnreadCount(myNotes.filter(n => !n.is_read).length);
        } catch (e) {
            console.warn("Notification polling failed silently:", e);
            // Don't setHasError(true) immediately to allow retries, 
            // but in a real app we might want circuit breaking.
        }
    };

    React.useEffect(() => {
        fetchNotifications();
        // Poll every 15s to reduce load
        const interval = setInterval(fetchNotifications, 15000); 
        return () => clearInterval(interval);
    }, [userRole, userId]);

    const markAsRead = async (note) => {
        if (note.is_read) return;
        try {
            await safeUpdateObject('notification', note.objectId, { is_read: true });
            setNotifications(prev => prev.map(n => 
                n.objectId === note.objectId ? { ...n, is_read: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (e) {
            console.warn("Failed to mark as read", e);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return 'icon-circle-check text-green-500';
            case 'warning': return 'icon-triangle-alert text-yellow-500';
            case 'error': return 'icon-circle-alert text-red-500';
            default: return 'icon-info text-blue-500';
        }
    };

    return (
        <div className="relative">
            <button 
                className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors rounded-full hover:bg-gray-100"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="icon-bell text-xl"></div>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900 text-sm">Notifications....</h3>
                        <button onClick={fetchNotifications} className="text-xs text-indigo-600 hover:underline">Refresh</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 text-sm">No notifications</div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {notifications.map(note => (
                                    <div 
                                        key={note.objectId} 
                                        className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${!note.is_read ? 'bg-blue-50/50' : ''}`}
                                        onClick={() => markAsRead(note)}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`mt-0.5 ${getIcon(note.type)}`}></div>
                                            <div className="flex-1">
                                                <p className={`text-sm ${!note.is_read ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                                                    {note.message}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(note.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                            {!note.is_read && (
                                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}