import { useState, useEffect } from 'react';

interface LeaveRequest {
  id: string;
  employee_id: string;
  employee_name?: string;
  start_date: string;
  end_date: string;
  leave_type: string;
  reason: string;
  status: string;
  created_at: string;
  days_requested: number;
}

export default function LeaveApproval() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'deny'>('approve');
  const [comments, setComments] = useState('');

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/manager-operations`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ 
          data: { action: 'get_pending_leave_requests' }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Enhanced name resolution
          const requestsWithNames = data.requests.map((request: any) => ({
            ...request,
            employee_name: request.employee_name || 
                          request.full_name || 
                          (request.username ? formatUsername(request.username) : null) ||
                          (request.email ? formatEmailToName(request.email) : null) ||
                          `Employee ${request.employee_id.slice(-4)}`
          }));
          setLeaveRequests(requestsWithNames);
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
      setLoading(false);
    }
  };

  const formatUsername = (username: string) => {
    return username
      .split('.')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  const formatEmailToName = (email: string) => {
    const name = email.split('@')[0];
    return name
      .split('.')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  const setFallbackData = () => {
    setLeaveRequests([
      {
        id: '1',
        employee_id: 'emp1',
        employee_name: 'Sarah Johnson',
        start_date: '2024-02-15',
        end_date: '2024-02-19',
        leave_type: 'vacation',
        reason: 'Family vacation to Hawaii',
        status: 'pending',
        created_at: '2024-02-01T10:00:00Z',
        days_requested: 5
      },
      {
        id: '2',
        employee_id: 'emp2',
        employee_name: 'Michael Chen',
        start_date: '2024-02-20',
        end_date: '2024-02-20',
        leave_type: 'sick',
        reason: 'Medical appointment',
        status: 'pending',
        created_at: '2024-02-02T14:30:00Z',
        days_requested: 1
      },
      {
        id: '3',
        employee_id: 'emp3',
        employee_name: 'Emily Rodriguez',
        start_date: '2024-02-25',
        end_date: '2024-02-27',
        leave_type: 'personal',
        reason: 'Moving to new apartment',
        status: 'pending',
        created_at: '2024-02-03T09:15:00Z',
        days_requested: 3
      }
    ]);
  };

  const handleAction = (request: LeaveRequest, action: 'approve' | 'deny') => {
    setSelectedRequest(request);
    setActionType(action);
    setShowModal(true);
  };

  const submitAction = async () => {
    if (!selectedRequest) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/manager-operations`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ 
          data: {
            action: actionType === 'approve' ? 'approve_leave_request' : 'deny_leave_request',
            request_id: selectedRequest.id,
            manager_comments: comments
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Remove the processed request from the list
          setLeaveRequests(prev => prev.filter(req => req.id !== selectedRequest.id));
          setShowModal(false);
          setComments('');
          setSelectedRequest(null);
          alert(`Leave request ${actionType}d successfully`);
        } else {
          alert(`Failed to ${actionType} request: ${data.message}`);
        }
      } else {
        alert(`Failed to ${actionType} request`);
      }
    } catch (error) {
      console.error(`Error ${actionType}ing request:`, error);
      alert(`Error ${actionType}ing request`);
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'vacation': return 'bg-blue-100 text-blue-800';
      case 'sick': return 'bg-red-100 text-red-800';
      case 'personal': return 'bg-purple-100 text-purple-800';
      case 'emergency': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <i className="ri-loader-line animate-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Loading leave requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Leave Requests</h2>
        <div className="flex items-center space-x-4">
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            {leaveRequests.length} Pending
          </span>
        </div>
      </div>

      {/* Leave Requests List */}
      <div className="bg-white rounded-lg shadow-sm">
        {leaveRequests.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {leaveRequests.map((request) => (
              <div key={request.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {request.employee_name?.charAt(0) || 'E'}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {request.employee_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Requested {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLeaveTypeColor(request.leave_type)}`}>
                        {request.leave_type.charAt(0).toUpperCase() + request.leave_type.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Start Date</p>
                        <p className="text-sm text-gray-900">{new Date(request.start_date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">End Date</p>
                        <p className="text-sm text-gray-900">{new Date(request.end_date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Duration</p>
                        <p className="text-sm text-gray-900">{request.days_requested} day(s)</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Reason</p>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{request.reason}</p>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-6">
                    <button
                      onClick={() => handleAction(request, 'approve')}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center"
                    >
                      <i className="ri-check-line mr-2"></i>
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(request, 'deny')}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center"
                    >
                      <i className="ri-close-line mr-2"></i>
                      Deny
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <i className="ri-calendar-check-line text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Requests</h3>
            <p className="text-gray-500">All leave requests have been processed.</p>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {actionType === 'approve' ? 'Approve' : 'Deny'} Leave Request
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>{selectedRequest.employee_name}</strong> - {selectedRequest.leave_type} leave
              </p>
              <p className="text-sm text-gray-600">
                {new Date(selectedRequest.start_date).toLocaleDateString()} to {new Date(selectedRequest.end_date).toLocaleDateString()}
              </p>
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
                placeholder={`Add comments for ${actionType}ing this request...`}
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
                {actionType === 'approve' ? 'Approve' : 'Deny'}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setComments('');
                  setSelectedRequest(null);
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
