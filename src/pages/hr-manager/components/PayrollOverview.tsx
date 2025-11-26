
import { useState, useEffect } from 'react';

interface PayrollRecord {
  id: string;
  employee_id: string;
  employee_name: string;
  department: string;
  pay_period_start: string;
  pay_period_end: string;
  base_salary: number;
  overtime_hours: number;
  overtime_pay: number;
  deductions: number;
  gross_pay: number;
  net_pay: number;
  status: 'pending' | 'processed' | 'paid';
}

interface PayrollSummary {
  total_employees: number;
  total_gross_pay: number;
  total_net_pay: number;
  total_deductions: number;
  pending_payments: number;
}

export function PayrollOverview() {
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [summary, setSummary] = useState<PayrollSummary>({
    total_employees: 0,
    total_gross_pay: 0,
    total_net_pay: 0,
    total_deductions: 0,
    pending_payments: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  useEffect(() => {
    fetchPayrollData();
  }, [selectedPeriod, departmentFilter]);

  const fetchPayrollData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/payroll-processing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          action: 'get_payroll_overview',
          period: selectedPeriod,
          department: departmentFilter === 'all' ? null : departmentFilter
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPayrollRecords(data.records || []);
        setSummary(data.summary || summary);
      }
    } catch (error) {
      console.error('Error fetching payroll data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      processed: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: 'ri-time-line',
      processed: 'ri-check-line',
      paid: 'ri-money-dollar-circle-line'
    };
    return icons[status as keyof typeof icons] || 'ri-question-line';
  };

  const departments = [...new Set(payrollRecords.map(record => record.department))];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-20 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 lg:mb-0">Payroll Overview</h2>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="current">Current Period</option>
            <option value="previous">Previous Period</option>
            <option value="last_quarter">Last Quarter</option>
            <option value="year_to_date">Year to Date</option>
          </select>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Payroll Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <i className="ri-team-line text-blue-600 text-xl mr-3"></i>
            <div>
              <p className="text-sm text-blue-600 font-medium">Employees</p>
              <p className="text-2xl font-bold text-blue-900">{summary.total_employees || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <i className="ri-money-dollar-circle-line text-green-600 text-xl mr-3"></i>
            <div>
              <p className="text-sm text-green-600 font-medium">Gross Pay</p>
              <p className="text-2xl font-bold text-green-900">${(summary.total_gross_pay || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center">
            <i className="ri-wallet-line text-purple-600 text-xl mr-3"></i>
            <div>
              <p className="text-sm text-purple-600 font-medium">Net Pay</p>
              <p className="text-2xl font-bold text-purple-900">${(summary.total_net_pay || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <i className="ri-subtract-line text-red-600 text-xl mr-3"></i>
            <div>
              <p className="text-sm text-red-600 font-medium">Deductions</p>
              <p className="text-2xl font-bold text-red-900">${(summary.total_deductions || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <i className="ri-time-line text-yellow-600 text-xl mr-3"></i>
            <div>
              <p className="text-sm text-yellow-600 font-medium">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">{summary.pending_payments || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payroll Records Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pay Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Base Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Overtime
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gross Pay
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Pay
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payrollRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-xs font-medium text-white">
                            {record.employee_name.split(' ').map(n => n.charAt(0)).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{record.employee_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{new Date(record.pay_period_start).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">to {new Date(record.pay_period_end).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(record.base_salary || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{record.overtime_hours || 0}h</div>
                    <div className="text-xs text-gray-500">${(record.overtime_pay || 0).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${(record.gross_pay || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    ${(record.net_pay || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <i className={`${getStatusIcon(record.status)} mr-2`}></i>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(record.status)}`}>
                        {record.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      View Details
                    </button>
                    {record.status === 'processed' && (
                      <button className="text-green-600 hover:text-green-900">
                        Process Payment
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {payrollRecords.length === 0 && (
        <div className="text-center py-12">
          <i className="ri-money-dollar-circle-line text-4xl text-gray-400 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No payroll records found</h3>
          <p className="text-gray-500">
            No payroll data available for the selected period and filters.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex justify-between">
        <div className="flex space-x-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center whitespace-nowrap">
            <i className="ri-calculator-line mr-2"></i>
            Calculate Payroll
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center whitespace-nowrap">
            <i className="ri-send-plane-line mr-2"></i>
            Process Payments
          </button>
        </div>
        <div className="flex space-x-4">
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center whitespace-nowrap">
            <i className="ri-file-excel-2-line mr-2"></i>
            Export to Excel
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center whitespace-nowrap">
            <i className="ri-file-pdf-line mr-2"></i>
            Generate Reports
          </button>
        </div>
      </div>
    </div>
  );
}
