import { useState, useEffect } from 'react';
import TestDashboard from './components/TestDashboard';
import TestExecution from './components/TestExecution';
import TestResults from './components/TestResults';

export default function TestingPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [testResults, setTestResults] = useState([]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            System Test Management
          </h1>
          <p className="text-gray-600">
            Employee Attendance & Payroll Tracking System - Test Execution Environment
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-4 font-medium text-sm whitespace-nowrap cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <i className="ri-dashboard-line mr-2"></i>
              Test Dashboard
            </button>
            <button
              onClick={() => setActiveTab('execution')}
              className={`px-6 py-4 font-medium text-sm whitespace-nowrap cursor-pointer ${
                activeTab === 'execution'
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <i className="ri-play-circle-line mr-2"></i>
              Test Execution
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`px-6 py-4 font-medium text-sm whitespace-nowrap cursor-pointer ${
                activeTab === 'results'
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <i className="ri-file-chart-line mr-2"></i>
              Test Results
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {activeTab === 'dashboard' && <TestDashboard />}
          {activeTab === 'execution' && <TestExecution onTestComplete={setTestResults} />}
          {activeTab === 'results' && <TestResults results={testResults} />}
        </div>
      </div>
    </div>
  );
}