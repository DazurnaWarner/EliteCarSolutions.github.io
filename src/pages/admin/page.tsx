
import { useState, useEffect } from 'react';
import Header from '../../components/feature/Header';
import UserManagement from './components/UserManagement';
import RolePermissions from './components/RolePermissions';
import AuditLogs from './components/AuditLogs';
import SystemSettings from './components/SystemSettings';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('users');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Get current user from localStorage or session
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const tabs = [
    { id: 'users', label: 'User Management', icon: 'ri-user-settings-line' },
    { id: 'roles', label: 'Role Permissions', icon: 'ri-shield-user-line' },
    { id: 'audit', label: 'Audit Logs', icon: 'ri-file-list-3-line' },
    { id: 'settings', label: 'System Settings', icon: 'ri-settings-3-line' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">System Administration</h1>
            <p className="text-gray-600">Manage users, roles, permissions, and system configuration</p>
          </div>

          {/* Admin Navigation Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
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
          <div className="bg-white rounded-lg shadow-sm">
            {activeTab === 'users' && <UserManagement currentUser={currentUser} />}
            {activeTab === 'roles' && <RolePermissions currentUser={currentUser} />}
            {activeTab === 'audit' && <AuditLogs currentUser={currentUser} />}
            {activeTab === 'settings' && <SystemSettings currentUser={currentUser} />}
          </div>
        </div>
      </main>
    </div>
  );
}
