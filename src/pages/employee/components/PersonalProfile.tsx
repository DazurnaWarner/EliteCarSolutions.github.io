import { useState, useEffect } from 'react';

interface PersonalProfileProps {
  currentUser?: any;
}

export default function PersonalProfile({ currentUser }: PersonalProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: ''
  });

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    setLoading(true);
    try {
      // Get current user from localStorage
      const userData = localStorage.getItem('currentUser');
      let loggedInUser = null;
      
      if (userData) {
        loggedInUser = JSON.parse(userData);
        console.log('Logged in user data:', loggedInUser);
      }

      if (!loggedInUser?.id) {
        console.error('No logged-in user found');
        setLoading(false);
        return;
      }

      const response = await fetch('https://sxspdcofjldpexpzbugr.supabase.co/functions/v1/employee-auth', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ 
          action: 'get_current_employee',
          employee_id: loggedInUser.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.employee) {
          // Merge server data with logged-in user data to ensure we have complete information
          const completeEmployeeData = {
            ...data.employee,
            // Use logged-in user data for names if available
            first_name: loggedInUser?.firstName || loggedInUser?.first_name || data.employee.first_name,
            last_name: loggedInUser?.lastName || loggedInUser?.last_name || data.employee.last_name,
            email: loggedInUser?.email || data.employee.email
          };
          
          console.log('Complete employee data:', completeEmployeeData);
          
          setEmployeeData(completeEmployeeData);
          setFormData({
            phone: completeEmployeeData.phone || '',
            email: completeEmployeeData.email || '',
            address: completeEmployeeData.address || '',
            city: completeEmployeeData.city || '',
            state: completeEmployeeData.state || '',
            zip_code: completeEmployeeData.zip_code || '',
            emergency_contact_name: completeEmployeeData.emergency_contact_name || '',
            emergency_contact_phone: completeEmployeeData.emergency_contact_phone || '',
            emergency_contact_relationship: completeEmployeeData.emergency_contact_relationship || ''
          });
        } else {
          console.log('API response indicates failure, using fallback data');
          // Fallback to using localStorage data
          if (loggedInUser) {
            const fallbackData = {
              id: loggedInUser.id,
              first_name: loggedInUser.firstName || loggedInUser.first_name || '',
              last_name: loggedInUser.lastName || loggedInUser.last_name || '',
              email: loggedInUser.email || '',
              employee_id: loggedInUser.id,
              department: loggedInUser.department || '',
              position: loggedInUser.position || '',
              hire_date: loggedInUser.hireDate || '',
              employment_status: 'Active',
              salary: loggedInUser.salary || ''
            };
            setEmployeeData(fallbackData);
            setFormData({
              phone: '',
              email: fallbackData.email,
              address: '',
              city: '',
              state: '',
              zip_code: '',
              emergency_contact_name: '',
              emergency_contact_phone: '',
              emergency_contact_relationship: ''
            });
          }
        }
      } else {
        console.log('HTTP response not ok, using fallback data');
        // Fallback to using localStorage data
        if (loggedInUser) {
          const fallbackData = {
            id: loggedInUser.id,
            first_name: loggedInUser.firstName || loggedInUser.first_name || '',
            last_name: loggedInUser.lastName || loggedInUser.last_name || '',
            email: loggedInUser.email || '',
            employee_id: loggedInUser.id,
            department: loggedInUser.department || '',
            position: loggedInUser.position || '',
            hire_date: loggedInUser.hireDate || '',
            employment_status: 'Active',
            salary: loggedInUser.salary || ''
          };
          setEmployeeData(fallbackData);
          setFormData({
            phone: '',
            email: fallbackData.email,
            address: '',
            city: '',
            state: '',
            zip_code: '',
            emergency_contact_name: '',
            emergency_contact_phone: '',
            emergency_contact_relationship: ''
          });
        }
      }
    } catch (error) {
      console.log('Caught error, using fallback data:', error);
      // Fallback to using localStorage data
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        const loggedInUser = JSON.parse(userData);
        const fallbackData = {
          id: loggedInUser.id,
          first_name: loggedInUser.firstName || loggedInUser.first_name || '',
          last_name: loggedInUser.lastName || loggedInUser.last_name || '',
          email: loggedInUser.email || '',
          employee_id: loggedInUser.id,
          department: loggedInUser.department || '',
          position: loggedInUser.position || '',
          hire_date: loggedInUser.hireDate || '',
          employment_status: 'Active',
          salary: loggedInUser.salary || ''
        };
        setEmployeeData(fallbackData);
        setFormData({
          phone: '',
          email: fallbackData.email,
          address: '',
          city: '',
          state: '',
          zip_code: '',
          emergency_contact_name: '',
          emergency_contact_phone: '',
          emergency_contact_relationship: ''
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!employeeData) return;
    
    setLoading(true);
    try {
      const response = await fetch('https://sxspdcofjldpexpzbugr.supabase.co/functions/v1/employee-auth', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ 
          action: 'update_employee_profile',
          employee_id: employeeData.id,
          ...formData
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsEditing(false);
          await fetchEmployeeData();
          alert('Profile updated successfully!');
        } else {
          alert(`Error: ${data.message}`);
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (employeeData) {
      setFormData({
        phone: employeeData.phone || '',
        email: employeeData.email || '',
        address: employeeData.address || '',
        city: employeeData.city || '',
        state: employeeData.state || '',
        zip_code: employeeData.zip_code || '',
        emergency_contact_name: employeeData.emergency_contact_name || '',
        emergency_contact_phone: employeeData.emergency_contact_phone || '',
        emergency_contact_relationship: employeeData.emergency_contact_relationship || ''
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <i className="ri-loader-line animate-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!employeeData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <i className="ri-error-warning-line text-4xl text-red-600 mb-4"></i>
          <p className="text-gray-600">Unable to load employee profile</p>
          <button 
            onClick={fetchEmployeeData}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-edit-line mr-2"></i>
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer disabled:bg-gray-400"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              value={employeeData.first_name || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              value={employeeData.last_name || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
                isEditing ? 'bg-white' : 'bg-gray-50 text-gray-500'
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
                isEditing ? 'bg-white' : 'bg-gray-50 text-gray-500'
              }`}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
                isEditing ? 'bg-white' : 'bg-gray-50 text-gray-500'
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
                isEditing ? 'bg-white' : 'bg-gray-50 text-gray-500'
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
                isEditing ? 'bg-white' : 'bg-gray-50 text-gray-500'
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
            <input
              type="text"
              value={formData.zip_code}
              onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
                isEditing ? 'bg-white' : 'bg-gray-50 text-gray-500'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Employment Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Employment Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
            <input
              type="text"
              value={employeeData.employee_id || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <input
              type="text"
              value={employeeData.department || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
            <input
              type="text"
              value={employeeData.position || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hire Date</label>
            <input
              type="text"
              value={employeeData.hire_date ? new Date(employeeData.hire_date).toLocaleDateString() : ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employment Status</label>
            <input
              type="text"
              value={employeeData.employment_status || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
            <input
              type="text"
              value={employeeData.salary ? `$${Number(employeeData.salary).toLocaleString()}` : 'Not Available'}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Emergency Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
            <input
              type="text"
              value={formData.emergency_contact_name}
              onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
                isEditing ? 'bg-white' : 'bg-gray-50 text-gray-500'
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
            <input
              type="tel"
              value={formData.emergency_contact_phone}
              onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
                isEditing ? 'bg-white' : 'bg-gray-50 text-gray-500'
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
            <input
              type="text"
              value={formData.emergency_contact_relationship}
              onChange={(e) => setFormData({ ...formData, emergency_contact_relationship: e.target.value })}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
                isEditing ? 'bg-white' : 'bg-gray-50 text-gray-500'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Benefits</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <i className="ri-heart-pulse-line text-2xl text-blue-600"></i>
              <div>
                <p className="font-medium text-gray-900">Health Insurance</p>
                <p className="text-sm text-gray-600">{employeeData.health_insurance || 'Premium Plan'}</p>
              </div>
            </div>
            <span className="text-sm font-medium text-blue-600">Active</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <i className="ri-shield-check-line text-2xl text-green-600"></i>
              <div>
                <p className="font-medium text-gray-900">Dental Insurance</p>
                <p className="text-sm text-gray-600">{employeeData.dental_insurance || 'Standard Plan'}</p>
              </div>
            </div>
            <span className="text-sm font-medium text-green-600">Active</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <i className="ri-eye-line text-2xl text-purple-600"></i>
              <div>
                <p className="font-medium text-gray-900">Vision Insurance</p>
                <p className="text-sm text-gray-600">{employeeData.vision_insurance || 'Basic Plan'}</p>
              </div>
            </div>
            <span className="text-sm font-medium text-purple-600">Active</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <i className="ri-funds-line text-2xl text-orange-600"></i>
              <div>
                <p className="font-medium text-gray-900">401(k) Plan</p>
                <p className="text-sm text-gray-600">Contribution: {employeeData.retirement_contribution || '5'}%</p>
              </div>
            </div>
            <span className="text-sm font-medium text-orange-600">Active</span>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Documents</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center space-x-3">
              <i className="ri-file-text-line text-xl text-gray-600"></i>
              <div>
                <p className="font-medium text-gray-900">Employment Contract</p>
                <p className="text-sm text-gray-500">PDF • 245 KB</p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700">
              <i className="ri-download-line text-xl"></i>
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center space-x-3">
              <i className="ri-file-text-line text-xl text-gray-600"></i>
              <div>
                <p className="font-medium text-gray-900">Tax Forms (W-4)</p>
                <p className="text-sm text-gray-500">PDF • 180 KB</p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700">
              <i className="ri-download-line text-xl"></i>
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center space-x-3">
              <i className="ri-file-text-line text-xl text-gray-600"></i>
              <div>
                <p className="font-medium text-gray-900">Benefits Enrollment</p>
                <p className="text-sm text-gray-500">PDF • 320 KB</p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700">
              <i className="ri-download-line text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
