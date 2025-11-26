import { useState, useEffect } from 'react';

interface AttendanceTrackerProps {
  currentUser?: any;
}

export default function AttendanceTracker({ currentUser }: AttendanceTrackerProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isClockIn, setIsClockIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState<any[]>([]);
  const [attendanceStatus, setAttendanceStatus] = useState<any>(null);
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [weeklyStats, setWeeklyStats] = useState({
    totalHours: '0',
    regularHours: '0',
    overtimeHours: '0',
    daysPresent: '0',
    daysLate: '0'
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchCurrentEmployee();
  }, []);

  useEffect(() => {
    if (employeeData) {
      checkTodayAttendance();
      fetchAttendanceHistory();
      fetchWeeklyStats();
    }
  }, [employeeData]);

  const fetchCurrentEmployee = async () => {
    try {
      // Get current user from localStorage
      const userData = localStorage.getItem('currentUser');
      let loggedInUser = null;
      
      if (userData) {
        loggedInUser = JSON.parse(userData);
        console.log('Logged in user data for attendance:', loggedInUser);
      }

      if (!loggedInUser?.id) {
        console.error('No logged-in user found');
        return;
      }

      const response = await fetch('https://sxspdcofjldpexpzbugr.supabase.co/functions/v1/employee-auth', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ 
          action: 'get_current_employee',
          employee_id: loggedInUser.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.employee) {
          console.log('Employee data for attendance:', data.employee);
          setEmployeeData(data.employee);
        } else {
          console.error('Failed to fetch employee data:', data.message);
          // Fallback: use the logged-in user data directly
          setEmployeeData(loggedInUser);
        }
      } else {
        console.error('Failed to fetch employee data - using fallback');
        // Fallback: use the logged-in user data directly
        setEmployeeData(loggedInUser);
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
      // Fallback: try to use logged-in user data
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        const loggedInUser = JSON.parse(userData);
        setEmployeeData(loggedInUser);
      }
    }
  };

  const checkTodayAttendance = async () => {
    if (!employeeData?.id) return;
    
    try {
      const response = await fetch('https://sxspdcofjldpexpzbugr.supabase.co/functions/v1/attendance-tracking', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ 
          action: 'get_current_status',
          employee_id: employeeData.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.attendance) {
          setAttendanceStatus(data.attendance);
          // Set isClockIn to true if there's a check_in_time but no check_out_time
          setIsClockIn(data.attendance.check_in_time && !data.attendance.check_out_time);
        } else {
          setAttendanceStatus(null);
          setIsClockIn(false);
        }
      }
    } catch (error) {
      console.error('Error checking attendance:', error);
    }
  };

  const fetchAttendanceHistory = async () => {
    if (!employeeData?.id) return;
    
    try {
      const response = await fetch('https://sxspdcofjldpexpzbugr.supabase.co/functions/v1/attendance-tracking', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ 
          action: 'get_attendance_history',
          employee_id: employeeData.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAttendanceHistory(data.attendance || []);
        }
      }
    } catch (error) {
      console.error('Error fetching attendance history:', error);
    }
  };

  const fetchWeeklyStats = async () => {
    if (!employeeData?.id) return;
    
    try {
      const response = await fetch('https://sxspdcofjldpexpzbugr.supabase.co/functions/v1/attendance-tracking', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ 
          action: 'get_weekly_stats',
          employee_id: employeeData.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setWeeklyStats(data.stats);
        }
      }
    } catch (error) {
      console.error('Error fetching weekly stats:', error);
    }
  };

  const handleClockAction = async () => {
    if (!employeeData?.id) {
      alert('Employee data not loaded. Please refresh the page.');
      return;
    }
    
    setLoading(true);
    try {
      const action = isClockIn ? 'clock_out' : 'clock_in';
      const timestamp = new Date().toISOString();
      
      console.log('Clock action:', action, 'Employee ID:', employeeData.id);
      
      const response = await fetch('https://sxspdcofjldpexpzbugr.supabase.co/functions/v1/attendance-tracking', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ 
          action,
          employee_id: employeeData.id,
          timestamp
        })
      });

      const data = await response.json();
      console.log('Response:', data);

      if (response.ok && data.success) {
        // Update the clock state immediately
        setIsClockIn(!isClockIn);
        
        // Refresh all data
        await checkTodayAttendance();
        await fetchAttendanceHistory();
        await fetchWeeklyStats();
        
        const actionText = isClockIn ? 'Clocked Out' : 'Clocked In';
        alert(`Successfully ${actionText} at ${currentTime.toLocaleTimeString()}`);
      } else {
        alert(`Error: ${data.message || 'Unknown error occurred'}`);
      }
    } catch (error) {
      console.error('Error with clock action:', error);
      alert('Error processing clock action. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'text-green-600 bg-green-100';
      case 'late': return 'text-orange-600 bg-orange-100';
      case 'absent': return 'text-red-600 bg-red-100';
      case 'overtime': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '-';
    return new Date(timeString).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getTodayHours = () => {
    if (!attendanceStatus || !attendanceStatus.check_in_time) return '0.0';
    
    const checkIn = new Date(attendanceStatus.check_in_time);
    const checkOut = attendanceStatus.check_out_time ? new Date(attendanceStatus.check_out_time) : new Date();
    const hours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
    return hours.toFixed(1);
  };

  const getCurrentStatus = () => {
    if (!attendanceStatus) return 'Not clocked in';
    if (attendanceStatus.check_in_time && !attendanceStatus.check_out_time) {
      return `Clocked in at ${formatTime(attendanceStatus.check_in_time)}`;
    }
    if (attendanceStatus.check_out_time) {
      return `Clocked out at ${formatTime(attendanceStatus.check_out_time)}`;
    }
    return 'Ready to clock in';
  };

  if (!employeeData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <i className="ri-loader-line animate-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Loading employee data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Clock In/Out Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Time Tracking</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Current Time */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {currentTime.toLocaleTimeString()}
            </div>
            <p className="text-sm text-gray-500">Current Time</p>
          </div>

          {/* Clock Action */}
          <div className="text-center">
            <button
              onClick={handleClockAction}
              disabled={loading}
              className={`w-full py-4 px-6 rounded-lg font-medium text-lg transition-colors whitespace-nowrap cursor-pointer ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed'
                  : isClockIn
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              <i className={`${loading ? 'ri-loader-line animate-spin' : isClockIn ? 'ri-logout-circle-line' : 'ri-login-circle-line'} mr-2`}></i>
              {loading ? 'Processing...' : isClockIn ? 'Clock Out' : 'Clock In'}
            </button>
            <p className="text-sm text-gray-500 mt-2">
              {getCurrentStatus()}
            </p>
          </div>

          {/* Today's Hours */}
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {getTodayHours()}h
            </div>
            <p className="text-sm text-gray-500">Hours Today</p>
          </div>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{weeklyStats.totalHours}</div>
            <div className="text-sm text-gray-600">Total Hours</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{weeklyStats.regularHours}</div>
            <div className="text-sm text-gray-600">Regular Hours</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{weeklyStats.overtimeHours}</div>
            <div className="text-sm text-gray-600">Overtime</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{weeklyStats.daysPresent}</div>
            <div className="text-sm text-gray-600">Days Present</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{weeklyStats.daysLate}</div>
            <div className="text-sm text-gray-600">Days Late</div>
          </div>
        </div>
      </div>

      {/* Attendance History */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Attendance History</h3>
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer">
              <i className="ri-download-line mr-2"></i>
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceHistory.length > 0 ? (
                attendanceHistory.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTime(record.check_in_time)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTime(record.check_out_time)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.total_hours ? `${record.total_hours}h` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
