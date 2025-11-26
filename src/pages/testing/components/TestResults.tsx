import { useState, useEffect } from 'react';

interface TestResultsProps {
  results: any[];
}

export default function TestResults({ results }: TestResultsProps) {
  const [allResults, setAllResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterModule, setFilterModule] = useState('all');

  useEffect(() => {
    fetchAllResults();
  }, []);

  useEffect(() => {
    // Combine live results with historical results
    const combined = [...allResults, ...results];
    const unique = combined.filter((result, index, self) => 
      index === self.findIndex(r => r.testId === result.testId)
    );
    applyFilters(unique);
  }, [results, allResults, filterStatus, filterModule]);

  const fetchAllResults = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/rest/v1/test_cases?executed_at=not.is.null`, {
        headers: {
          'apikey': import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const formattedResults = data.map(test => ({
          testId: test.test_id,
          description: test.description,
          module: test.module,
          status: test.status,
          actualResult: test.actual_result,
          expectedResult: test.expected_result,
          executedBy: test.executed_by,
          executedAt: test.executed_at
        }));
        setAllResults(formattedResults);
      }
    } catch (error) {
      console.error('Error fetching test results:', error);
    }
  };

  const applyFilters = (data: any[]) => {
    let filtered = data;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(result => result.status === filterStatus);
    }

    if (filterModule !== 'all') {
      filtered = filtered.filter(result => result.module === filterModule);
    }

    setFilteredResults(filtered);
  };

  const generateReport = () => {
    const reportData = {
      summary: {
        total: filteredResults.length,
        passed: filteredResults.filter(r => r.status === 'passed').length,
        failed: filteredResults.filter(r => r.status === 'failed').length,
        pending: filteredResults.filter(r => r.status === 'pending').length,
        blocked: filteredResults.filter(r => r.status === 'blocked').length
      },
      results: filteredResults,
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const modules = [...new Set(allResults.map(r => r.module))];
  const passRate = filteredResults.length > 0 
    ? Math.round((filteredResults.filter(r => r.status === 'passed').length / filteredResults.length) * 100)
    : 0;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Test Results</h2>
        <button
          onClick={generateReport}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 whitespace-nowrap cursor-pointer"
        >
          <i className="ri-download-line mr-2"></i>
          Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{filteredResults.length}</div>
          <div className="text-sm text-blue-700">Total Tests</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {filteredResults.filter(r => r.status === 'passed').length}
          </div>
          <div className="text-sm text-green-700">Passed</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {filteredResults.filter(r => r.status === 'failed').length}
          </div>
          <div className="text-sm text-red-700">Failed</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{passRate}%</div>
          <div className="text-sm text-purple-700">Pass Rate</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">All Status</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
          <select
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">All Modules</option>
            {modules.map(module => (
              <option key={module} value={module}>{module}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Module
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Executed By
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResults.map((result, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {result.testId}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    <div className="max-w-xs truncate" title={result.description}>
                      {result.description}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {result.module}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      result.status === 'passed' ? 'bg-green-100 text-green-800' :
                      result.status === 'failed' ? 'bg-red-100 text-red-800' :
                      result.status === 'blocked' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {result.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {result.executedBy || 'System'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {result.executedAt ? new Date(result.executedAt).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredResults.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No test results found matching the current filters
          </div>
        )}
      </div>

      {/* Detailed Results */}
      {filteredResults.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Detailed Results</h3>
          <div className="space-y-4">
            {filteredResults.slice(0, 10).map((result, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">{result.testId}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    result.status === 'passed' ? 'bg-green-100 text-green-800' :
                    result.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {result.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{result.description}</p>
                <div className="grid md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <strong className="text-gray-700">Expected Result:</strong>
                    <p className="text-gray-600 mt-1">{result.expectedResult}</p>
                  </div>
                  <div>
                    <strong className="text-gray-700">Actual Result:</strong>
                    <p className="text-gray-600 mt-1">{result.actualResult || 'Not executed'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}