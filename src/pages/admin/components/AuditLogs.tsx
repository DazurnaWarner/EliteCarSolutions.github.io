import { useState, useEffect } from 'react';

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  module: string;
  details: any;
  ip_address: string;
  user_agent: string;
  timestamp: string;
  user_accounts?: {
    username: string;
    first_name: string;
    last_name: string;
  };
}

interface AuditLogsProps {
  currentUser: any;
}

export default function AuditLogs({ currentUser }: AuditLogsProps) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7');

  const modules = [
    'authentication', 'user_management', 'payroll', 'attendance', 
    'leave_management', 'system_config', 'reports', 'data_export'
  ];

  const actions = [
    'login', 'logout', 'create_user', 'update_user', 'delete_user',
    'reset_password', 'process_payroll', 'approve_leave', 'deny_leave',
    'clock_in', 'clock_out', 'export_data', 'generate_report'
  ];

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/user-management`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ action: 'getAuditLogs' })
      });
      
      const data = await response.json();
      if (data.success) {
        setLogs(data.logs);
      } else {
        console.error('Failed to fetch audit logs:', data.message);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user_accounts?.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    
    // Date filter
    const logDate = new Date(log.timestamp);
    const daysAgo = parseInt(dateRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
    const matchesDate = dateRange === 'all' || logDate >= cutoffDate;
    
    return matchesSearch && matchesModule && matchesAction && matchesDate;
  });

  const getActionIcon = (action: string) => {
    const iconMap: Record<string, string> = {
      login: 'ri-login-circle-line',
      logout: 'ri-logout-circle-line',
      create_user: 'ri-user-add-line',
      update_user: 'ri-user-settings-line',
      delete_user: 'ri-user-unfollow-line',
      reset_password: 'ri-lock-password-line',
      process_payroll: 'ri-money-dollar-circle-line',
      approve_leave: 'ri-checkbox-circle-line',
      deny_leave: 'ri-close-circle-line',
      clock_in: 'ri-time-line',
      clock_out: 'ri-timer-line',
      export_data: 'ri-download-line',
      generate_report: 'ri-file-chart-line'
    };
    return iconMap[action] || 'ri-information-line';
  };

  const getActionColor = (action: string) => {
    const colorMap: Record<string, string> = {
      login: 'text-green-600',
      logout: 'text-gray-600',
      create_user: 'text-blue-600',
      update_user: 'text-yellow-600',
      delete_user: 'text-red-600',
      reset_password: 'text-orange-600',
      process_payroll: 'text-purple-600',
      approve_leave: 'text-green-600',
      deny_leave: 'text-red-600',
      clock_in: 'text-blue-600',
      clock_out: 'text-gray-600',
      export_data: 'text-indigo-600',
      generate_report: 'text-teal-600'
    };
    return colorMap[action] || 'text-gray-600';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Module', 'IP Address', 'Details'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp,
        log.user_accounts?.username || 'Unknown',
        log.action,
        log.module,
        log.ip_address,
        JSON.stringify(log.details || {})
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
        <h2 className="text-2xl font-bold text-gray-900">Audit Logs</h2>
        <button
          onClick={exportLogs}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
        >
          <i className="ri-download-line mr-2"></i>
          Export Logs
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div>
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <div>
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-8"
          >
            <option value="all">All Modules</option>
            {modules.map(module => (
              <option key={module} value={module}>{module.replace('_', ' ').toUpperCase()}</option>
            ))}
          </select>
        </div>
        <div>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-8"
          >
            <option value="all">All Actions</option>
            {actions.map(action => (
              <option key={action} value={action}>{action.replace('_', ' ').toUpperCase()}</option>
            ))}
          </select>
        </div>
        <div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-8"
          >
            <option value="1">Last 24 hours</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="all">All time</option>
          </select>
        </div>
        <div className="text-sm text-gray-500 flex items-center">
          {filteredLogs.length} of {logs.length} logs
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => {
                const timestamp = formatTimestamp(log.timestamp);
                return (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{timestamp.date}</div>
                      <div className="text-xs text-gray-500">{timestamp.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 text-xs font-medium">
                            {log.user_accounts?.first_name?.[0] || 'U'}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {log.user_accounts?.first_name} {log.user_accounts?.last_name}
                          </div>
                          <div className="text-xs text-gray-500">@{log.user_accounts?.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <i className={`${getActionIcon(log.action)} ${getActionColor(log.action)} mr-2`}></i>
                        <span className="text-sm text-gray-900">{log.action.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {log.module.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.ip_address}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {log.details ? JSON.stringify(log.details) : 'No details'}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-12">
          <i className="ri-file-list-3-line text-4xl text-gray-400 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No audit logs found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or date range.</p>
        </div>
      )}
    </div>
  );
}