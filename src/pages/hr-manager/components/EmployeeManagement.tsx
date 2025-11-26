
import { useState, useEffect } from 'react';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  phone: string;
  status: 'active' | 'inactive';
  attendanceStatus: 'present' | 'absent' | 'late';
  joinDate: string;
  systemRole: string;
}

export function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'Dazurna Warner',
      email: 'dwarner8655@monroeu.edu',
      role: 'Project Manager/Front End Developer',
      department: 'IT Development',
      phone: '(268) 726-4812',
      status: 'active',
      attendanceStatus: 'present',
      joinDate: '2024-01-15',
      systemRole: 'HR Manager'
    },
    {
      id: '2',
      name: 'Ezla Stewart',
      email: 'estewart9925@monroeu.edu',
      role: 'QA Tester/Database Assistant',
      department: 'Quality Assurance',
      phone: '(784) 531-2562',
      status: 'active',
      attendanceStatus: 'present',
      joinDate: '2024-02-01',
      systemRole: 'Employee'
    },
    {
      id: '3',
      name: 'Quincy Fevriere',
      email: 'qfevriere4608@monroeu.edu',
      role: 'System Administrator',
      department: 'IT Operations',
      phone: '(758) 714-9931',
      status: 'active',
      attendanceStatus: 'late',
      joinDate: '2024-01-10',
      systemRole: 'Administrator'
    },
    {
      id: '4',
      name: 'Kimon Elizee',
      email: 'kelizee6359@monroeu.edu',
      role: 'QA/Test Engineer & UI/UX Designer',
      department: 'Design & QA',
      phone: '(767) 316-3914',
      status: 'active',
      attendanceStatus: 'present',
      joinDate: '2024-01-20',
      systemRole: 'Employee'
    },
    {
      id: '5',
      name: 'Arade Moses',
      email: 'amoses4809@monroeu.edu',
      role: 'System Administrator/DevOps Engineer/Security Specialist',
      department: 'IT Security',
      phone: '(862) 300-6807',
      status: 'active',
      attendanceStatus: 'present',
      joinDate: '2024-01-08',
      systemRole: 'Administrator'
    },
    {
      id: '6',
      name: 'Tahura Tabasum',
      email: 'ttahuratabasum8297@monroeu.edu',
      role: 'Backend Developer/Database Specialist/Data Engineer',
      department: 'Backend Development',
      phone: '(347) 836-1253',
      status: 'active',
      attendanceStatus: 'present',
      joinDate: '2024-02-05',
      systemRole: 'Employee'
    },
    {
      id: '7',
      name: 'Daniel Zuniga',
      email: 'dzuniga7234@monroeu.edu',
      role: 'Database Specialist/Data Engineer',
      department: 'Data Management',
      phone: '(763) 229-1941',
      status: 'active',
      attendanceStatus: 'absent',
      joinDate: '2024-02-10',
      systemRole: 'Employee'
    },
    {
      id: '8',
      name: 'Leon Frazer',
      email: 'lfrazer0367@monroeu.edu',
      role: 'System Administrator/DevOps Engineer/Security Specialist/Customer Support/Training Lead',
      department: 'IT Operations',
      phone: '(869) 660-5394',
      status: 'active',
      attendanceStatus: 'present',
      joinDate: '2024-01-05',
      systemRole: 'Manager'
    },
    {
      id: '9',
      name: 'Terrence Wells',
      email: 'twells5628@monroeu.edu',
      role: 'Front End Developer/Business Analyst/HR Liaison',
      department: 'Development & HR',
      phone: '(347) 262-6071',
      status: 'active',
      attendanceStatus: 'present',
      joinDate: '2024-01-25',
      systemRole: 'Employee'
    },
    {
      id: '10',
      name: 'Humayra Amin',
      email: 'hamin9686@monroecollege.edu',
      role: 'UI/UX Designer',
      department: 'Design',
      phone: '(647) 886-7036',
      status: 'active',
      attendanceStatus: 'present',
      joinDate: '2024-02-15',
      systemRole: 'Employee'
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const departments = ['all', 'IT Development', 'Quality Assurance', 'IT Operations', 'Design & QA', 'IT Security', 'Backend Development', 'Data Management', 'Development & HR', 'Design'];

  const fetchEmployees = async () => {
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
          action: 'get_employees'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.employees) {
          // Map API data to our employee format, but keep our actual team data as fallback
          console.log('Fetched employees from API:', data.employees);
        }
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-700';
      case 'absent': return 'bg-red-100 text-red-700';
      case 'late': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleColor = (systemRole: string) => {
    switch (systemRole) {
      case 'HR Manager': return 'bg-purple-100 text-purple-700';
      case 'Administrator': return 'bg-red-100 text-red-700';
      case 'Manager': return 'bg-blue-100 text-blue-700';
      case 'Employee': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case 'IT Development': return 'ri-code-line';
      case 'Quality Assurance': return 'ri-shield-check-line';
      case 'IT Operations': return 'ri-server-line';
      case 'Design & QA': return 'ri-palette-line';
      case 'IT Security': return 'ri-shield-keyhole-line';
      case 'Backend Development': return 'ri-database-line';
      case 'Data Management': return 'ri-bar-chart-line';
      case 'Development & HR': return 'ri-team-line';
      case 'Design': return 'ri-brush-line';
      default: return 'ri-user-line';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Employee Management</h2>
          <p className="text-gray-600">Manage Elite Car Solutions team members</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer">
          <i className="ri-user-add-line mr-2"></i>
          Add Employee
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Employees
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
                placeholder="Search by name, email, or role..."
              />
            </div>
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
        </div>
      </div>

      {/* Employee Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{employee.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <i className={`${getDepartmentIcon(employee.department)} text-blue-500`}></i>
                      <span>{employee.department}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(employee.systemRole)}`}>
                    {employee.systemRole}
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.attendanceStatus)}`}>
                    {employee.attendanceStatus}
                  </span>
                </div>
              </div>

              {/* Role */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-1">Role</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{employee.role}</p>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <i className="ri-phone-line text-green-500"></i>
                  <a href={`tel:${employee.phone}`} className="hover:text-blue-600 cursor-pointer">
                    {employee.phone}
                  </a>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <i className="ri-mail-line text-blue-500"></i>
                  <a href={`mailto:${employee.email}`} className="hover:text-blue-600 cursor-pointer break-all">
                    {employee.email}
                  </a>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedEmployee(employee)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm whitespace-nowrap cursor-pointer"
                >
                  View Details
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm whitespace-nowrap cursor-pointer">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-search-line text-gray-400 text-2xl"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No employees found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or filters</p>
        </div>
      )}

      {/* Employee Details Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedEmployee.name}</h2>
                    <p className="text-gray-600">{selectedEmployee.role}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(selectedEmployee.systemRole)}`}>
                        {selectedEmployee.systemRole}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedEmployee.attendanceStatus)}`}>
                        {selectedEmployee.attendanceStatus}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <i className="ri-mail-line text-blue-500"></i>
                        <a href={`mailto:${selectedEmployee.email}`} className="text-blue-600 hover:underline cursor-pointer">
                          {selectedEmployee.email}
                        </a>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <i className="ri-phone-line text-green-500"></i>
                        <a href={`tel:${selectedEmployee.phone}`} className="text-green-600 hover:underline cursor-pointer">
                          {selectedEmployee.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Department</h3>
                    <div className="flex items-center space-x-2">
                      <i className={`${getDepartmentIcon(selectedEmployee.department)} text-blue-500`}></i>
                      <span className="text-sm text-gray-600">{selectedEmployee.department}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Employment Details</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>Join Date: {new Date(selectedEmployee.joinDate).toLocaleDateString()}</div>
                      <div>Status: <span className="capitalize">{selectedEmployee.status}</span></div>
                      <div>Employee ID: {selectedEmployee.id}</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Current Status</h3>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        selectedEmployee.attendanceStatus === 'present' ? 'bg-green-500' :
                        selectedEmployee.attendanceStatus === 'late' ? 'bg-orange-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-sm text-gray-600 capitalize">{selectedEmployee.attendanceStatus}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer">
                  <i className="ri-edit-line mr-2"></i>
                  Edit Employee
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer">
                  <i className="ri-message-line mr-2"></i>
                  Send Message
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer">
                  <i className="ri-file-text-line mr-2"></i>
                  View Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
