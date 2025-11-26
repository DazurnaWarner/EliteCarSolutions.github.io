import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const requestBody = await req.json()
    const { action, email, password, employee_id } = requestBody
    
    console.log('Request action:', action)

    // Handle get_current_employee action
    if (action === 'get_current_employee') {
      // For demo purposes, we'll get the employee from localStorage or use a default
      // In a real app, you'd verify the JWT token and get the employee ID from it
      
      // Try to get employee data from the request or use a default employee
      let targetEmployeeId = employee_id
      
      if (!targetEmployeeId) {
        // For demo, get the first active employee
        const { data: firstEmployee } = await supabaseClient
          .from('employees')
          .select('id')
          .eq('status', 'active')
          .limit(1)
          .single()
        
        targetEmployeeId = firstEmployee?.id
      }

      if (!targetEmployeeId) {
        return new Response(
          JSON.stringify({ 
            success: false,
            message: 'No employee found' 
          }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const { data: employeeData, error: employeeError } = await supabaseClient
        .from('employees')
        .select('*')
        .eq('id', targetEmployeeId)
        .eq('status', 'active')
        .single()

      if (employeeError || !employeeData) {
        return new Response(
          JSON.stringify({ 
            success: false,
            message: 'Employee not found' 
          }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({
          success: true,
          employee: employeeData
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Handle update_employee_profile action
    if (action === 'update_employee_profile') {
      const { 
        phone, email: newEmail, address, city, state, zip_code,
        emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
      } = requestBody

      if (!employee_id) {
        return new Response(
          JSON.stringify({ 
            success: false,
            message: 'Employee ID is required' 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const { data: updatedEmployee, error: updateError } = await supabaseClient
        .from('employees')
        .update({
          phone,
          email: newEmail,
          address,
          city,
          state,
          zip_code,
          emergency_contact_name,
          emergency_contact_phone,
          emergency_contact_relationship,
          updated_at: new Date().toISOString()
        })
        .eq('id', employee_id)
        .select()
        .single()

      if (updateError) {
        console.error('Update error:', updateError)
        return new Response(
          JSON.stringify({ 
            success: false,
            message: 'Failed to update employee profile' 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({
          success: true,
          employee: updatedEmployee
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Handle login action (existing code)
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Clean the email
    const cleanEmail = email.trim().toLowerCase()
    console.log('Login attempt for email:', cleanEmail)

    // Find the employee
    const { data: employeeData, error: employeeError } = await supabaseClient
      .from('employees')
      .select('*')
      .eq('email', cleanEmail)
      .eq('status', 'active')
      .single()

    console.log('Employee query result:', { employeeData, employeeError })

    if (employeeError || !employeeData) {
      console.log('Employee not found, fetching all available emails...')
      
      // Get all available emails for debugging
      const { data: allEmployees } = await supabaseClient
        .from('employees')
        .select('email, first_name, last_name, role')
        .eq('status', 'active')
        .order('email')

      console.log('Available employees:', allEmployees)

      return new Response(
        JSON.stringify({ 
          error: 'Invalid email or password. Please check your credentials and try again.',
          debug: {
            attempted_email: cleanEmail,
            available_emails: allEmployees?.map(emp => `${emp.email} (${emp.first_name} ${emp.last_name} - ${emp.role})`) || []
          }
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // For demo purposes, accept any password
    // In production, you would verify the password here

    // Determine the role for navigation
    let userRole = employeeData.role
    if (employeeData.role === 'hr_admin') {
      userRole = 'hr_manager'
    }

    const response = {
      success: true,
      employee: {
        id: employeeData.id,
        email: employeeData.email,
        firstName: employeeData.first_name,
        lastName: employeeData.last_name,
        role: userRole,
        employeeRole: employeeData.role,
        department: employeeData.department,
        position: employeeData.position,
        hireDate: employeeData.hire_date,
        salary: employeeData.salary,
        address: employeeData.address,
        phone: employeeData.phone,
        emergencyContact: employeeData.emergency_contact_name
      }
    }

    console.log('Login successful for:', employeeData.email)

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Authentication error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Authentication failed. Please try again.',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})