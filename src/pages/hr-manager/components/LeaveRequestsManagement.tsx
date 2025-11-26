import { useState, useEffect } from 'react';

interface LeaveRequest {
  id: string;
  employeeName: string;
  department: string;
  type: 'vacation' | 'sick' | 'personal' | 'emergency';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'denied';
  submittedDate: string;
  approvedBy?: string;
}

export function LeaveRequestsManagement() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const fetchLeaveRequests = async () => {
    setIsLoading(true);
    try {
      const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/hr-operations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          action: 'get_leave_requests'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.requests) {
          // Map API data to our leave request format
          const mappedRequests = data.requests.map((req: any) => ({
            id: req.id,
            employeeName: req.employee_name || req.full_name || req.username || req.email?.split('@')[0] || 'Unknown Employee',
            department: req.department || 'General',
            type: req.leave_type || 'personal',
            startDate: req.start_date,
            endDate: req.end_date,
            days: req.days_requested || 1,
            reason: req.reason || 'No reason provided',
            status: req.status || 'pending',
            submittedDate: req.created_at,
            approvedBy: req.approved_by
          }));
          setLeaveRequests(mappedRequests);
        } else {
          console.error('Failed to fetch leave requests:', data.message);
          setFallbackData();
        }
      } else {
        console.error('Failed to fetch leave requests - Response not OK:', response.status);
        setFallbackData();
      }
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      setFallbackData();
    } finally {
      setIsLoading(false);
    }
  };

  const setFallbackData = () => {
    setLeaveRequests([
      {
        id: '1',
        employeeName: 'Kimon Elizee',
        department: 'Design & QA',
        type: 'vacation',
        startDate: '2024-12-20',
        endDate: '2024-12-27',
        days: 6,
        reason: 'Holiday vacation with family',
        status: 'pending',
        submittedDate: '2024-12-01'
      },
      {
        id: '2',
        employeeName: 'Tahura Tabasum',
        department: 'Backend Development',
        type: 'sick',
        startDate: '2024-12-10',
        endDate: '2024-12-12',
        days: 3,
        reason: 'Medical appointment and recovery',
        status: 'approved',
        submittedDate: '2024-12-08',
        approvedBy: 'Dazurna Warner'
      },
      {
        id: '3',
        employeeName: 'Daniel Zuniga',
        department: 'Data Management',
        type: 'personal',
        startDate: '2024-12-15',
        endDate: '2024-12-15',
        days: 1,
        reason: 'Personal family matter',
        status: 'pending',
        submittedDate: '2024-12-05'
      }
    ]);
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const filteredRequests = leaveRequests.filter(request => {
    const matchesSearch = request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus;
    const matchesType = selectedType === 'all' || request.type === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const summaryStats = {
    total: leaveRequests.length,
    pending: leaveRequests.filter(r => r.status === 'pending').length,
    approved: leaveRequests.filter(r => r.status === 'approved').length,
    denied: leaveRequests.filter(r => r.status === 'denied').length
  };

  const handleStatusUpdate = async (requestId: string, newStatus: 'approved' | 'denied') => {
    try {
      const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/leave-management`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          action: newStatus === 'approved' ? 'approve_request' : 'deny_request',
          request_id: requestId,
          approved_by_id: 'hr-manager-001',
          manager_comments: `${newStatus === 'approved' ? 'Approved' : 'Denied'} by HR Manager`
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update local state
          setLeaveRequests(prev => prev.map(request => 
            request.id === requestId 
              ? { ...request, status: newStatus, approvedBy: 'HR Manager' }
              : request
          ));
          
          // Refresh the list to get updated data
          fetchLeaveRequests();
        } else {
          console.error('Failed to update leave request:', data.message);
        }
      } else {
        console.error('Failed to update leave request - Response not OK:', response.status);
      }
    } catch (error) {
      console.error('Error updating leave request:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'approved': return 'bg-green-100 text-green-700';
      case 'denied': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vacation': return 'bg-blue-100 text-blue-700';
      case 'sick': return 'bg-red-100 text-red-700';
      case 'personal': return 'bg-purple-100 text-purple-700';
      case 'emergency': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vacation': return 'ri-sun-line';
      case 'sick': return 'ri-heart-pulse-line';
      case 'personal': return 'ri-user-line';
      case 'emergency': return 'ri-alarm-warning-line';
      default: return 'ri-calendar-line';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leave Requests Management</h2>
          <p className="text-gray-600">Review and manage employee leave requests</p>
        </div>
        <button
          onClick={fetchLeaveRequests}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <i className="ri-loader-4-line animate-spin mr-2"></i>
              Loading...
            </>
          ) : (
            <>
              <i className="ri-refresh-line mr-2"></i>
              Refresh
            </>
          )}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{summaryStats.total}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-calendar-line text-blue-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{summaryStats.pending}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="ri-time-line text-yellow-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{summaryStats.approved}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-check-line text-green-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Denied</p>
              <p className="text-2xl font-bold text-red-600">{summaryStats.denied}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <i className="ri-close-line text-red-600"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Requests
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="ri-search-line text-gray-400"></i>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Search by employee, department, or reason..."
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-8"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="denied">Denied</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-8"
            >
              <option value="all">All Types</option>
              <option value="vacation">Vacation</option>
              <option value="sick">Sick Leave</option>
              <option value="personal">Personal</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leave Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {request.employeeName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{request.employeeName}</h3>
                    <span className="text-sm text-gray-500">{request.department}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(request.type)}`}>
                      <i className={`${getTypeIcon(request.type)} mr-1`}></i>
                      {request.type}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600">
                        <strong>Dates:</strong> {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Duration:</strong> {request.days} day{request.days !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <strong>Submitted:</strong> {new Date(request.submittedDate).toLocaleDateString()}
                      </p>
                      {request.approvedBy && (
                        <p className="text-sm text-gray-600">
                          <strong>Approved by:</strong> {request.approvedBy}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <strong>Reason:</strong> {request.reason}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
                {request.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusUpdate(request.id, 'approved')}
                      className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors text-sm whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-check-line mr-1"></i>
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(request.id, 'denied')}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors text-sm whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-close-line mr-1"></i>
                      Deny
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-calendar-line text-gray-400 text-2xl"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No leave requests found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or filters</p>
        </div>
      )}
    </div>
  );
}
