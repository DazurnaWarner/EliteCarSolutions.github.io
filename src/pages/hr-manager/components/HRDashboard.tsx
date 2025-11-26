
import { useState, useEffect } from 'react';

export function HRDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 10,
    presentToday: 8,
    lateArrivals: 1,
    pendingLeaveRequests: 3,
    departments: [
      { name: 'IT Development', count: 2, percentage: 20 },
      { name: 'Quality Assurance', count: 2, percentage: 20 },
      { name: 'IT Operations', count: 2, percentage: 20 },
      { name: 'Design', count: 2, percentage: 20 },
      { name: 'IT Security', count: 1, percentage: 10 },
      { name: 'Data Management', count: 1, percentage: 10 }
    ],
    weeklyStats: {
      totalHours: 320,
      averageHours: 32,
      attendanceRate: 85
    },
    recentActivity: [
      { id: 1, type: 'attendance', message: 'Quincy Fevriere checked in', time: '9:15 AM', icon: 'ri-time-line', color: 'text-green-600' },
      { id: 2, type: 'leave', message: 'Kimon Elizee submitted leave request', time: '8:45 AM', icon: 'ri-calendar-line', color: 'text-blue-600' },
      { id: 3, type: 'payroll', message: 'Monthly payroll processed', time: 'Yesterday', icon: 'ri-money-dollar-circle-line', color: 'text-purple-600' },
      { id: 4, type: 'employee', message: 'Humayra Amin profile updated', time: 'Yesterday', icon: 'ri-user-line', color: 'text-orange-600' },
      { id: 5, type: 'attendance', message: 'Leon Frazer checked out', time: '6:00 PM', icon: 'ri-time-line', color: 'text-red-600' }
    ]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/hr-operations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          action: 'get_dashboard_stats'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setDashboardData(prev => ({
            ...prev,
            ...data.stats
          }));
        }
      }
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    { title: 'Add Employee', icon: 'ri-user-add-line', color: 'bg-blue-500', action: () => console.log('Add employee') },
    { title: 'Process Payroll', icon: 'ri-money-dollar-circle-line', color: 'bg-green-500', action: () => console.log('Process payroll') },
    { title: 'Generate Report', icon: 'ri-file-chart-line', color: 'bg-purple-500', action: () => console.log('Generate report') },
    { title: 'System Settings', icon: 'ri-settings-3-line', color: 'bg-orange-500', action: () => console.log('System settings') }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">HR Dashboard</h2>
          <p className="text-gray-600">Elite Car Solutions Inc. - HR Management Overview</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <button
            onClick={fetchDashboardData}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                Refreshing...
              </>
            ) : (
              <>
                <i className="ri-refresh-line mr-2"></i>
                Refresh
              </>
            )}
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.totalEmployees}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-team-line text-blue-600 text-xl"></i>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">Active Team</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Present Today</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.presentToday}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-checkbox-circle-line text-green-600 text-xl"></i>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">
              {Math.round((dashboardData.presentToday / dashboardData.totalEmployees) * 100)}% attendance rate
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Late Arrivals</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.lateArrivals}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <i className="ri-time-line text-orange-600 text-xl"></i>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-orange-600">Needs attention</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.pendingLeaveRequests}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="ri-calendar-check-line text-purple-600 text-xl"></i>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-purple-600">Leave requests</span>
          </div>
        </div>
      </div>

      {/* Department Breakdown & Weekly Overview */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Department Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Breakdown</h3>
          <div className="space-y-4">
            {dashboardData.departments.map((dept, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" style={{backgroundColor: `hsl(${index * 60}, 70%, 50%)`}}></div>
                  <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{dept.count} employees</span>
                  <span className="text-xs text-gray-500">({dept.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Overview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Hours Worked</span>
              <span className="text-lg font-semibold text-gray-900">{dashboardData.weeklyStats.totalHours}h</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average per Employee</span>
              <span className="text-lg font-semibold text-gray-900">{dashboardData.weeklyStats.averageHours}h</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Attendance Rate</span>
              <span className="text-lg font-semibold text-green-600">{dashboardData.weeklyStats.attendanceRate}%</span>
            </div>
            <div className="mt-4 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{width: `${dashboardData.weeklyStats.attendanceRate}%`}}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {dashboardData.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                  <i className={`${activity.icon} ${activity.color} text-sm`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-2`}>
                  <i className={`${action.icon} text-white text-lg`}></i>
                </div>
                <span className="text-sm font-medium text-gray-700">{action.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
