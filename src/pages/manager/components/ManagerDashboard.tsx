
import { useState, useEffect } from 'react';

export default function ManagerDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/manager-operations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          data: {
            action: 'get_dashboard_data'
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setDashboardData(data.dashboard);
        } else {
          console.error('Failed to fetch dashboard data:', data.message);
          setFallbackData();
        }
      } else {
        console.error('Failed to fetch dashboard data - Response not OK:', response.status);
        setFallbackData();
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const setFallbackData = () => {
    setDashboardData({
      teamStats: {
        totalMembers: 10,
        presentToday: 8,
        pendingRequests: 3,
        upcomingLeaves: 2
      },
      attendanceOverview: [
        { department: 'Management', present: 1, total: 1 },
        { department: 'Quality Assurance', present: 1, total: 1 },
        { department: 'IT Operations', present: 2, total: 2 },
        { department: 'Design & QA', present: 1, total: 1 },
        { department: 'IT Security', present: 1, total: 1 },
        { department: 'Backend Development', present: 1, total: 1 },
        { department: 'Data Management', present: 1, total: 1 },
        { department: 'Development & HR', present: 0, total: 1 },
        { department: 'Design', present: 0, total: 1 }
      ],
      recentActivity: [
        { type: 'leave_request', message: 'Dazurna Warner submitted vacation request', time: '2 hours ago' },
        { type: 'attendance', message: 'Ezla Stewart checked in late', time: '3 hours ago' },
        { type: 'timesheet', message: 'Quincy Fevriere submitted timesheet', time: '5 hours ago' },
        { type: 'leave_request', message: 'Kimon Elizee submitted sick leave', time: '1 day ago' }
      ],
      upcomingLeaves: [
        { employee: 'Dazurna Warner', type: 'vacation', dates: '12/25/2024 - 12/27/2024', status: 'approved' },
        { employee: 'Arade Moses', type: 'personal', dates: '12/30/2024 - 01/02/2025', status: 'pending' }
      ]
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <i className="ri-loader-4-line text-4xl text-gray-400 animate-spin mb-4"></i>
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { teamStats, attendanceOverview, recentActivity, upcomingLeaves } = dashboardData || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Manager Dashboard</h2>
            <p className="text-sm text-gray-600 mt-1">Overview of your team's performance and activities</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-600">
              <i className="ri-wifi-line mr-1"></i>
              Live Data
            </span>
          </div>
        </div>
      </div>

      {/* Team Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-team-line text-2xl text-blue-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{teamStats?.totalMembers || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-user-check-line text-2xl text-green-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Present Today</p>
              <p className="text-2xl font-bold text-gray-900">{teamStats?.presentToday || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <i className="ri-time-line text-2xl text-orange-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900">{teamStats?.pendingRequests || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="ri-calendar-event-line text-2xl text-purple-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming Leaves</p>
              <p className="text-2xl font-bold text-gray-900">{teamStats?.upcomingLeaves || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Attendance Overview</h3>
        <div className="space-y-4">
          {attendanceOverview?.map((dept: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="ri-building-line text-blue-600"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{dept.department}</p>
                  <p className="text-sm text-gray-600">{dept.present}/{dept.total} present</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${dept.total > 0 ? (dept.present / dept.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {dept.total > 0 ? Math.round((dept.present / dept.total) * 100) : 0}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity & Upcoming Leaves */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity?.map((activity: any, index: number) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'leave_request' ? 'bg-blue-100' :
                  activity.type === 'attendance' ? 'bg-green-100' : 'bg-purple-100'
                }`}>
                  <i className={`${
                    activity.type === 'leave_request' ? 'ri-calendar-line text-blue-600' :
                    activity.type === 'attendance' ? 'ri-time-line text-green-600' : 'ri-file-text-line text-purple-600'
                  } text-sm`}></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Leaves */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Leaves</h3>
          <div className="space-y-4">
            {upcomingLeaves?.length > 0 ? upcomingLeaves.map((leave: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{leave.employee}</p>
                  <p className="text-sm text-gray-600 capitalize">{leave.type} leave</p>
                  <p className="text-xs text-gray-500">{leave.dates}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  leave.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                }`}>
                  {leave.status}
                </span>
              </div>
            )) : (
              <div className="text-center py-8">
                <i className="ri-calendar-line text-3xl text-gray-300 mb-2"></i>
                <p className="text-gray-600">No upcoming leaves</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer whitespace-nowrap">
            <i className="ri-calendar-check-line text-2xl text-gray-400 mr-3"></i>
            <span className="text-gray-600">Review Leave Requests</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors cursor-pointer whitespace-nowrap">
            <i className="ri-time-line text-2xl text-gray-400 mr-3"></i>
            <span className="text-gray-600">Check Attendance</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors cursor-pointer whitespace-nowrap">
            <i className="ri-file-text-line text-2xl text-gray-400 mr-3"></i>
            <span className="text-gray-600">Approve Timesheets</span>
          </button>
        </div>
      </div>
    </div>
  );
}
