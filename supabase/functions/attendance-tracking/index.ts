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
    console.log('Attendance tracking request:', requestBody)
    
    const { action, employee_id, timestamp, data } = requestBody

    switch (action) {
      case 'clock_in': {
        const now = new Date()
        const today = now.toISOString().split('T')[0]
        const currentTimestamp = now.toISOString()

        try {
          // Check if already checked in today
          const { data: existing, error: checkError } = await supabaseClient
            .from('attendance')
            .select('*')
            .eq('employee_id', employee_id)
            .eq('date', today)
            .single()

          if (existing && !checkError) {
            return new Response(
              JSON.stringify({ 
                success: false, 
                message: 'Already checked in today' 
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400
              }
            )
          }

          // Determine if late (after 9:00 AM)
          const hours = now.getHours()
          const minutes = now.getMinutes()
          const isLate = hours > 9 || (hours === 9 && minutes > 0)

          // Create new attendance record
          const { data: attendance, error } = await supabaseClient
            .from('attendance')
            .insert({
              employee_id: employee_id,
              date: today,
              check_in_time: currentTimestamp,
              status: isLate ? 'late' : 'present'
            })
            .select()
            .single()

          if (error) {
            console.error('Clock in error:', error)
            return new Response(
              JSON.stringify({ 
                success: false, 
                message: `Failed to clock in: ${error.message}` 
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500
              }
            )
          }

          return new Response(
            JSON.stringify({ 
              success: true, 
              message: 'Clocked in successfully',
              attendance 
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200
            }
          )

        } catch (error) {
          console.error('Clock in exception:', error)
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: `Error during clock-in: ${error.message}` 
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 500
            }
          )
        }
      }

      case 'clock_out': {
        const now = new Date()
        const today = now.toISOString().split('T')[0]
        const currentTimestamp = now.toISOString()

        try {
          // Find today's attendance record
          const { data: attendance, error: findError } = await supabaseClient
            .from('attendance')
            .select('*')
            .eq('employee_id', employee_id)
            .eq('date', today)
            .single()

          if (!attendance || findError) {
            return new Response(
              JSON.stringify({ 
                success: false, 
                message: 'No check-in record found for today' 
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400
              }
            )
          }

          if (attendance.check_out_time) {
            return new Response(
              JSON.stringify({ 
                success: false, 
                message: 'Already checked out today' 
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400
              }
            )
          }

          // Calculate total hours
          const checkInTime = new Date(attendance.check_in_time)
          const checkOutTime = new Date(currentTimestamp)
          const diffMs = checkOutTime.getTime() - checkInTime.getTime()
          const totalHours = (diffMs / (1000 * 60 * 60))

          // Update with check-out time
          const { data: updated, error } = await supabaseClient
            .from('attendance')
            .update({
              check_out_time: currentTimestamp,
              total_hours: parseFloat(totalHours.toFixed(2)),
              status: 'completed'
            })
            .eq('id', attendance.id)
            .select()
            .single()

          if (error) {
            console.error('Clock out error:', error)
            return new Response(
              JSON.stringify({ 
                success: false, 
                message: `Failed to clock out: ${error.message}` 
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500
              }
            )
          }

          return new Response(
            JSON.stringify({ 
              success: true, 
              message: 'Clocked out successfully',
              attendance: updated 
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200
            }
          )

        } catch (error) {
          console.error('Clock out exception:', error)
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: `Error during clock-out: ${error.message}` 
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 500
            }
          )
        }
      }

      case 'get_current_status': {
        const today = new Date().toISOString().split('T')[0]

        try {
          const { data: attendance, error } = await supabaseClient
            .from('attendance')
            .select('*')
            .eq('employee_id', employee_id)
            .eq('date', today)
            .single()

          if (error && error.code !== 'PGRST116') {
            console.error('Get status error:', error)
            return new Response(
              JSON.stringify({ 
                success: false, 
                message: `Failed to get status: ${error.message}` 
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500
              }
            )
          }

          return new Response(
            JSON.stringify({ 
              success: true, 
              attendance: attendance || null
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200
            }
          )

        } catch (error) {
          console.error('Get status exception:', error)
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: `Error getting status: ${error.message}` 
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 500
            }
          )
        }
      }

      case 'get_attendance_history': {
        try {
          const { data: attendanceHistory, error } = await supabaseClient
            .from('attendance')
            .select('*')
            .eq('employee_id', employee_id)
            .order('date', { ascending: false })
            .limit(30)

          if (error) {
            console.error('Get history error:', error)
            return new Response(
              JSON.stringify({ 
                success: false, 
                message: `Failed to get history: ${error.message}` 
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500
              }
            )
          }

          return new Response(
            JSON.stringify({ 
              success: true, 
              attendance: attendanceHistory || []
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200
            }
          )

        } catch (error) {
          console.error('Get history exception:', error)
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: `Error getting history: ${error.message}` 
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 500
            }
          )
        }
      }

      case 'get_weekly_stats': {
        try {
          // Get last 7 days of attendance
          const endDate = new Date()
          const startDate = new Date()
          startDate.setDate(endDate.getDate() - 7)

          const { data: weeklyAttendance, error } = await supabaseClient
            .from('attendance')
            .select('*')
            .eq('employee_id', employee_id)
            .gte('date', startDate.toISOString().split('T')[0])
            .lte('date', endDate.toISOString().split('T')[0])

          if (error) {
            console.error('Get weekly stats error:', error)
            return new Response(
              JSON.stringify({ 
                success: false, 
                message: `Failed to get weekly stats: ${error.message}` 
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500
              }
            )
          }

          // Calculate stats
          const records = weeklyAttendance || []
          const totalHours = records.reduce((sum, record) => sum + (record.total_hours || 0), 0)
          const regularHours = Math.min(totalHours, 40)
          const overtimeHours = Math.max(totalHours - 40, 0)
          const daysPresent = records.filter(r => r.status === 'present' || r.status === 'completed').length
          const daysLate = records.filter(r => r.status === 'late').length

          const stats = {
            totalHours: totalHours.toFixed(1),
            regularHours: regularHours.toFixed(1),
            overtimeHours: overtimeHours.toFixed(1),
            daysPresent: daysPresent.toString(),
            daysLate: daysLate.toString()
          }

          return new Response(
            JSON.stringify({ 
              success: true, 
              stats
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200
            }
          )

        } catch (error) {
          console.error('Get weekly stats exception:', error)
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: `Error getting weekly stats: ${error.message}` 
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 500
            }
          )
        }
      }

      case 'get_attendance_overview': {
        const { date = new Date().toISOString().split('T')[0], department } = data || {}
        
        try {
          // Get only team members (exclude admin/system accounts)
          let employeeQuery = supabaseClient
            .from('user_accounts')
            .select('id, username, email, full_name, department, role')
            .in('role', ['employee', 'manager', 'hr_manager'])
            .neq('username', 'admin')
            .neq('username', 'system')
            .neq('email', 'admin@company.com')
            .not('email', 'like', '%test%')
            .not('username', 'like', '%test%')

          if (department && department !== 'all') {
            employeeQuery = employeeQuery.eq('department', department)
          }

          const { data: employees, error: empError } = await employeeQuery

          if (empError) {
            console.error('Error fetching employees:', empError)
            return new Response(
              JSON.stringify({ 
                success: false, 
                message: `Failed to fetch employees: ${empError.message}`
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500
              }
            )
          }

          // Get attendance records for the specified date
          const { data: attendanceRecords, error: attError } = await supabaseClient
            .from('attendance')
            .select('*')
            .eq('date', date)

          if (attError) {
            console.error('Error fetching attendance:', attError)
          }

          // Process employee data with attendance
          const employeeData = employees?.map(emp => {
            // Generate display name
            let displayName = emp.full_name
            if (!displayName) {
              if (emp.username) {
                displayName = emp.username
                  .split('.')
                  .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                  .join(' ')
              } else if (emp.email) {
                const emailName = emp.email.split('@')[0]
                displayName = emailName
                  .split('.')
                  .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                  .join(' ')
              } else {
                displayName = 'Team Member'
              }
            }

            // Find attendance record for this employee
            const attendance = attendanceRecords?.find(att => att.employee_id === emp.id)
            
            let status = 'absent'
            let checkIn = null
            let checkOut = null
            let totalHours = '0.0'

            if (attendance) {
              if (attendance.check_out_time) {
                status = 'completed'
                checkIn = new Date(attendance.check_in_time).toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit',
                  hour12: true 
                })
                checkOut = new Date(attendance.check_out_time).toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit',
                  hour12: true 
                })
                totalHours = attendance.total_hours ? attendance.total_hours.toFixed(1) : '0.0'
              } else if (attendance.check_in_time) {
                status = attendance.status || 'present'
                checkIn = new Date(attendance.check_in_time).toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit',
                  hour12: true 
                })
              }
            }

            return {
              id: emp.id,
              name: displayName,
              department: emp.department || 'General',
              role: emp.role || 'employee',
              status,
              checkIn,
              checkOut,
              totalHours
            }
          }) || []

          // Calculate summary statistics
          const totalEmployees = employeeData.length
          const presentToday = employeeData.filter(emp => emp.status === 'present' || emp.status === 'completed' || emp.status === 'late').length
          const absentToday = employeeData.filter(emp => emp.status === 'absent').length
          const lateToday = employeeData.filter(emp => emp.status === 'late').length

          // Calculate average hours
          const completedEmployees = employeeData.filter(emp => emp.status === 'completed')
          const totalHoursWorked = completedEmployees.reduce((sum, emp) => sum + parseFloat(emp.totalHours), 0)
          const averageHours = completedEmployees.length > 0 ? (totalHoursWorked / completedEmployees.length).toFixed(1) : '0.0'

          const summary = {
            total_employees: totalEmployees,
            present_today: presentToday,
            absent_today: absentToday,
            late_today: lateToday,
            average_hours: averageHours
          }

          return new Response(
            JSON.stringify({ 
              success: true, 
              summary,
              employees: employeeData
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200
            }
          )

        } catch (error) {
          console.error('Error in get_attendance_overview:', error)
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: `Error fetching attendance overview: ${error.message}`
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 500
            }
          )
        }
      }

      default:
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Invalid action specified' 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          }
        )
    }

  } catch (error) {
    console.error('Request processing error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: `Request processing failed: ${error.message}`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})