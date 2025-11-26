
import { useState, useEffect } from 'react';
import Header from '../../components/feature/Header';
import ManagerDashboard from './components/ManagerDashboard';
import TeamView from './components/TeamView';
import LeaveApproval from './components/LeaveApproval';
import ScheduleView from './components/ScheduleView';
import AttendanceMonitor from './components/AttendanceMonitor';
import TimesheetManagement from './components/TimesheetManagement';

export default function ManagerPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line' },
    { id: 'team', label: 'My Team', icon: 'ri-team-line' },
    { id: 'leave', label: 'Leave Requests', icon: 'ri-calendar-check-line' },
    { id: 'schedule', label: 'Schedule', icon: 'ri-calendar-2-line' },
    { id: 'attendance', label: 'Attendance', icon: 'ri-time-line' },
    { id: 'timesheet', label: 'Timesheets', icon: 'ri-file-list-3-line' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manager Portal</h1>
            <p className="text-gray-600">Manage your team, approve requests, and monitor performance</p>
          </div>

          {/* Manager Navigation Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <i className={`${tab.icon} text-lg`}></i>
                      <span>{tab.label}</span>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'dashboard' && <ManagerDashboard currentUser={currentUser} />}
            {activeTab === 'team' && <TeamView currentUser={currentUser} />}
            {activeTab === 'leave' && <LeaveApproval currentUser={currentUser} />}
            {activeTab === 'schedule' && <ScheduleView currentUser={currentUser} />}
            {activeTab === 'attendance' && <AttendanceMonitor currentUser={currentUser} />}
            {activeTab === 'timesheet' && <TimesheetManagement currentUser={currentUser} />}
          </div>
        </div>
      </main>
    </div>
  );
}
