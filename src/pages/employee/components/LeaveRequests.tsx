
import { useState, useEffect } from 'react';

interface LeaveRequestsProps {
  currentUser?: any;
}

export default function LeaveRequests({ currentUser }: LeaveRequestsProps) {
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [loading, setLoading] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    leave_type: 'vacation',
    start_date: '',
    end_date: '',
    reason: ''
  });

  useEffect(() => {
    if (currentUser?.id) {
      fetchLeaveRequests();
    }
  }, [currentUser]);

  const fetchLeaveRequests = async () => {
    if (!currentUser?.id) {
      console.log('No current user ID available');
      return;
    }

    try {
      console.log('Fetching employee leave requests for user:', currentUser.id);
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/leave-management`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          action: 'get_requests',
          employee_id: currentUser.id // Use actual user ID instead of hardcoded EMP001
        })
      });

      const data = await response.json();
      console.log('Employee leave requests response:', data);

      if (data.success) {
        setLeaveRequests(data.requests || []);
      } else {
        console.error('Failed to fetch leave requests:', data.message);
      }
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser?.id) {
      alert('User not loaded. Please wait and try again.');
      return;
    }
    
    setLoading(true);

    try {
      // Calculate total days
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      console.log('Submitting leave request with data:', {
        action: 'create_request',
        employee_id: currentUser.id,
        leave_type: formData.leave_type,
        start_date: formData.start_date,
        end_date: formData.end_date,
        reason: formData.reason,
        total_days: totalDays
      });

      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/leave-management`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ 
          action: 'create_request',
          employee_id: currentUser.id, // Use actual user ID
          leave_type: formData.leave_type,
          start_date: formData.start_date,
          end_date: formData.end_date,
          reason: formData.reason,
          total_days: totalDays
        })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok && data.success) {
        alert('Leave request submitted successfully and sent to HR for approval!');
        setShowNewRequest(false);
        setFormData({
          leave_type: 'vacation',
          start_date: '',
          end_date: '',
          reason: ''
        });
        await fetchLeaveRequests();
      } else {
        alert(`Error: ${data.message || 'Failed to submit request'}`);
      }
    } catch (error) {
      console.error('Error submitting leave request:', error);
      alert('Error submitting request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'denied': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLeaveTypeIcon = (type: string) => {
    switch (type) {
      case 'vacation': return 'ri-sun-line';
      case 'sick': return 'ri-heart-pulse-line';
      case 'personal': return 'ri-user-line';
      case 'other': return 'ri-more-line';
      default: return 'ri-calendar-line';
    }
  };

  // Show loading state if user is not loaded yet
  if (!currentUser) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <i className="ri-loader-4-line text-4xl text-gray-400 animate-spin mb-4"></i>
              <p className="text-gray-600">Loading user information...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Leave Requests</h2>
            <p className="text-sm text-gray-600 mt-1">Submit and track your leave requests</p>
          </div>
          <button
            onClick={() => setShowNewRequest(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer"
          >
            <i className="ri-add-line mr-2"></i>
            New Request
          </button>
        </div>
      </div>

      {/* Leave Requests List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Requests</h3>
        {leaveRequests.length > 0 ? (
          <div className="space-y-4">
            {leaveRequests.map((request, index) => (
              <div key={request.id || index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className={`${getLeaveTypeIcon(request.leave_type)} text-xl text-blue-600`}></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 capitalize">{request.leave_type} Leave</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                      </p>
                      {request.reason && (
                        <p className="text-sm text-gray-500 mt-1">{request.reason}</p>
                      )}
                      {(request.days_requested || request.total_days) && (
                        <p className="text-xs text-blue-600 mt-1">{request.days_requested || request.total_days} day(s)</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-2">
                      Submitted: {new Date(request.created_at).toLocaleDateString()}
                    </p>
                    {request.approved_at && (
                      <p className="text-xs text-gray-500">
                        {request.status === 'approved' ? 'Approved' : 'Denied'}: {new Date(request.approved_at).toLocaleDateString()}
                      </p>
                    )}
                    {request.comments && (
                      <p className="text-xs text-gray-600 mt-1 italic">"{request.comments}"</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <i className="ri-calendar-line text-5xl text-gray-300 mb-4"></i>
            <p className="text-gray-600">No leave requests yet</p>
            <button
              onClick={() => setShowNewRequest(true)}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
            >
              Submit your first request
            </button>
          </div>
        )}
      </div>

      {/* New Request Modal */}
      {showNewRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">New Leave Request</h3>
                <button
                  onClick={() => setShowNewRequest(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
                <select
                  value={formData.leave_type}
                  onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                  required
                >
                  <option value="vacation">Vacation</option>
                  <option value="sick">Sick Leave</option>
                  <option value="personal">Personal</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Please provide a reason for your leave request..."
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewRequest(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !currentUser?.id}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer disabled:bg-gray-400"
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
