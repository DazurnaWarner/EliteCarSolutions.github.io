import { useState, useEffect } from 'react';

interface Permission {
  id: string;
  role: string;
  module: string;
  permission: string;
  description: string;
}

interface RolePermissionsProps {
  currentUser: any;
}

export default function RolePermissions({ currentUser }: RolePermissionsProps) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('all');

  const roles = [
    { value: 'system_admin', label: 'System Administrator', color: 'bg-red-100 text-red-800' },
    { value: 'hr_manager', label: 'HR Manager', color: 'bg-purple-100 text-purple-800' },
    { value: 'manager', label: 'Manager', color: 'bg-blue-100 text-blue-800' },
    { value: 'employee', label: 'Employee', color: 'bg-green-100 text-green-800' },
    { value: 'auditor', label: 'Auditor', color: 'bg-orange-100 text-orange-800' }
  ];

  const modules = [
    { name: 'system', label: 'System Configuration', icon: 'ri-settings-3-line' },
    { name: 'roles', label: 'Role Management', icon: 'ri-shield-user-line' },
    { name: 'payroll', label: 'Payroll Management', icon: 'ri-money-dollar-circle-line' },
    { name: 'attendance', label: 'Attendance Tracking', icon: 'ri-time-line' },
    { name: 'leave', label: 'Leave Management', icon: 'ri-calendar-check-line' },
    { name: 'audit', label: 'Audit & Compliance', icon: 'ri-file-list-3-line' },
    { name: 'data', label: 'Data Export', icon: 'ri-download-line' },
    { name: 'reports', label: 'Reports', icon: 'ri-bar-chart-line' },
    { name: 'schedules', label: 'Schedule Management', icon: 'ri-calendar-line' },
    { name: 'profile', label: 'Profile Management', icon: 'ri-user-line' },
    { name: 'logs', label: 'System Logs', icon: 'ri-file-text-line' },
    { name: 'access', label: 'Access Control', icon: 'ri-lock-line' }
  ];

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      // Simulate fetching permissions from the database
      const mockPermissions: Permission[] = [
        // System Administrator
        { id: '1', role: 'system_admin', module: 'system', permission: 'full_control', description: 'Full control over configuration' },
        { id: '2', role: 'system_admin', module: 'roles', permission: 'provision', description: 'Role provisioning' },
        { id: '3', role: 'system_admin', module: 'payroll', permission: 'lock_periods', description: 'Payroll period locking' },
        { id: '4', role: 'system_admin', module: 'audit', permission: 'retrieve', description: 'Audit retrieval' },
        { id: '5', role: 'system_admin', module: 'access', permission: 'review', description: 'Access reviews' },
        
        // HR Manager
        { id: '6', role: 'hr_manager', module: 'attendance', permission: 'manage', description: 'Manage attendance cycles' },
        { id: '7', role: 'hr_manager', module: 'payroll', permission: 'manage', description: 'Manage payroll cycles' },
        { id: '8', role: 'hr_manager', module: 'leave', permission: 'approve', description: 'Approve leave requests' },
        { id: '9', role: 'hr_manager', module: 'data', permission: 'export', description: 'Export data to ERP' },
        { id: '10', role: 'hr_manager', module: 'reports', permission: 'generate', description: 'Generate reports' },
        
        // Manager
        { id: '11', role: 'manager', module: 'leave', permission: 'approve_deny', description: 'Approve/deny leave requests' },
        { id: '12', role: 'manager', module: 'attendance', permission: 'view_team', description: 'View team attendance' },
        { id: '13', role: 'manager', module: 'schedules', permission: 'manage', description: 'Manage schedules' },
        
        // Employee
        { id: '14', role: 'employee', module: 'attendance', permission: 'clock', description: 'Clock in/out' },
        { id: '15', role: 'employee', module: 'attendance', permission: 'view_own', description: 'View own attendance' },
        { id: '16', role: 'employee', module: 'leave', permission: 'submit', description: 'Submit leave requests' },
        { id: '17', role: 'employee', module: 'payroll', permission: 'view_stubs', description: 'View pay stubs' },
        { id: '18', role: 'employee', module: 'profile', permission: 'update', description: 'Update personal details' },
        
        // Auditor
        { id: '19', role: 'auditor', module: 'logs', permission: 'view', description: 'View system logs' },
        { id: '20', role: 'auditor', module: 'audit', permission: 'view_trails', description: 'View audit trails' },
        { id: '21', role: 'auditor', module: 'payroll', permission: 'view_summaries', description: 'View payroll summaries (read-only)' }
      ];
      
      setPermissions(mockPermissions);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleInfo = (roleValue: string) => {
    return roles.find(r => r.value === roleValue) || { label: roleValue, color: 'bg-gray-100 text-gray-800' };
  };

  const getModuleInfo = (moduleName: string) => {
    return modules.find(m => m.name === moduleName) || { label: moduleName, icon: 'ri-folder-line' };
  };

  const filteredPermissions = selectedRole === 'all' 
    ? permissions 
    : permissions.filter(p => p.role === selectedRole);

  const groupedPermissions = filteredPermissions.reduce((acc, permission) => {
    if (!acc[permission.role]) {
      acc[permission.role] = {};
    }
    if (!acc[permission.role][permission.module]) {
      acc[permission.role][permission.module] = [];
    }
    acc[permission.role][permission.module].push(permission);
    return acc;
  }, {} as Record<string, Record<string, Permission[]>>);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Role Permissions Matrix</h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-8"
          >
            <option value="all">All Roles</option>
            {roles.map(role => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Role Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {roles.map(role => {
          const rolePermissions = permissions.filter(p => p.role === role.value);
          return (
            <div key={role.value} className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${role.color}`}>
                  {role.label}
                </span>
                <span className="text-sm text-gray-500">{rolePermissions.length} permissions</span>
              </div>
              <div className="text-xs text-gray-600">
                {Array.from(new Set(rolePermissions.map(p => p.module))).length} modules
              </div>
            </div>
          );
        })}
      </div>

      {/* Permissions Matrix */}
      <div className="space-y-6">
        {Object.entries(groupedPermissions).map(([role, modulePermissions]) => {
          const roleInfo = getRoleInfo(role);
          return (
            <div key={role} className="bg-white border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${roleInfo.color}`}>
                      {roleInfo.label}
                    </span>
                    <span className="text-sm text-gray-500">
                      {Object.keys(modulePermissions).length} modules, {Object.values(modulePermissions).flat().length} permissions
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(modulePermissions).map(([module, perms]) => {
                    const moduleInfo = getModuleInfo(module);
                    return (
                      <div key={module} className="border rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i className={`${moduleInfo.icon} text-blue-600 text-sm`}></i>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{moduleInfo.label}</h4>
                            <p className="text-xs text-gray-500">{perms.length} permissions</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {perms.map(permission => (
                            <div key={permission.id} className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
                              <div>
                                <div className="text-sm font-medium text-gray-700">{permission.permission}</div>
                                <div className="text-xs text-gray-500">{permission.description}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Permission Legend */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Permission Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-sm text-gray-700">Full Access</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span className="text-sm text-gray-700">Read/Write</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span className="text-sm text-gray-700">Read Only</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <span className="text-sm text-gray-700">Restricted</span>
          </div>
        </div>
      </div>
    </div>
  );
}