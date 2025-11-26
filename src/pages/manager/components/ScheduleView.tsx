
import { useState, useEffect } from 'react';

interface ScheduleEntry {
  id: string;
  employee_id: string;
  employee_name: string;
  department: string;
  date: string;
  shift_start: string;
  shift_end: string;
  break_duration: number;
  status: 'scheduled' | 'confirmed' | 'absent' | 'completed';
  total_hours: number;
}

export default function ScheduleView() {
  const [schedules, setSchedules] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    fetchSchedules();
  }, [selectedDate, selectedDepartment]);

  const fetchSchedules = async () => {
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
            action: 'get_team_schedules',
            date: selectedDate,
            department: selectedDepartment
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSchedules(data.schedules || []);
          setDepartments(data.departments || []);
        } else {
          console.error('Failed to fetch schedules:', data.message);
          setFallbackData();
        }
      } else {
        console.error('Failed to fetch schedules - Response not OK:', response.status);
        setFallbackData();
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const setFallbackData = () => {
    setSchedules([
      {
        id: '1',
        employee_id: 'emp1',
        employee_name: 'Sarah Johnson',
        department: 'Engineering',
        date: selectedDate,
        shift_start: '09:00',
        shift_end: '17:00',
        break_duration: 60,
        status: 'confirmed',
        total_hours: 8
      },
      {
        id: '2',
        employee_id: 'emp2',
        employee_name: 'Michael Chen',
        department: 'Marketing',
        date: selectedDate,
        shift_start: '08:30',
        shift_end: '16:30',
        break_duration: 30,
        status: 'scheduled',
        total_hours: 7.5
      },
      {
        id: '3',
        employee_id: 'emp3',
        employee_name: 'Emily Rodriguez',
        department: 'Sales',
        date: selectedDate,
        shift_start: '10:00',
        shift_end: '18:00',
        break_duration: 45,
        status: 'confirmed',
        total_hours: 7.25
      },
      {
        id: '4',
        employee_id: 'emp4',
        employee_name: 'David Wilson',
        department: 'Engineering',
        date: selectedDate,
        shift_start: '09:30',
        shift_end: '17:30',
        break_duration: 60,
        status: 'scheduled',
        total_hours: 8
      },
      {
        id: '5',
        employee_id: 'emp5',
        employee_name: 'Lisa Thompson',
        department: 'HR',
        date: selectedDate,
        shift_start: '08:00',
        shift_end: '16:00',
        break_duration: 30,
        status: 'confirmed',
        total_hours: 7.5
      }
    ]);
    setDepartments(['Engineering', 'Marketing', 'Sales', 'HR', 'Finance']);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const filteredSchedules = schedules.filter(schedule => 
    selectedDepartment === 'all' || schedule.department === selectedDepartment
  );

  const totalScheduled = filteredSchedules.length;
  const confirmedCount = filteredSchedules.filter(s => s.status === 'confirmed').length;
  const totalHours = filteredSchedules.reduce((sum, s) => sum + s.total_hours, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <i className="ri-loader-line animate-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Loading schedules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h2 className="text-2xl font-bold text-gray-900">Team Schedule</h2>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
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
              <i className="ri-calendar-line text-blue-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">{totalScheduled}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-check-line text-green-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">{confirmedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="ri-time-line text-purple-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold text-gray-900">{totalHours.toFixed(1)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <i className="ri-team-line text-orange-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Schedule for {new Date(selectedDate).toLocaleDateString()}
          </h3>
        </div>

        {filteredSchedules.length > 0 ? (
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
                    Shift Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Break
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Hours
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
                {filteredSchedules.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {schedule.employee_name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {schedule.employee_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {schedule.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTime(schedule.shift_start)} - {formatTime(schedule.shift_end)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {schedule.break_duration} min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {schedule.total_hours}h
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(schedule.status)}`}>
                        {schedule.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 cursor-pointer">
                          <i className="ri-edit-line"></i>
                        </button>
                        <button className="text-red-600 hover:text-red-900 cursor-pointer">
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <i className="ri-calendar-line text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Schedules Found</h3>
            <p className="text-gray-500">No schedules found for the selected date and department.</p>
            <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer">
              <i className="ri-add-line mr-2"></i>
              Add Schedule
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
