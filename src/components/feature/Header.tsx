
import { useState, useEffect } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showAlerts, setShowAlerts] = useState(false);
  const [systemAlerts, setSystemAlerts] = useState<any[]>([]);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    // Fetch system alerts for all logged in users
    if (currentUser) {
      fetchSystemAlerts();
      // Set up periodic refresh for alerts
      const interval = setInterval(fetchSystemAlerts, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const fetchSystemAlerts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/user-management`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ 
          action: 'get_system_alerts',
          user_role: currentUser?.role 
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSystemAlerts(data.alerts || []);
        } else {
          // Fallback alerts based on user role
          setFallbackAlerts();
        }
      } else {
        setFallbackAlerts();
      }
    } catch (error) {
      console.error('Error fetching system alerts:', error);
      setFallbackAlerts();
    }
  };

  const setFallbackAlerts = () => {
    if (currentUser?.role === 'system_admin') {
      setSystemAlerts([
        {
          id: '1',
          type: 'warning',
          title: 'High Server Load',
          message: 'Server CPU usage is above 85% for the last 10 minutes',
          created_at: new Date().toISOString(),
          is_read: false
        },
        {
          id: '2',
          type: 'error',
          title: 'Database Connection Issue',
          message: 'Intermittent database connectivity detected',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          is_read: false
        },
        {
          id: '3',
          type: 'info',
          title: 'System Maintenance',
          message: 'Scheduled maintenance window this weekend',
          created_at: new Date(Date.now() - 7200000).toISOString(),
          is_read: false
        }
      ]);
    } else if (currentUser?.role === 'hr_manager') {
      setSystemAlerts([
        {
          id: '4',
          type: 'info',
          title: 'New Leave Request',
          message: '3 new leave requests pending approval',
          created_at: new Date().toISOString(),
          is_read: false
        },
        {
          id: '5',
          type: 'warning',
          title: 'Payroll Deadline',
          message: 'Payroll processing deadline is tomorrow',
          created_at: new Date(Date.now() - 1800000).toISOString(),
          is_read: false
        }
      ]);
    } else if (currentUser?.role === 'manager') {
      setSystemAlerts([
        {
          id: '6',
          type: 'info',
          title: 'Team Update',
          message: '2 team members clocked in late today',
          created_at: new Date().toISOString(),
          is_read: false
        },
        {
          id: '7',
          type: 'warning',
          title: 'Timesheet Review',
          message: '5 timesheets pending your approval',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          is_read: false
        }
      ]);
    } else {
      setSystemAlerts([
        {
          id: '8',
          type: 'info',
          title: 'Welcome Message',
          message: 'Welcome to the HR Management Portal',
          created_at: new Date().toISOString(),
          is_read: false
        }
      ]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    window.REACT_APP_NAVIGATE('/');
  };

  const markAlertAsRead = async (alertId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/user-management`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ 
          action: 'mark_alert_read',
          alert_id: alertId
        })
      });

      if (response.ok) {
        setSystemAlerts(prev => prev.filter(alert => alert.id !== alertId));
      } else {
        // Fallback: remove from local state
        setSystemAlerts(prev => prev.filter(alert => alert.id !== alertId));
      }
    } catch (error) {
      console.error('Error marking alert as read:', error);
      // Fallback: remove from local state
      setSystemAlerts(prev => prev.filter(alert => alert.id !== alertId));
    }
  };

  const markAllAlertsAsRead = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/user-management`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ 
          action: 'mark_all_alerts_read',
          user_role: currentUser?.role
        })
      });

      if (response.ok) {
        setSystemAlerts([]);
      } else {
        // Fallback: clear local state
        setSystemAlerts([]);
      }
    } catch (error) {
      console.error('Error marking all alerts as read:', error);
      // Fallback: clear local state
      setSystemAlerts([]);
    }
  };

  const unreadAlertsCount = systemAlerts.filter(alert => !alert.is_read).length;

  const getAlertIconColor = () => {
    if (currentUser?.role === 'system_admin') return 'red';
    if (currentUser?.role === 'hr_manager') return 'orange';
    if (currentUser?.role === 'manager') return 'blue';
    return 'green';
  };

  const alertColor = getAlertIconColor();

  return (
    <header className="bg-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg" style={{ fontFamily: '"Pacifico", serif' }}>E</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: '"Pacifico", serif' }}>
                Elite Car Solutions
              </h1>
              <p className="text-xs text-gray-500">HR Management Portal</p>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              // Logged in user menu
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  {/* System Alerts for All Users */}
                  <div className="relative">
                    <button
                      onClick={() => setShowAlerts(!showAlerts)}
                      className={`w-8 h-8 bg-${alertColor}-100 rounded-full flex items-center justify-center relative cursor-pointer hover:bg-${alertColor}-200 transition-colors`}
                    >
                      <i className={`ri-notification-${unreadAlertsCount > 0 ? 'fill' : 'line'} text-${alertColor}-600`}></i>
                      {unreadAlertsCount > 0 && (
                        <span className={`absolute -top-1 -right-1 bg-${alertColor}-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center`}>
                          {unreadAlertsCount}
                        </span>
                      )}
                    </button>

                    {/* Alerts Dropdown */}
                    {showAlerts && (
                      <div className="absolute right-0 top-10 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                        <div className="p-4 border-b border-gray-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {currentUser.role === 'system_admin' ? 'System Alerts' : 
                                 currentUser.role === 'hr_manager' ? 'HR Notifications' :
                                 currentUser.role === 'manager' ? 'Team Notifications' : 'Notifications'}
                              </h3>
                              <p className="text-sm text-gray-500">{unreadAlertsCount} unread notifications</p>
                            </div>
                            {unreadAlertsCount > 0 && (
                              <button
                                onClick={markAllAlertsAsRead}
                                className="text-blue-600 hover:text-blue-800 text-xs cursor-pointer"
                              >
                                Mark All Read
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {systemAlerts.length > 0 ? (
                            systemAlerts.map((alert) => (
                              <div key={alert.id} className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${!alert.is_read ? 'bg-blue-50' : ''}`}>
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <i className={`${alert.type === 'error' ? 'ri-error-warning-line text-red-500' : 
                                                    alert.type === 'warning' ? 'ri-alert-line text-yellow-500' : 
                                                    'ri-information-line text-blue-500'}`}></i>
                                      <span className="font-medium text-sm text-gray-900">{alert.title}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">{new Date(alert.created_at).toLocaleString()}</p>
                                  </div>
                                  {!alert.is_read && (
                                    <button
                                      onClick={() => markAlertAsRead(alert.id)}
                                      className="text-blue-600 hover:text-blue-800 text-xs cursor-pointer ml-2"
                                    >
                                      <i className="ri-check-line"></i>
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-500">
                              <i className="ri-notification-off-line text-2xl mb-2"></i>
                              <p>No notifications</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {currentUser.full_name?.charAt(0) || currentUser.username?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{currentUser.full_name || currentUser.username}</p>
                      <p className="text-gray-500 capitalize">{currentUser.role?.replace('_', ' ')}</p>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300 whitespace-nowrap cursor-pointer flex items-center"
                >
                  <i className="ri-logout-box-line mr-2"></i>
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              // Not logged in - show login button
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="ri-notification-line text-blue-600"></i>
                </div>
                
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <i className="ri-user-line text-gray-600"></i>
                </div>
                
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300 whitespace-nowrap cursor-pointer">
                  <i className="ri-login-box-line mr-2"></i>
                  Login
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <i className={`${isMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-2xl`}></i>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="px-4">
              {currentUser ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {currentUser.full_name?.charAt(0) || currentUser.username?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{currentUser.full_name || currentUser.username}</p>
                      <p className="text-sm text-gray-500 capitalize">{currentUser.role?.replace('_', ' ')}</p>
                    </div>
                  </div>
                  
                  {/* Mobile Notifications for All Users */}
                  {unreadAlertsCount > 0 && (
                    <div className={`p-3 bg-${alertColor}-50 rounded-lg`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <i className={`ri-notification-fill text-${alertColor}-600`}></i>
                        <span className={`font-medium text-${alertColor}-900`}>
                          {currentUser.role === 'system_admin' ? 'System Alerts' : 
                           currentUser.role === 'hr_manager' ? 'HR Notifications' :
                           currentUser.role === 'manager' ? 'Team Notifications' : 'Notifications'} ({unreadAlertsCount})
                        </span>
                      </div>
                      <p className={`text-sm text-${alertColor}-700`}>You have {unreadAlertsCount} unread notifications</p>
                      <button
                        onClick={() => setShowAlerts(true)}
                        className={`mt-2 text-${alertColor}-600 hover:text-${alertColor}-800 text-sm cursor-pointer`}
                      >
                        View Notifications
                      </button>
                    </div>
                  )}
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-300 whitespace-nowrap cursor-pointer flex items-center justify-center"
                  >
                    <i className="ri-logout-box-line mr-2"></i>
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-300 whitespace-nowrap cursor-pointer">
                  <i className="ri-login-box-line mr-2"></i>
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
