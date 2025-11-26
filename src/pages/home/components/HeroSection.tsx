import { useState } from 'react';

export default function HeroSection() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginType, setLoginType] = useState<'employee' | 'manager' | 'hr'>('employee');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/employee-auth`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          action: 'login',
          email: loginForm.username,
          password: loginForm.password
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const employee = data.employee;
        
        // Store employee data in localStorage
        localStorage.setItem('currentUser', JSON.stringify(employee));
        localStorage.setItem('currentEmployee', JSON.stringify(employee));
        
        // Redirect based on role
        if (employee.role === 'system_admin') {
          window.REACT_APP_NAVIGATE('/admin');
        } else if (employee.role === 'hr_manager') {
          window.REACT_APP_NAVIGATE('/hr-manager');
        } else if (employee.role === 'manager') {
          window.REACT_APP_NAVIGATE('/manager');
        } else if (employee.role === 'employee') {
          window.REACT_APP_NAVIGATE('/employee');
        } else if (employee.role === 'auditor') {
          window.REACT_APP_NAVIGATE('/admin');
        } else {
          window.REACT_APP_NAVIGATE('/employee');
        }
        
        setIsLoginOpen(false);
      } else {
        setErrorMessage(data.message || 'Invalid email or password. Please check your credentials and try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Connection failed. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Validate if user role can access the selected portal
  const validatePortalAccess = (selectedPortal: string, userRole: string): boolean => {
    switch (selectedPortal) {
      case 'employee':
        return userRole === 'employee';
      case 'manager':
        return userRole === 'manager';
      case 'hr':
        return userRole === 'hr_manager' || userRole === 'system_admin' || userRole === 'auditor';
      default:
        return false;
    }
  };

  // Get display name for portal
  const getPortalDisplayName = (portal: string): string => {
    switch (portal) {
      case 'employee':
        return 'Employee Portal';
      case 'manager':
        return 'Manager Portal';
      case 'hr':
        return 'HR Admin Portal';
      default:
        return 'Portal';
    }
  };

  // Get display name for user role
  const getRoleDisplayName = (role: string): string => {
    switch (role) {
      case 'employee':
        return 'Employee';
      case 'manager':
        return 'Manager';
      case 'hr_manager':
        return 'HR Manager';
      case 'system_admin':
        return 'System Administrator';
      case 'auditor':
        return 'Auditor';
      default:
        return role;
    }
  };

  const handleModalClose = () => {
    setIsLoginOpen(false);
    setErrorMessage('');
    setLoginForm({ username: '', password: '' });
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(30, 64, 175, 0.8), rgba(59, 130, 246, 0.6)), url('https://readdy.ai/api/search-image?query=modern%20professional%20automotive%20service%20center%20with%20clean%20workspace%2C%20advanced%20diagnostic%20equipment%2C%20professional%20technicians%20in%20uniform%2C%20bright%20lighting%2C%20organized%20tools%20and%20car%20lifts%2C%20corporate%20environment%20with%20blue%20and%20white%20color%20scheme&width=1920&height=1080&seq=hero-automotive&orientation=landscape')`
      }}
    >
      <div className="container mx-auto px-6 text-center text-white relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Elite Car Solutions Inc.
            <span className="block text-3xl md:text-4xl font-normal mt-2 text-blue-200">
              HR Management Portal
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Streamlined employee management, automated payroll processing, and real-time attendance tracking for our automotive service professionals
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto">
            <button
              onClick={() => {setLoginType('employee'); setIsLoginOpen(true);}}
              className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-4 rounded-lg hover:bg-white/30 transition-all duration-300 whitespace-nowrap cursor-pointer"
            >
              <i className="ri-user-line text-2xl mb-2 block"></i>
              Employee Login
            </button>
            <button
              onClick={() => {setLoginType('manager'); setIsLoginOpen(true);}}
              className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-4 rounded-lg hover:bg-white/30 transition-all duration-300 whitespace-nowrap cursor-pointer"
            >
              <i className="ri-team-line text-2xl mb-2 block"></i>
              Manager Portal
            </button>
            <button
              onClick={() => {setLoginType('hr'); setIsLoginOpen(true);}}
              className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-4 rounded-lg hover:bg-white/30 transition-all duration-300 whitespace-nowrap cursor-pointer"
            >
              <i className="ri-settings-3-line text-2xl mb-2 block"></i>
              HR Admin
            </button>
          </div>

          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="ri-time-line text-white text-xl"></i>
              </div>
              <h3 className="font-semibold mb-2">Time Tracking</h3>
              <p className="text-sm text-blue-100">Real-time clock in/out system</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="ri-money-dollar-circle-line text-white text-xl"></i>
              </div>
              <h3 className="font-semibold mb-2">Payroll</h3>
              <p className="text-sm text-blue-100">Automated processing</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="ri-calendar-check-line text-white text-xl"></i>
              </div>
              <h3 className="font-semibold mb-2">Scheduling</h3>
              <p className="text-sm text-blue-100">Smart shift management</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="ri-shield-check-line text-white text-xl"></i>
              </div>
              <h3 className="font-semibold mb-2">Compliance</h3>
              <p className="text-sm text-blue-100">Labor law adherence</p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {loginType === 'employee' && 'Employee Login'}
                {loginType === 'manager' && 'Manager Portal'}
                {loginType === 'hr' && 'HR Admin Login'}
              </h2>
              <button
                onClick={handleModalClose}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            
            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start">
                  <i className="ri-error-warning-line text-red-500 text-lg mr-2 mt-0.5"></i>
                  <p className="text-red-700 text-sm">{errorMessage}</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Enter password"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-blue-600 hover:underline cursor-pointer">
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600 space-y-2">
                <p className="font-medium">Available Employee Accounts:</p>
                <div className="grid grid-cols-1 gap-1 text-xs">
                  <p><strong>Managers:</strong></p>
                  <p>• quincy.fevriere@ecats.com (System Admin)</p>
                  <p>• arade.moses@ecats.com (DevOps/Security)</p>
                  <p>• leon.frazer@ecats.com (Operations Lead)</p>
                  <p><strong>HR Manager:</strong></p>
                  <p>• dazurna.warner@ecats.com (HR Manager)</p>
                  <p><strong>Employees:</strong></p>
                  <p>• kimon.elizee@ecats.com (UI/UX Designer & QA)</p>
                  <p>• daniel.zuniga@ecats.com (Database Specialist)</p>
                  <p>• terrence.wells@ecats.com (Frontend Developer)</p>
                  <p>• humayra.amin@ecats.com (UI/UX Designer)</p>
                  <p>• ezla.stewart@ecats.com (QA Tester)</p>
                  <p>• tahura.tabasum@ecats.com (Backend Developer)</p>
                  <p className="text-gray-500 italic mt-2">Password: any password works for demo</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center mt-4">
                Need help? Contact HR Support: 
                <a href="tel:+1-555-ELITE-HR" className="text-blue-600 hover:underline ml-1 cursor-pointer">
                  +1-555-ELITE-HR
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
