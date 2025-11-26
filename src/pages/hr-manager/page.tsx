
import { useState } from 'react';
import { HRDashboard } from './components/HRDashboard';
import { EmployeeManagement } from './components/EmployeeManagement';
import { LeaveRequestsManagement } from './components/LeaveRequestsManagement';
import { PayrollOverview } from './components/PayrollOverview';
import { AttendanceOverview } from './components/AttendanceOverview';

export default function HRManagerPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: 'ri-dashboard-line' },
    { id: 'employees', name: 'Employees', icon: 'ri-team-line' },
    { id: 'attendance', name: 'Attendance', icon: 'ri-time-line' },
    { id: 'leave', name: 'Leave Requests', icon: 'ri-calendar-check-line' },
    { id: 'payroll', name: 'Payroll', icon: 'ri-money-dollar-circle-line' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.REACT_APP_NAVIGATE('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <HRDashboard />;
      case 'employees':
        return <EmployeeManagement />;
      case 'attendance':
        return <AttendanceOverview />;
      case 'leave':
        return <LeaveRequestsManagement />;
      case 'payroll':
        return <PayrollOverview />;
      default:
        return <HRDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">HR Manager Portal</h1>
              <p className="text-gray-600">Manage employees, attendance, and HR operations</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live Data</span>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center"
              >
                <i className="ri-logout-box-line mr-2"></i>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className={`${tab.icon} text-lg`}></i>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
  );
}
