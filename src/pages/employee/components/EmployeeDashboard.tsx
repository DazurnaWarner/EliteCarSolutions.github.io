import { useState, useEffect } from 'react';

interface EmployeeDashboardProps {
  onTabChange?: (tab: string) => void;
  currentUser?: any;
}

export default function EmployeeDashboard({ onTabChange, currentUser }: EmployeeDashboardProps) {
  const [stats, setStats] = useState([
    { label: 'Hours This Week', value: '0', icon: 'ri-time-line', color: 'blue' },
    { label: 'Leave Balance', value: '0 days', icon: 'ri-calendar-line', color: 'green' },
    { label: 'Pending Requests', value: '0', icon: 'ri-file-list-line', color: 'orange' },
    { label: 'This Month Pay', value: '$0', icon: 'ri-money-dollar-circle-line', color: 'purple' }
  ]);

  useEffect(() => {
    if (currentUser) {
      fetchEmployeeData();
    }
  }, [currentUser]);

  const fetchEmployeeData = async () => {
    try {
      const response = await fetch('https://sxspdcofjldpexpzbugr.supabase.co/functions/v1/attendance-tracking', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ 
          action: 'get_employee_stats',
          employee_id: currentUser.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats([
            { label: 'Hours This Week', value: data.stats.hours_this_week || '0', icon: 'ri-time-line', color: 'blue' },
            { label: 'Leave Balance', value: `${data.stats.leave_balance || 0} days`, icon: 'ri-calendar-line', color: 'green' },
            { label: 'Pending Requests', value: data.stats.pending_requests || '0', icon: 'ri-file-list-line', color: 'orange' },
            { label: 'This Month Pay', value: `$${data.stats.monthly_pay || 0}`, icon: 'ri-money-dollar-circle-line', color: 'purple' }
          ]);
        }
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  const recentActivity = [
    { action: 'Clocked In', time: 'Today 9:00 AM', icon: 'ri-login-circle-line', color: 'green' },
    { action: 'Leave Request Approved', time: 'Yesterday 3:30 PM', icon: 'ri-check-circle-line', color: 'blue' },
    { action: 'Timesheet Submitted', time: 'Dec 15, 2:15 PM', icon: 'ri-file-check-line', color: 'purple' },
    { action: 'Profile Updated', time: 'Dec 14, 11:20 AM', icon: 'ri-user-settings-line', color: 'orange' }
  ];

  const upcomingEvents = [
    { title: 'Team Meeting', date: 'Tomorrow 10:00 AM', type: 'meeting' },
    { title: 'Annual Leave', date: 'Dec 25-26', type: 'leave' },
    { title: 'Performance Review', date: 'Jan 5, 2:00 PM', type: 'review' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <i className={`${stat.icon} text-xl text-${stat.color}-600`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-8 h-8 bg-${activity.color}-100 rounded-full flex items-center justify-center`}>
                  <i className={`${activity.icon} text-sm text-${activity.color}-600`}></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    event.type === 'meeting' ? 'bg-blue-500' :
                    event.type === 'leave' ? 'bg-green-500' : 'bg-purple-500'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-500">{event.date}</p>
                  </div>
                </div>
                <i className="ri-arrow-right-s-line text-gray-400"></i>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
