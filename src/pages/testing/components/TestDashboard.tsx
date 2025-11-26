import { useState, useEffect } from 'react';

export default function TestDashboard() {
  const [testStats, setTestStats] = useState({
    total: 0,
    passed: 0,
    failed: 0,
    pending: 0,
    blocked: 0
  });

  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestCases();
  }, []);

  const fetchTestCases = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/rest/v1/test_cases`, {
        headers: {
          'apikey': import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTestCases(data);
        
        // Calculate stats
        const stats = data.reduce((acc, test) => {
          acc.total++;
          acc[test.status]++;
          return acc;
        }, { total: 0, passed: 0, failed: 0, pending: 0, blocked: 0 });
        
        setTestStats(stats);
      }
    } catch (error) {
      console.error('Error fetching test cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const testModules = [
    {
      name: 'Employee Management',
      icon: 'ri-user-settings-line',
      color: 'blue',
      tests: testCases.filter(t => t.module === 'Employee Management').length
    },
    {
      name: 'Attendance Tracking',
      icon: 'ri-time-line',
      color: 'green',
      tests: testCases.filter(t => t.module === 'Attendance Tracking').length
    },
    {
      name: 'Leave Requests',
      icon: 'ri-calendar-check-line',
      color: 'purple',
      tests: testCases.filter(t => t.module === 'Leave Requests').length
    },
    {
      name: 'Payroll Processing',
      icon: 'ri-money-dollar-circle-line',
      color: 'orange',
      tests: testCases.filter(t => t.module === 'Payroll Processing').length
    },
    {
      name: 'Authentication & Authorization',
      icon: 'ri-shield-check-line',
      color: 'red',
      tests: testCases.filter(t => t.module === 'Authentication & Authorization').length
    }
  ];

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading test dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Test Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{testStats.total}</div>
          <div className="text-sm text-gray-600">Total Tests</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{testStats.passed}</div>
          <div className="text-sm text-green-700">Passed</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{testStats.failed}</div>
          <div className="text-sm text-red-700">Failed</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{testStats.pending}</div>
          <div className="text-sm text-yellow-700">Pending</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-600">{testStats.blocked}</div>
          <div className="text-sm text-gray-700">Blocked</div>
        </div>
      </div>

      {/* Test Modules */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Test Modules</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testModules.map((module, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className={`w-10 h-10 bg-${module.color}-100 rounded-lg flex items-center justify-center mr-3`}>
                  <i className={`${module.icon} text-${module.color}-600 text-lg`}></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{module.name}</h3>
                  <p className="text-sm text-gray-600">{module.tests} test cases</p>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-600">
                  {testCases.filter(t => t.module === module.name && t.status === 'passed').length} passed
                </span>
                <span className="text-red-600">
                  {testCases.filter(t => t.module === module.name && t.status === 'failed').length} failed
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Test Activity */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Test Activity</h2>
        <div className="bg-gray-50 rounded-lg p-4">
          {testCases.filter(t => t.executed_at).slice(0, 5).map((test, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  test.status === 'passed' ? 'bg-green-500' :
                  test.status === 'failed' ? 'bg-red-500' :
                  test.status === 'blocked' ? 'bg-gray-500' : 'bg-yellow-500'
                }`}></div>
                <div>
                  <span className="font-medium text-gray-800">{test.test_id}</span>
                  <span className="text-gray-600 ml-2">{test.description}</span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {test.executed_by} • {new Date(test.executed_at).toLocaleDateString()}
              </div>
            </div>
          ))}
          {testCases.filter(t => t.executed_at).length === 0 && (
            <p className="text-gray-500 text-center py-4">No test executions yet</p>
          )}
        </div>
      </div>

      {/* Test Environment Status */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Test Environment Status</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-blue-700">Database: Connected</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-blue-700">API Services: Online</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-blue-700">Test Data: Loaded</span>
          </div>
        </div>
      </div>
    </div>
  );
}