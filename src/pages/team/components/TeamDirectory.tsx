
import { useState } from 'react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  specialties: string[];
  systemRole: string;
}

export default function TeamDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Dazurna Warner',
      role: 'Project Manager/Front End Developer',
      department: 'IT Development',
      phone: '(268) 726-4812',
      email: 'dwarner8655@monroeu.edu',
      specialties: ['Project Management', 'Frontend Development', 'Team Leadership'],
      systemRole: 'HR Manager'
    },
    {
      id: '2',
      name: 'Ezla Stewart',
      role: 'QA Tester/Database Assistant',
      department: 'Quality Assurance',
      phone: '(784) 531-2562',
      email: 'estewart9925@monroeu.edu',
      specialties: ['Quality Testing', 'Database Management', 'Test Automation'],
      systemRole: 'Employee'
    },
    {
      id: '3',
      name: 'Quincy Fevriere',
      role: 'System Administrator',
      department: 'IT Operations',
      phone: '(758) 714-9931',
      email: 'qfevriere4608@monroeu.edu',
      specialties: ['System Administration', 'Network Management', 'Server Maintenance'],
      systemRole: 'Administrator'
    },
    {
      id: '4',
      name: 'Kimon Elizee',
      role: 'QA/Test Engineer & UI/UX Designer',
      department: 'Design & QA',
      phone: '(767) 316-3914',
      email: 'kelizee6359@monroeu.edu',
      specialties: ['UI/UX Design', 'Test Engineering', 'User Experience'],
      systemRole: 'Employee'
    },
    {
      id: '5',
      name: 'Arade Moses',
      role: 'System Administrator/DevOps Engineer/Security Specialist',
      department: 'IT Security',
      phone: '(862) 300-6807',
      email: 'amoses4809@monroeu.edu',
      specialties: ['DevOps', 'Security', 'Infrastructure', 'System Administration'],
      systemRole: 'Administrator'
    },
    {
      id: '6',
      name: 'Tahura Tahura Tabasum',
      role: 'Backend Developer/Database Specialist/Data Engineer',
      department: 'Backend Development',
      phone: '(347) 836-1253',
      email: 'ttahuratabasum8297@monroeu.edu',
      specialties: ['Backend Development', 'Database Design', 'Data Engineering'],
      systemRole: 'Employee'
    },
    {
      id: '7',
      name: 'Daniel Zuniga',
      role: 'Database Specialist/Data Engineer',
      department: 'Data Management',
      phone: '(763) 229-1941',
      email: 'dzuniga7234@monroeu.edu',
      specialties: ['Database Management', 'Data Engineering', 'Data Analytics'],
      systemRole: 'Employee'
    },
    {
      id: '8',
      name: 'Leon Frazer',
      role: 'System Administrator/DevOps Engineer/Security Specialist/Customer Support/Training Lead',
      department: 'IT Operations',
      phone: '(869) 660-5394',
      email: 'lfrazer0367@monroeu.edu',
      specialties: ['System Administration', 'DevOps', 'Security', 'Customer Support', 'Training'],
      systemRole: 'Manager'
    },
    {
      id: '9',
      name: 'Terrence Wells',
      role: 'Front End Developer/Business Analyst/HR Liaison',
      department: 'Development & HR',
      phone: '(347) 262-6071',
      email: 'twells5628@monroeu.edu',
      specialties: ['Frontend Development', 'Business Analysis', 'HR Coordination'],
      systemRole: 'Employee'
    },
    {
      id: '10',
      name: 'Humayra Amin',
      role: 'UI/UX Designer',
      department: 'Design',
      phone: '(647) 886-7036',
      email: 'hamin9686@monroecollege.edu',
      specialties: ['UI Design', 'UX Research', 'Visual Design', 'Prototyping'],
      systemRole: 'Employee'
    }
  ];

  const departments = ['all', 'IT Development', 'Quality Assurance', 'IT Operations', 'Design & QA', 'IT Security', 'Backend Development', 'Data Management', 'Development & HR', 'Design'];

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDepartment = selectedDepartment === 'all' || member.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

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

  const getRoleColor = (systemRole: string) => {
    switch (systemRole) {
      case 'HR Manager': return 'bg-purple-100 text-purple-700';
      case 'Administrator': return 'bg-red-100 text-red-700';
      case 'Manager': return 'bg-blue-100 text-blue-700';
      case 'Employee': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Elite Car Solutions Team Directory
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet our dedicated IT and development team working on the HR Management Portal project
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Team Members
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
                  placeholder="Search by name, role, or specialty..."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Department
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

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <i className={`${getDepartmentIcon(member.department)} text-blue-500`}></i>
                        <span>{member.department}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(member.systemRole)}`}>
                    {member.systemRole}
                  </span>
                </div>

                {/* Role */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Role</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{member.role}</p>
                </div>

                {/* Specialties */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-1">
                    {member.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <i className="ri-phone-line text-green-500"></i>
                    <a href={`tel:${member.phone}`} className="hover:text-blue-600 cursor-pointer">
                      {member.phone}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <i className="ri-mail-line text-blue-500"></i>
                    <a href={`mailto:${member.email}`} className="hover:text-blue-600 cursor-pointer break-all">
                      {member.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-search-line text-gray-400 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No team members found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
          </div>
        )}

        {/* Project Info */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Information</h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-graduation-cap-line text-blue-600 text-xl"></i>
                </div>
                <h3 className="font-semibold text-gray-900">Academic Institution</h3>
                <p className="text-gray-600">Monroe University</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-book-line text-green-600 text-xl"></i>
                </div>
                <h3 className="font-semibold text-gray-900">Course</h3>
                <p className="text-gray-600">25FL-IT495-45 - Senior Seminar</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-user-star-line text-purple-600 text-xl"></i>
                </div>
                <h3 className="font-semibold text-gray-900">Professor</h3>
                <p className="text-gray-600">Omolola Sanni</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
