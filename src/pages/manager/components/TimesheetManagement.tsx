import { useState, useEffect } from 'react';

interface Timesheet {
  id: string;
  employee_id: string;
  employee_name: string;
  department: string;
  week_start: string;
  week_end: string;
  regular_hours: number;
  overtime_hours: number;
  total_hours: number;
  hourly_rate: number;
  total_pay: number;
  status: 'submitted' | 'approved' | 'rejected' | 'pending_review';
  submitted_at: string;
  notes?: string;
}

export default function TimesheetManagement() {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [comments, setComments] = useState('');

  function getCurrentWeek() {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    return monday.toISOString().split('T')[0];
  }

  useEffect(() => {
    fetchTimesheets();
  }, [selectedWeek, selectedDepartment]);

  const fetchTimesheets = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/manager-operations`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ 
          data: {
            action: 'get_team_timesheets',
            week_start: selectedWeek,
            department: selectedDepartment
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTimesheets(data.timesheets || []);
          setDepartments(data.departments || []);
        } else {
          console.error('Failed to fetch timesheets:', data.message);
          setFallbackData();
        }
      } else {
        console.error('Failed to fetch timesheets - Response not OK:', response.status);
        setFallbackData();
      }
    } catch (error) {
      console.error('Error fetching timesheets:', error);
      setFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const setFallbackData = () => {
    const weekEnd = new Date(selectedWeek);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    setTimesheets([
      {
        id: '1',
        employee_id: 'emp1',
        employee_name: 'Sarah Johnson',
        department: 'Engineering',
        week_start: selectedWeek,
        week_end: weekEnd.toISOString().split('T')[0],
        regular_hours: 40,
        overtime_hours: 5,
        total_hours: 45,
        hourly_rate: 35,
        total_pay: 1575,
        status: 'submitted',
        submitted_at: '2024-02-09T17:30:00Z',
        notes: 'Worked extra hours on critical project deadline'
      },
      {
        id: '2',
        employee_id: 'emp2',
        employee_name: 'Michael Chen',
        department: 'Marketing',
        week_start: selectedWeek,
        week_end: weekEnd.toISOString().split('T')[0],
        regular_hours: 38,
        overtime_hours: 0,
        total_hours: 38,
        hourly_rate: 28,
        total_pay: 1064,
        status: 'pending_review',
        submitted_at: '2024-02-09T16:45:00Z'
      },
      {
        id: '3',
        employee_id: 'emp3',
        employee_name: 'Emily Rodriguez',
        department: 'Sales',
        week_start: selectedWeek,
        week_end: weekEnd.toISOString().split('T')[0],
        regular_hours: 40,
        overtime_hours: 2,
        total_hours: 42,
        hourly_rate: 32,
        total_pay: 1344,
        status: 'submitted',
        submitted_at: '2024-02-09T18:00:00Z',
        notes: 'Client meetings extended beyond normal hours'
      },
      {
        id: '4',
        employee_id: 'emp4',
        employee_name: 'David Wilson',
        department: 'Engineering',
        week_start: selectedWeek,
        week_end: weekEnd.toISOString().split('T')[0],
        regular_hours: 40,
        overtime_hours: 8,
        total_hours: 48,
        hourly_rate: 38,
        total_pay: 1824,
        status: 'approved',
        submitted_at: '2024-02-09T15:20:00Z'
      }
    ]);
    setDepartments(['Engineering', 'Marketing', 'Sales', 'HR', 'Finance']);
  };

  const handleAction = (timesheet: Timesheet, action: 'approve' | 'reject') => {
    setSelectedTimesheet(timesheet);
    setActionType(action);
    setShowModal(true);
  };

  const submitAction = async () => {
    if (!selectedTimesheet) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/manager-operations`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ 
          data: {
            action: actionType === 'approve' ? 'approve_timesheet' : 'reject_timesheet',
            timesheet_id: selectedTimesheet.id,
            manager_comments: comments
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update the timesheet status in the list
          setTimesheets(prev => prev.map(ts => 
            ts.id === selectedTimesheet.id 
              ? { ...ts, status: actionType === 'approve' ? 'approved' : 'rejected' }
              : ts
          ));
          setShowModal(false);
          setComments('');
          setSelectedTimesheet(null);
          alert(`Timesheet ${actionType}d successfully`);
        } else {
          alert(`Failed to ${actionType} timesheet: ${data.message}`);
        }
      } else {
        alert(`Failed to ${actionType} timesheet`);
      }
    } catch (error) {
      console.error(`Error ${actionType}ing timesheet:`, error);
      alert(`Error ${actionType}ing timesheet`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTimesheets = timesheets.filter(timesheet => 
    selectedDepartment === 'all' || timesheet.department === selectedDepartment
  );

  const totalTimesheets = filteredTimesheets.length;
  const pendingCount = filteredTimesheets.filter(ts => ts.status === 'submitted' || ts.status === 'pending_review').length;
  const approvedCount = filteredTimesheets.filter(ts => ts.status === 'approved').length;
  const totalPay = filteredTimesheets.reduce((sum, ts) => sum + ts.total_pay, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <i className="ri-loader-line animate-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Loading timesheets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h2 className="text-2xl font-bold text-gray-900">Timesheet Management</h2>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <input
            type="week"
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-file-list-line text-blue-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Timesheets</p>
              <p className="text-2xl font-bold text-gray-900">{totalTimesheets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="ri-time-line text-yellow-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-check-line text-green-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{approvedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="ri-money-dollar-circle-line text-purple-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pay</p>
              <p className="text-2xl font-bold text-gray-900">${totalPay.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Timesheets Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Timesheets for Week of {new Date(selectedWeek).toLocaleDateString()}
          </h3>
        </div>

        {filteredTimesheets.length > 0 ? (
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
                    Regular Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Overtime
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Pay
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
                {filteredTimesheets.map((timesheet) => (
                  <tr key={timesheet.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {timesheet.employee_name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {timesheet.employee_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Submitted {new Date(timesheet.submitted_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {timesheet.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {timesheet.regular_hours}h
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {timesheet.overtime_hours}h
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${timesheet.total_pay.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(timesheet.status)}`}>
                        {timesheet.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {(timesheet.status === 'submitted' || timesheet.status === 'pending_review') && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAction(timesheet, 'approve')}
                            className="text-green-600 hover:text-green-900 cursor-pointer"
                            title="Approve"
                          >
                            <i className="ri-check-line"></i>
                          </button>
                          <button
                            onClick={() => handleAction(timesheet, 'reject')}
                            className="text-red-600 hover:text-red-900 cursor-pointer"
                            title="Reject"
                          >
                            <i className="ri-close-line"></i>
                          </button>
                          <button className="text-blue-600 hover:text-blue-900 cursor-pointer" title="View Details">
                            <i className="ri-eye-line"></i>
                          </button>
                        </div>
                      )}
                      {timesheet.status === 'approved' && (
                        <span className="text-green-600">
                          <i className="ri-check-double-line"></i>
                        </span>
                      )}
                      {timesheet.status === 'rejected' && (
                        <span className="text-red-600">
                          <i className="ri-close-circle-line"></i>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <i className="ri-file-list-line text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Timesheets Found</h3>
            <p className="text-gray-500">No timesheets found for the selected week and department.</p>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {showModal && selectedTimesheet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {actionType === 'approve' ? 'Approve' : 'Reject'} Timesheet
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>{selectedTimesheet.employee_name}</strong> - {selectedTimesheet.department}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Total Hours: {selectedTimesheet.total_hours}h (Regular: {selectedTimesheet.regular_hours}h, Overtime: {selectedTimesheet.overtime_hours}h)
              </p>
              <p className="text-sm text-gray-600">
                Total Pay: ${selectedTimesheet.total_pay.toLocaleString()}
              </p>
              {selectedTimesheet.notes && (
                <div className="mt-2 p-2 bg-gray-50 rounded">
                  <p className="text-sm text-gray-700"><strong>Notes:</strong> {selectedTimesheet.notes}</p>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments (Optional)
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder={`Add comments for ${actionType}ing this timesheet...`}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={submitAction}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  actionType === 'approve' 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {actionType === 'approve' ? 'Approve' : 'Reject'}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setComments('');
                  setSelectedTimesheet(null);
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
