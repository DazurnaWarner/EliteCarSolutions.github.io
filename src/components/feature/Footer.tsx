
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Quick Access',
      links: [
        { name: 'Employee Portal', href: '#' },
        { name: 'Manager Dashboard', href: '#' },
        { name: 'Payroll Center', href: '#' },
        { name: 'Time Tracking', href: '#' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Employee Handbook', href: '#' },
        { name: 'Benefits Guide', href: '#' },
        { name: 'Training Materials', href: '#' },
        { name: 'Policy Updates', href: '#' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '#' },
        { name: 'Contact HR', href: '#' },
        { name: 'IT Support', href: '#' },
        { name: 'System Status', href: '#' }
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl" style={{ fontFamily: '"Pacifico", serif' }}>E</span>
              </div>
              <div>
                <h3 className="text-xl font-bold" style={{ fontFamily: '"Pacifico", serif' }}>
                  Elite Car Solutions
                </h3>
                <p className="text-gray-400 text-sm">HR Management Portal</p>
              </div>
            </div>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              Streamlining workforce management with automated attendance tracking, 
              payroll processing, and comprehensive HR tools.
            </p>
            
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300 cursor-pointer">
                <i className="ri-phone-line text-gray-400 hover:text-white"></i>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300 cursor-pointer">
                <i className="ri-mail-line text-gray-400 hover:text-white"></i>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300 cursor-pointer">
                <i className="ri-map-pin-line text-gray-400 hover:text-white"></i>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Emergency Contact */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                <i className="ri-alarm-warning-line text-white text-xl"></i>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-red-400 mb-1">Emergency HR Support</h4>
                <p className="text-gray-400 text-sm mb-2">Available 24/7 for urgent payroll and HR issues</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <a href="tel:(555) 999-0000" className="text-red-400 hover:text-red-300 transition-colors cursor-pointer">
                    <i className="ri-phone-line mr-1"></i>
                    (555) 999-0000
                  </a>
                  <a href="mailto:emergency@elitecarsolutions.com" className="text-red-400 hover:text-red-300 transition-colors cursor-pointer">
                    <i className="ri-mail-line mr-1"></i>
                    emergency@elitecarsolutions.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} Elite Car Solutions Inc. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">
                Data Security
              </a>
              <a href="https://readdy.ai/?origin=logo" className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">
                Powered by Readdy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}