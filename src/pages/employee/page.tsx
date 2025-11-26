
import { useState, useEffect } from 'react';
import Header from '../../components/feature/Header';
import EmployeeDashboard from './components/EmployeeDashboard';
import AttendanceTracker from './components/AttendanceTracker';
import LeaveRequests from './components/LeaveRequests';
import PayStubs from './components/PayStubs';
import PersonalProfile from './components/PersonalProfile';

export default function Employee() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Get current user from localStorage (whoever logged in)
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      console.log('Current user data:', user); // Debug log
      setCurrentUser(user);
    }
  }, []);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line' },
    { id: 'attendance', label: 'Attendance', icon: 'ri-time-line' },
    { id: 'leave', label: 'Leave Requests', icon: 'ri-calendar-check-line' },
    { id: 'paystubs', label: 'Pay Stubs', icon: 'ri-money-dollar-circle-line' },
    { id: 'profile', label: 'Personal Profile', icon: 'ri-user-line' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <EmployeeDashboard onTabChange={setActiveTab} currentUser={currentUser} />;
      case 'attendance':
        return <AttendanceTracker currentUser={currentUser} />;
      case 'leave':
        return <LeaveRequests currentUser={currentUser} />;
      case 'paystubs':
        return <PayStubs currentUser={currentUser} />;
      case 'profile':
        return <PersonalProfile currentUser={currentUser} />;
      default:
        return <EmployeeDashboard onTabChange={setActiveTab} currentUser={currentUser} />;
    }
  };

  // Get the user's display name
  const getUserDisplayName = () => {
    if (!currentUser) return 'Employee';
    
    // Try different name formats from the login response
    if (currentUser.firstName && currentUser.lastName) {
      return `${currentUser.firstName} ${currentUser.lastName}`;
    }
    if (currentUser.first_name && currentUser.last_name) {
      return `${currentUser.first_name} ${currentUser.last_name}`;
    }
    if (currentUser.full_name) {
      return currentUser.full_name;
    }
    if (currentUser.firstName) {
      return currentUser.firstName;
    }
    if (currentUser.first_name) {
      return currentUser.first_name;
    }
    if (currentUser.username) {
      return currentUser.username;
    }
    if (currentUser.email) {
      return currentUser.email.split('@')[0];
    }
    
    return 'Employee';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Employee Portal</h1>
            <p className="mt-2 text-sm text-gray-600">
              Welcome back, {getUserDisplayName()}! Manage your attendance, leave requests, and personal information.
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <i className={`${tab.icon} mr-2`}></i>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div>{renderContent()}</div>
        </div>
      </main>
    </div>
  );
}
