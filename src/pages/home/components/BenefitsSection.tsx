
export default function BenefitsSection() {
  const employeeBenefits = [
    {
      icon: 'ri-smartphone-line',
      title: 'Mobile Access',
      description: 'Clock in/out from anywhere with GPS verification and mobile-optimized interface'
    },
    {
      icon: 'ri-time-line',
      title: 'Real-Time Tracking',
      description: 'Instant visibility into hours worked, overtime calculations, and break compliance'
    },
    {
      icon: 'ri-file-text-line',
      title: 'Digital Pay Stubs',
      description: 'Secure access to current and historical pay information with detailed breakdowns'
    },
    {
      icon: 'ri-calendar-event-line',
      title: 'Self-Service Scheduling',
      description: 'Request time off, view schedules, and manage availability preferences'
    }
  ];

  const managerBenefits = [
    {
      icon: 'ri-dashboard-line',
      title: 'Live Dashboard',
      description: 'Real-time team attendance monitoring with instant alerts and notifications'
    },
    {
      icon: 'ri-bar-chart-line',
      title: 'Labor Cost Control',
      description: 'Track overtime, monitor labor budgets, and optimize workforce allocation'
    },
    {
      icon: 'ri-user-check-line',
      title: 'Approval Workflows',
      description: 'Streamlined time-off approvals and schedule change management'
    },
    {
      icon: 'ri-file-chart-line',
      title: 'Performance Analytics',
      description: 'Detailed reports on productivity, attendance patterns, and team metrics'
    }
  ];

  const hrBenefits = [
    {
      icon: 'ri-money-dollar-circle-line',
      title: 'Automated Payroll',
      description: 'Bi-weekly processing with tax calculations, direct deposit, and compliance reporting'
    },
    {
      icon: 'ri-shield-check-line',
      title: 'Compliance Assurance',
      description: 'FLSA, OSHA, and state labor law compliance with automated audit trails'
    },
    {
      icon: 'ri-error-warning-line',
      title: 'Error Reduction',
      description: 'Eliminate manual data entry errors and reduce administrative overhead by 75%'
    },
    {
      icon: 'ri-database-2-line',
      title: 'Centralized Records',
      description: 'Secure digital employee files with role-based access and document management'
    }
  ];

  const BenefitCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
        <i className={`${icon} text-white text-xl`}></i>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Key Business Benefits
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Streamlined operations, reduced costs, and improved compliance for Elite Car Solutions
          </p>
        </div>

        {/* Employee Benefits */}
        <div className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-blue-50 rounded-full p-3 mr-4">
              <i className="ri-user-line text-blue-600 text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">For Employees</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {employeeBenefits.map((benefit, index) => (
              <BenefitCard key={index} {...benefit} />
            ))}
          </div>
        </div>

        {/* Manager Benefits */}
        <div className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-green-50 rounded-full p-3 mr-4">
              <i className="ri-team-line text-green-600 text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">For Managers</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {managerBenefits.map((benefit, index) => (
              <BenefitCard key={index} {...benefit} />
            ))}
          </div>
        </div>

        {/* HR Benefits */}
        <div className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-purple-50 rounded-full p-3 mr-4">
              <i className="ri-settings-3-line text-purple-600 text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">For HR Administration</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hrBenefits.map((benefit, index) => (
              <BenefitCard key={index} {...benefit} />
            ))}
          </div>
        </div>

        {/* ROI Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">Measurable ROI</h3>
            <p className="text-blue-100 text-lg">
              Quantifiable improvements in operational efficiency and cost savings
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="bg-white/10 rounded-lg p-6">
              <div className="text-3xl font-bold mb-2">75%</div>
              <div className="text-blue-100">Reduction in Administrative Errors</div>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <div className="text-3xl font-bold mb-2">60%</div>
              <div className="text-blue-100">Faster Payroll Processing</div>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <div className="text-3xl font-bold mb-2">40%</div>
              <div className="text-blue-100">Reduced HR Workload</div>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-blue-100">Compliance Accuracy</div>
            </div>
          </div>
        </div>

        {/* Security & Compliance */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Security & Compliance</h3>
            <p className="text-gray-600">
              Enterprise-grade security measures protecting sensitive employee data
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-shield-check-line text-red-600 text-2xl"></i>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Data Encryption</h4>
              <p className="text-sm text-gray-600">Bank-level 256-bit SSL encryption for all data transmission and storage</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-user-settings-line text-yellow-600 text-2xl"></i>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Role-Based Access</h4>
              <p className="text-sm text-gray-600">Granular permissions ensuring users only access authorized information</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-file-shield-line text-green-600 text-2xl"></i>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Audit Trails</h4>
              <p className="text-sm text-gray-600">Complete activity logging for compliance reporting and security monitoring</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
