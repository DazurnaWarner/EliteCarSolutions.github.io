
import { useState } from 'react';

export default function ContactSection() {
  const [activeTab, setActiveTab] = useState('support');

  const supportTeam = [
    {
      name: 'Dazurna Warner',
      role: 'Project Manager/Front End Developer',
      email: 'dwarner8655@monroeu.edu',
      phone: '(268) 726-4812',
      avatar: 'DW'
    },
    {
      name: 'Terrence Wells',
      role: 'Front End Developer/Business Analyst/HR Liaison',
      email: 'twells5628@monroeu.edu',
      phone: '(347) 262-6071',
      avatar: 'TW'
    },
    {
      name: 'Leon Frazer',
      role: 'System Administrator/Customer Support/Training Lead',
      email: 'lfrazer0367@monroeu.edu',
      phone: '(869) 660-5394',
      avatar: 'LF'
    }
  ];

  const quickLinks = [
    { title: 'Employee Handbook', icon: 'ri-book-line', url: '#' },
    { title: 'Time-Off Policies', icon: 'ri-calendar-line', url: '#' },
    { title: 'Payroll Schedule', icon: 'ri-money-dollar-circle-line', url: '#' },
    { title: 'Benefits Information', icon: 'ri-heart-line', url: '#' },
    { title: 'IT Support Portal', icon: 'ri-customer-service-line', url: '#' },
    { title: 'Training Resources', icon: 'ri-graduation-cap-line', url: '#' }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Support & Resources
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get the help you need and access important company resources all in one place.
          </p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab('support')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-300 whitespace-nowrap cursor-pointer ${
                activeTab === 'support'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Support Team
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-300 whitespace-nowrap cursor-pointer ${
                activeTab === 'resources'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Quick Resources
            </button>
          </div>
        </div>
        
        {/* Support Team Tab */}
        {activeTab === 'support' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {supportTeam.map((member, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">{member.avatar}</span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                
                <div className="space-y-3">
                  <a 
                    href={`mailto:${member.email}`}
                    className="flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <i className="ri-mail-line mr-2"></i>
                    <span className="text-sm">{member.email}</span>
                  </a>
                  
                  <a 
                    href={`tel:${member.phone}`}
                    className="flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <i className="ri-phone-line mr-2"></i>
                    <span className="text-sm">{member.phone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                    <i className={`${link.icon} text-blue-600 group-hover:text-white text-xl`}></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {link.title}
                    </h3>
                    <i className="ri-arrow-right-line text-gray-400 group-hover:text-blue-600 transition-colors duration-300"></i>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
        
        {/* Emergency Contact */}
        <div className="mt-16 bg-red-50 border border-red-200 rounded-xl p-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-alarm-warning-line text-red-600 text-2xl"></i>
            </div>
            
            <h3 className="text-2xl font-bold text-red-900 mb-4">Emergency Support</h3>
            <p className="text-red-700 mb-6">
              For urgent HR or payroll issues outside business hours, contact our emergency support line.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:(555) 999-0000"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-phone-line mr-2"></i>
                Emergency: (555) 999-0000
              </a>
              
              <a 
                href="mailto:emergency@elitecarsolutions.com"
                className="bg-white border border-red-300 text-red-700 hover:bg-red-50 px-6 py-3 rounded-lg font-semibold transition-colors duration-300 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-mail-line mr-2"></i>
                emergency@elitecarsolutions.com
              </a>
            </div>
          </div>
        </div>
        
        {/* System Status */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="font-medium">All systems operational</span>
          </div>
        </div>
      </div>
    </section>
  );
}