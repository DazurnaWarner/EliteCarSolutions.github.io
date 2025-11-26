import { useState, useEffect } from 'react';

interface SystemSettingsProps {
  currentUser: any;
}

export default function SystemSettings({ currentUser }: SystemSettingsProps) {
  const [settings, setSettings] = useState({
    // General Settings
    companyName: 'Elite Car Solutions Inc.',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    
    // Security Settings
    sessionTimeout: 30,
    passwordMinLength: 8,
    requireMFA: false,
    allowRemoteAccess: true,
    
    // Payroll Settings
    payPeriodType: 'bi-weekly',
    overtimeThreshold: 40,
    overtimeRate: 1.5,
    defaultTaxRate: 0.25,
    
    // Attendance Settings
    clockInGracePeriod: 5,
    autoClockOut: true,
    autoClockOutTime: '18:00',
    requireLocationVerification: false,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    payrollReminders: true,
    leaveRequestAlerts: true,
    
    // Backup Settings
    autoBackup: true,
    backupFrequency: 'daily',
    retentionPeriod: 90,
    
    // Integration Settings
    erpIntegration: false,
    erpEndpoint: '',
    apiRateLimit: 1000
  });

  const [activeSection, setActiveSection] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  const sections = [
    { id: 'general', label: 'General', icon: 'ri-settings-3-line' },
    { id: 'security', label: 'Security', icon: 'ri-shield-check-line' },
    { id: 'payroll', label: 'Payroll', icon: 'ri-money-dollar-circle-line' },
    { id: 'attendance', label: 'Attendance', icon: 'ri-time-line' },
    { id: 'notifications', label: 'Notifications', icon: 'ri-notification-3-line' },
    { id: 'backup', label: 'Backup & Recovery', icon: 'ri-database-2-line' },
    { id: 'integration', label: 'Integrations', icon: 'ri-links-line' }
  ];

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasChanges(false);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      // Reset to default values
      setHasChanges(true);
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'system_settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
        <div className="flex space-x-3">
          <button
            onClick={exportSettings}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
          >
            <i className="ri-download-line mr-2"></i>
            Export
          </button>
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
          >
            <i className="ri-refresh-line mr-2"></i>
            Reset
          </button>
          <button
            onClick={saveSettings}
            disabled={!hasChanges || saving}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              hasChanges && !saving
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {saving ? (
              <>
                <i className="ri-loader-4-line mr-2 animate-spin"></i>
                Saving...
              </>
            ) : (
              <>
                <i className="ri-save-line mr-2"></i>
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  activeSection === section.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <i className={`${section.icon} mr-3`}></i>
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-white border rounded-lg p-6">
            {activeSection === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                    <input
                      type="text"
                      value={settings.companyName}
                      onChange={(e) => handleSettingChange('companyName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => handleSettingChange('timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-8"
                    >
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                    <select
                      value={settings.dateFormat}
                      onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-8"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select
                      value={settings.currency}
                      onChange={(e) => handleSettingChange('currency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-8"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Password Length</label>
                    <input
                      type="number"
                      value={settings.passwordMinLength}
                      onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.requireMFA}
                      onChange={(e) => handleSettingChange('requireMFA', e.target.checked)}
                      className="mr-3"
                    />
                    <span className="text-sm text-gray-700">Require Multi-Factor Authentication</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.allowRemoteAccess}
                      onChange={(e) => handleSettingChange('allowRemoteAccess', e.target.checked)}
                      className="mr-3"
                    />
                    <span className="text-sm text-gray-700">Allow Remote Access</span>
                  </label>
                </div>
              </div>
            )}

            {activeSection === 'payroll' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Payroll Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pay Period Type</label>
                    <select
                      value={settings.payPeriodType}
                      onChange={(e) => handleSettingChange('payPeriodType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-8"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="bi-weekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Overtime Threshold (hours)</label>
                    <input
                      type="number"
                      value={settings.overtimeThreshold}
                      onChange={(e) => handleSettingChange('overtimeThreshold', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Overtime Rate Multiplier</label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.overtimeRate}
                      onChange={(e) => handleSettingChange('overtimeRate', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Tax Rate</label>
                    <input
                      type="number"
                      step="0.01"
                      value={settings.defaultTaxRate}
                      onChange={(e) => handleSettingChange('defaultTaxRate', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'attendance' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Attendance Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Clock-in Grace Period (minutes)</label>
                    <input
                      type="number"
                      value={settings.clockInGracePeriod}
                      onChange={(e) => handleSettingChange('clockInGracePeriod', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Auto Clock-out Time</label>
                    <input
                      type="time"
                      value={settings.autoClockOutTime}
                      onChange={(e) => handleSettingChange('autoClockOutTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.autoClockOut}
                      onChange={(e) => handleSettingChange('autoClockOut', e.target.checked)}
                      className="mr-3"
                    />
                    <span className="text-sm text-gray-700">Enable Auto Clock-out</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.requireLocationVerification}
                      onChange={(e) => handleSettingChange('requireLocationVerification', e.target.checked)}
                      className="mr-3"
                    />
                    <span className="text-sm text-gray-700">Require Location Verification</span>
                  </label>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
                
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                      className="mr-3"
                    />
                    <span className="text-sm text-gray-700">Enable Email Notifications</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.smsNotifications}
                      onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                      className="mr-3"
                    />
                    <span className="text-sm text-gray-700">Enable SMS Notifications</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.payrollReminders}
                      onChange={(e) => handleSettingChange('payrollReminders', e.target.checked)}
                      className="mr-3"
                    />
                    <span className="text-sm text-gray-700">Payroll Processing Reminders</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.leaveRequestAlerts}
                      onChange={(e) => handleSettingChange('leaveRequestAlerts', e.target.checked)}
                      className="mr-3"
                    />
                    <span className="text-sm text-gray-700">Leave Request Alerts</span>
                  </label>
                </div>
              </div>
            )}

            {activeSection === 'backup' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Backup & Recovery Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                    <select
                      value={settings.backupFrequency}
                      onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-8"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Retention Period (days)</label>
                    <input
                      type="number"
                      value={settings.retentionPeriod}
                      onChange={(e) => handleSettingChange('retentionPeriod', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.autoBackup}
                    onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                    className="mr-3"
                  />
                  <span className="text-sm text-gray-700">Enable Automatic Backups</span>
                </label>
              </div>
            )}

            {activeSection === 'integration' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Integration Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ERP Endpoint URL</label>
                    <input
                      type="url"
                      value={settings.erpEndpoint}
                      onChange={(e) => handleSettingChange('erpEndpoint', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="https://api.example.com/erp"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">API Rate Limit (requests/hour)</label>
                    <input
                      type="number"
                      value={settings.apiRateLimit}
                      onChange={(e) => handleSettingChange('apiRateLimit', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.erpIntegration}
                    onChange={(e) => handleSettingChange('erpIntegration', e.target.checked)}
                    className="mr-3"
                  />
                  <span className="text-sm text-gray-700">Enable ERP Integration</span>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}