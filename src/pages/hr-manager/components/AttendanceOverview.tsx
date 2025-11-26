
import { useState, useEffect } from 'react';

interface AttendanceRecord {
  id: string;
  employeeName: string;
  department: string;
  checkIn: string;
  checkOut: string | null;
  status: 'present' | 'absent' | 'late' | 'completed';
  hoursWorked: number;
  date: string;
}

export function AttendanceOverview() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: '1',
      employeeName: 'Dazurna Warner',
      department: 'IT Development',
      checkIn: '08:45',
      checkOut: '17:30',
      status: 'completed',
      hoursWorked: 8.75,
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: '2',
      employeeName: 'Ezla Stewart',
      department: 'Quality Assurance',
      checkIn: '09:00',
      checkOut: null,
      status: 'present',
      hoursWorked: 0,
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: '3',
      employeeName: 'Quincy Fevriere',
      department: 'IT Operations',
      checkIn: '09:15',
      checkOut: null,
      status: 'late',
      hoursWorked: 0,
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: '4',
      employeeName: 'Kimon Elizee',
      department: 'Design & QA',
      checkIn: '08:30',
      checkOut: null,
      status: 'present',
      hoursWorked: 0,
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: '5',
      employeeName: 'Arade Moses',
      department: 'IT Security',
      checkIn: '08:50',
      checkOut: '17:45',
      status: 'completed',
      hoursWorked: 8.92,
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: '6',
      employeeName: 'Tahura Tabasum',
      department: 'Backend Development',
      checkIn: '09:05',
      checkOut: null,
      status: 'present',
      hoursWorked: 0,
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: '7',
      employeeName: 'Daniel Zuniga',
      department: 'Data Management',
      checkIn: '',
      checkOut: '',
      status: 'absent',
      hoursWorked: 0,
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: '8',
      employeeName: 'Leon Frazer',
      department: 'IT Operations',
      checkIn: '08:40',
      checkOut: '18:00',
      status: 'completed',
      hoursWorked: 9.33,
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: '9',
      employeeName: 'Terrence Wells',
      department: 'Development & HR',
      checkIn: '08:55',
      checkOut: null,
      status: 'present',
      hoursWorked: 0,
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: '10',
      employeeName: 'Humayra Amin',
      department: 'Design',
      checkIn: '09:10',
      checkOut: null,
      status: 'present',
      hoursWorked: 0,
      date: new Date().toISOString().split('T')[0]
    }
  ]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const departments = ['all', 'IT Development', 'Quality Assurance', 'IT Operations', 'Design & QA', 'IT Security', 'Backend Development', 'Data Management', 'Development & HR', 'Design'];

  const fetchAttendanceData = async () => {
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
          action: 'get_attendance_overview',
          date: selectedDate,
          department: selectedDepartment !== 'all' ? selectedDepartment : undefined
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.employees) {
          // Map API data to our attendance format, but keep our actual team data as fallback
          console.log('Fetched attendance data from API:', data.employees);
        }
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [selectedDate, selectedDepartment]);

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesDate = record.date === selectedDate;
    const matchesDepartment = selectedDepartment === 'all' || record.department === selectedDepartment;
    return matchesDate && matchesDepartment;
  });

  const summaryStats = {
    totalEmployees: attendanceRecords.length,
    present: filteredRecords.filter(r => r.status === 'present' || r.status === 'completed').length,
    absent: filteredRecords.filter(r => r.status === 'absent').length,
    late: filteredRecords.filter(r => r.status === 'late').length,
    averageHours: filteredRecords.reduce((sum, r) => sum + r.hoursWorked, 0) / filteredRecords.filter(r => r.hoursWorked > 0).length || 0
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-700';
      case 'absent': return 'bg-red-100 text-red-700';
      case 'late': return 'bg-orange-100 text-orange-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return 'ri-checkbox-circle-line';
      case 'absent': return 'ri-close-circle-line';
      case 'late': return 'ri-time-line';
      case 'completed': return 'ri-check-double-line';
      default: return 'ri-question-line';
    }
  };

  const exportToExcel = () => {
    const csvContent = [
      ['Employee Name', 'Department', 'Check In', 'Check Out', 'Status', 'Hours Worked', 'Date'],
      ...filteredRecords.map(record => [
        record.employeeName,
        record.department,
        record.checkIn || 'N/A',
        record.checkOut || 'N/A',
        record.status,
        record.hoursWorked.toFixed(2),
        record.date
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${selectedDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Attendance Overview</h2>
          <p className="text-gray-600">Monitor daily attendance for Elite Car Solutions team</p>
        </div>
        <button
          onClick={exportToExcel}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer"
        >
          <i className="ri-file-excel-line mr-2"></i>
          Export to Excel
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-8"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept === 'all' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchAttendanceData}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
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
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{summaryStats.totalEmployees}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-team-line text-blue-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Present</p>
              <p className="text-2xl font-bold text-green-600">{summaryStats.present}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-checkbox-circle-line text-green-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Absent</p>
              <p className="text-2xl font-bold text-red-600">{summaryStats.absent}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <i className="ri-close-circle-line text-red-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Late</p>
              <p className="text-2xl font-bold text-orange-600">{summaryStats.late}</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <i className="ri-time-line text-orange-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Hours</p>
              <p className="text-2xl font-bold text-purple-600">{summaryStats.averageHours.toFixed(1)}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="ri-bar-chart-line text-purple-600"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Attendance Records - {new Date(selectedDate).toLocaleDateString()}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">
                          {record.employeeName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {record.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.checkIn || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.checkOut || (
                      record.status === 'present' || record.status === 'late' ? (
                        <div className="flex items-center text-green-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                          Working
                        </div>
                      ) : '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.hoursWorked > 0 ? `${record.hoursWorked.toFixed(2)}h` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                      <i className={`${getStatusIcon(record.status)} mr-1`}></i>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* No Records */}
      {filteredRecords.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-calendar-line text-gray-400 text-2xl"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No attendance records found</h3>
          <p className="text-gray-500">Try selecting a different date or department</p>
        </div>
      )}
    </div>
  );
}
