
import { useState, useEffect } from 'react';

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  department: string;
  position: string;
  hire_date: string;
  status: string;
  phone?: string;
  avatar?: string;
}

interface AttendanceRecord {
  employee_id: string;
  date: string;
  check_in: string;
  check_out: string;
  status: string;
  hours_worked: number;
}

export default function TeamView() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      // Fetch team members
      const usersResponse = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/user-management`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ action: 'get_users' })
      });

      if (usersResponse.ok) {
        const userData = await usersResponse.json();
        if (userData.success) {
          // Filter out admin users and only show employees/managers
          const teamData = userData.users.filter((user: any) => 
            user.role === 'employee' || user.role === 'manager'
          ).map((user: any) => ({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            email: user.email,
            department: user.department,
            position: user.position,
            hire_date: user.hire_date,
            status: user.status,
            phone: user.phone
          }));
          setTeamMembers(teamData);
        }
      }

      // Fetch attendance data
      const attendanceResponse = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/attendance-tracking`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ 
          action: 'getTeamAttendance',
          date: new Date().toISOString().split('T')[0]
        })
      });

      if (attendanceResponse.ok) {
        const attendanceResult = await attendanceResponse.json();
        if (attendanceResult.success) {
          setAttendanceData(attendanceResult.attendance || []);
        }
      }

    } catch (error) {
      console.error('Error fetching team data:', error);
      // Set mock data for demo
      setTeamMembers([
        {
          id: '1',
          first_name: 'John',
          last_name: 'Smith',
          username: 'john.smith',
          email: 'john.smith@ecats.com',
          department: 'IT',
          position: 'Software Developer',
          hire_date: '2023-01-15',
          status: 'active',
          phone: '+1 (555) 123-4567'
        },
        {
          id: '2',
          first_name: 'Sarah',
          last_name: 'Johnson',
          username: 'sarah.johnson',
          email: 'sarah.johnson@ecats.com',
          department: 'Operations',
          position: 'Operations Specialist',
          hire_date: '2022-08-20',
          status: 'active',
          phone: '+1 (555) 234-5678'
        },
        {
          id: '3',
          first_name: 'Mike',
          last_name: 'Davis',
          username: 'mike.davis',
          email: 'mike.davis@ecats.com',
          department: 'Service',
          position: 'Customer Service Rep',
          hire_date: '2023-03-10',
          status: 'active',
          phone: '+1 (555) 345-6789'
        },
        {
          id: '4',
          first_name: 'Emily',
          last_name: 'Brown',
          username: 'emily.brown',
          email: 'emily.brown@ecats.com',
          department: 'Finance',
          position: 'Financial Analyst',
          hire_date: '2022-11-05',
          status: 'active',
          phone: '+1 (555) 456-7890'
        }
      ]);

      setAttendanceData([
        {
          employee_id: '1',
          date: new Date().toISOString().split('T')[0],
          check_in: '09:00',
          check_out: '17:30',
          status: 'present',
          hours_worked: 8.5
        },
        {
          employee_id: '2',
          date: new Date().toISOString().split('T')[0],
          check_in: '08:45',
          check_out: '',
          status: 'present',
          hours_worked: 0
        },
        {
          employee_id: '3',
          date: new Date().toISOString().split('T')[0],
          check_in: '',
          check_out: '',
          status: 'absent',
          hours_worked: 0
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceStatus = (memberId: string) => {
    const attendance = attendanceData.find(record => record.employee_id === memberId);
    if (!attendance) return { status: 'no-data', color: 'bg-gray-100 text-gray-600' };
    
    switch (attendance.status) {
      case 'present':
        return { 
          status: attendance.check_out ? 'completed' : 'working', 
          color: attendance.check_out ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
        };
      case 'absent':
        return { status: 'absent', color: 'bg-red-100 text-red-700' };
      case 'late':
        return { status: 'late', color: 'bg-orange-100 text-orange-700' };
      default:
        return { status: 'unknown', color: 'bg-gray-100 text-gray-600' };
    }
  };

  const getDepartmentColor = (department: string) => {
    const colors: Record<string, string> = {
      'IT': 'bg-blue-100 text-blue-800',
      'Operations': 'bg-green-100 text-green-800',
      'Service': 'bg-purple-100 text-purple-800',
      'Finance': 'bg-yellow-100 text-yellow-800',
      'Human Resources': 'bg-pink-100 text-pink-800',
      'Compliance': 'bg-indigo-100 text-indigo-800'
    };
    return colors[department] || 'bg-gray-100 text-gray-800';
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Team Overview</h2>
            <p className="text-gray-600">{teamMembers.length} team members</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-lg cursor-pointer ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <i className="ri-grid-line"></i>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg cursor-pointer ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <i className="ri-list-check"></i>
            </button>
          </div>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Present Today</p>
                <p className="text-2xl font-bold text-green-700">
                  {attendanceData.filter(record => record.status === 'present').length}
                </p>
              </div>
              <i className="ri-user-check-line text-2xl text-green-600"></i>
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Absent Today</p>
                <p className="text-2xl font-bold text-red-700">
                  {attendanceData.filter(record => record.status === 'absent').length}
                </p>
              </div>
              <i className="ri-user-unfollow-line text-2xl text-red-600"></i>
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Late Today</p>
                <p className="text-2xl font-bold text-orange-700">
                  {attendanceData.filter(record => record.status === 'late').length}
                </p>
              </div>
              <i className="ri-time-line text-2xl text-orange-600"></i>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Hours</p>
                <p className="text-2xl font-bold text-blue-700">
                  {attendanceData.reduce((total, record) => total + (record.hours_worked || 0), 0).toFixed(1)}
                </p>
              </div>
              <i className="ri-timer-line text-2xl text-blue-600"></i>
            </div>
          </div>
        </div>

        {/* Team Members */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map(member => {
              const attendanceStatus = getAttendanceStatus(member.id);
              const attendance = attendanceData.find(record => record.employee_id === member.id);
              
              return (
                <div
                  key={member.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                      {getInitials(member.first_name, member.last_name)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {member.first_name} {member.last_name}
                      </h3>
                      <p className="text-sm text-gray-600">{member.position}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getDepartmentColor(member.department)}`}>
                        {member.department}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${attendanceStatus.color}`}>
                        {attendanceStatus.status}
                      </span>
                      {attendance && attendance.check_in && (
                        <span className="text-xs text-gray-500">
                          In: {attendance.check_in}
                          {attendance.check_out && ` | Out: ${attendance.check_out}`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teamMembers.map(member => {
                  const attendanceStatus = getAttendanceStatus(member.id);
                  const attendance = attendanceData.find(record => record.employee_id === member.id);
                  
                  return (
                    <tr key={member.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedMember(member)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                            {getInitials(member.first_name, member.last_name)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {member.first_name} {member.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getDepartmentColor(member.department)}`}>
                          {member.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.position}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${attendanceStatus.color}`}>
                          {attendanceStatus.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {attendance?.check_in || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {attendance?.check_out || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {attendance?.hours_worked ? `${attendance.hours_worked}h` : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {teamMembers.length === 0 && (
          <div className="text-center py-12">
            <i className="ri-team-line text-4xl text-gray-300 mb-2"></i>
            <p className="text-gray-500">No team members found</p>
          </div>
        )}
      </div>

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Employee Details</h3>
              <button
                onClick={() => setSelectedMember(null)}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-medium">
                  {getInitials(selectedMember.first_name, selectedMember.last_name)}
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {selectedMember.first_name} {selectedMember.last_name}
                  </h4>
                  <p className="text-gray-600">{selectedMember.position}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase">Department</label>
                  <p className="text-sm text-gray-900">{selectedMember.department}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Status</label>
                  <p className="text-sm text-gray-900 capitalize">{selectedMember.status}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Email</label>
                  <p className="text-sm text-gray-900">{selectedMember.email}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Phone</label>
                  <p className="text-sm text-gray-900">{selectedMember.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Hire Date</label>
                  <p className="text-sm text-gray-900">{new Date(selectedMember.hire_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Today's Status</label>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAttendanceStatus(selectedMember.id).color}`}>
                    {getAttendanceStatus(selectedMember.id).status}
                  </span>
                </div>
              </div>

              {(() => {
                const attendance = attendanceData.find(record => record.employee_id === selectedMember.id);
                if (attendance && attendance.check_in) {
                  return (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">Today's Attendance</h5>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Check In:</span>
                          <span className="ml-2 font-medium">{attendance.check_in}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Check Out:</span>
                          <span className="ml-2 font-medium">{attendance.check_out || 'Still working'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Hours Worked:</span>
                          <span className="ml-2 font-medium">{attendance.hours_worked || 0}h</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
