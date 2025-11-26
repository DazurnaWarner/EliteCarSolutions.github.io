
export default function FeaturesSection() {
  const employeeFeatures = [
    {
      icon: 'ri-time-line',
      title: 'Clock In/Out System',
      description: 'Quick and secure time tracking with GPS verification and automated break calculations'
    },
    {
      icon: 'ri-calendar-schedule-line',
      title: 'Schedule Management',
      description: 'View work schedules, request time off, and manage shift preferences in real-time'
    },
    {
      icon: 'ri-file-list-3-line',
      title: 'Pay Stub Access',
      description: 'Instant access to current and historical pay stubs with detailed earnings breakdown'
    },
    {
      icon: 'ri-user-settings-line',
      title: 'Personal Information',
      description: 'Update contact details, emergency contacts, and tax withholding information'
    },
    {
      icon: 'ri-heart-pulse-line',
      title: 'Benefits Portal',
      description: 'Manage health insurance, retirement plans, and other employee benefits'
    },
    {
      icon: 'ri-notification-3-line',
      title: 'HR Notifications',
      description: 'Receive important updates, policy changes, and company announcements'
    }
  ];

  const managerFeatures = [
    {
      icon: 'ri-dashboard-3-line',
      title: 'Real-time Dashboard',
      description: 'Monitor team attendance, productivity metrics, and departmental KPIs'
    },
    {
      icon: 'ri-team-line',
      title: 'Team Management',
      description: 'Approve time-off requests, manage schedules, and track employee performance'
    },
    {
      icon: 'ri-bar-chart-box-line',
      title: 'Analytics & Reports',
      description: 'Generate detailed reports on attendance, overtime, and labor costs'
    },
    {
      icon: 'ri-user-add-line',
      title: 'Employee Onboarding',
      description: 'Streamlined new hire process with digital document management'
    },
    {
      icon: 'ri-calendar-check-line',
      title: 'Shift Scheduling',
      description: 'Advanced scheduling tools with conflict detection and optimization'
    },
    {
      icon: 'ri-alert-line',
      title: 'Compliance Alerts',
      description: 'Automated notifications for labor law compliance and policy violations'
    }
  ];

  const hrFeatures = [
    {
      icon: 'ri-money-dollar-circle-line',
      title: 'Automated Payroll',
      description: 'Bi-weekly payroll processing with tax calculations and direct deposit'
    },
    {
      icon: 'ri-shield-check-line',
      title: 'Compliance Management',
      description: 'FLSA, OSHA, and state labor law compliance tracking and reporting'
    },
    {
      icon: 'ri-database-2-line',
      title: 'Employee Records',
      description: 'Centralized digital employee files with secure document storage'
    },
    {
      icon: 'ri-pie-chart-line',
      title: 'Advanced Analytics',
      description: 'Comprehensive workforce analytics and predictive insights'
    },
    {
      icon: 'ri-security-line',
      title: 'Data Security',
      description: 'Bank-level encryption and role-based access controls'
    },
    {
      icon: 'ri-customer-service-2-line',
      title: 'Employee Support',
      description: '24/7 HR helpdesk integration and automated query resolution'
    }
  ];

  const FeatureCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
        <i className={`${icon} text-blue-600 text-xl`}></i>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Comprehensive HR Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tailored features for every role in your organization - from frontline employees to executive management
          </p>
        </div>

        {/* Employee Self-Service Features */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-blue-100 rounded-full px-6 py-3 mb-4">
              <i className="ri-user-line text-blue-600 text-xl mr-3"></i>
              <span className="text-blue-800 font-semibold">Employee Self-Service Portal</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Empower Your Workforce</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Give employees 24/7 access to their information and streamline daily HR tasks
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employeeFeatures.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>

        {/* Manager Features */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-green-100 rounded-full px-6 py-3 mb-4">
              <i className="ri-team-line text-green-600 text-xl mr-3"></i>
              <span className="text-green-800 font-semibold">Managerial Oversight Tools</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Intelligent Team Management</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Advanced tools for managers to optimize team performance and ensure operational excellence
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {managerFeatures.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>

        {/* HR Admin Features */}
        <div>
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-purple-100 rounded-full px-6 py-3 mb-4">
              <i className="ri-settings-3-line text-purple-600 text-xl mr-3"></i>
              <span className="text-purple-800 font-semibold">HR & Payroll Processing</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Enterprise-Grade HR Management</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive HR administration with automated compliance and advanced analytics
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hrFeatures.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>

        {/* System Integration */}
        <div className="mt-20 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Seamless System Integration</h3>
            <p className="text-gray-600">
              Our HR portal integrates with existing automotive service management systems
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <i className="ri-database-line text-blue-600 text-2xl"></i>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Payroll Systems</h4>
              <p className="text-sm text-gray-600">ADP, Paychex integration</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <i className="ri-time-line text-green-600 text-2xl"></i>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Time Clocks</h4>
              <p className="text-sm text-gray-600">Biometric & mobile tracking</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <i className="ri-car-line text-purple-600 text-2xl"></i>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Service Management</h4>
              <p className="text-sm text-gray-600">Shop management systems</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                <i className="ri-shield-check-line text-orange-600 text-2xl"></i>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Compliance</h4>
              <p className="text-sm text-gray-600">OSHA & labor law tracking</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
