
    function NotificationCenter({ user, onNavigate }) {
  const userRole = user?.role;
  const userId = user?.objectId;

  const [notifications, setNotifications] = React.useState([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);

  const fetchNotifications = async () => {
    if (!userRole || !userId) return;

    try {
      const allNotes = await safeListObjects('notification');
      if (!Array.isArray(allNotes)) return;

      const myNotes = allNotes
        .filter(n =>
          n.target_role === userRole ||
          n.target_user_id === userId
        )
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setNotifications(myNotes);
      setUnreadCount(myNotes.filter(n => !n.is_read).length);
    } catch (e) {
      console.warn("Notification fetch failed:", e);
    }
  };

  React.useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [userRole, userId]);

  const markAsRead = async (note) => {
    if (note.is_read) return;

    try {
      await safeUpdateObject('notification', note.objectId, {
        is_read: true
      });

      setNotifications(prev =>
        prev.map(n =>
          n.objectId === note.objectId
            ? { ...n, is_read: true }
            : n
        )
      );

      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.warn("Mark as read failed", e);
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
        className="relative p-2 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-gray-100"
        onClick={() => setIsOpen(o => !o)}
      >
        <div className="icon-bell text-xl"></div>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 text-xs bg-red-600 text-white rounded-full px-1.5">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border z-50">
          <div className="px-4 py-3 border-b bg-gray-50 flex justify-between">
            <h3 className="font-semibold text-sm">Notifications</h3>
            <button
              onClick={fetchNotifications}
              className="text-xs text-indigo-600"
            >
              Refresh
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No notifications
              </div>
            ) : (
              notifications.map(note => (
                <div
                  key={note.objectId}
                  onClick={() => markAsRead(note)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    !note.is_read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={getIcon(note.type)}></div>
                    <div className="flex-1">
                      <p className="text-sm">{note.message}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(note.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <NotificationCenter />
  </ErrorBoundary>
);

