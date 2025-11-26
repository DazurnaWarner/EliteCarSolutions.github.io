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
    console.log('Request body:', requestBody)

    const { action } = requestBody

    switch (action) {
      case 'create_request': {
        try {
          const { employee_id, leave_type, start_date, end_date, reason, total_days } = requestBody

          // Get employee name from user_accounts
          const { data: userData } = await supabaseClient
            .from('user_accounts')
            .select('first_name, last_name, full_name, username, email')
            .eq('id', employee_id)
            .single()

          let firstName = 'Unknown'
          let lastName = 'Employee'

          if (userData) {
            if (userData.first_name && userData.last_name) {
              firstName = userData.first_name
              lastName = userData.last_name
            } else if (userData.full_name) {
              const nameParts = userData.full_name.split(' ')
              firstName = nameParts[0] || 'Unknown'
              lastName = nameParts.slice(1).join(' ') || 'Employee'
            } else if (userData.username) {
              const nameParts = userData.username.replace(/[._-]/g, ' ').split(' ')
              firstName = nameParts[0]?.charAt(0).toUpperCase() + nameParts[0]?.slice(1) || 'Unknown'
              lastName = nameParts.slice(1).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ') || 'Employee'
            } else if (userData.email) {
              const emailParts = userData.email.split('@')[0].replace(/[._-]/g, ' ').split(' ')
              firstName = emailParts[0]?.charAt(0).toUpperCase() + emailParts[0]?.slice(1) || 'Unknown'
              lastName = emailParts.slice(1).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ') || 'Employee'
            }
          }

          const { data, error } = await supabaseClient
            .from('leave_requests')
            .insert({
              employee_id,
              leave_type,
              start_date,
              end_date,
              reason,
              days_requested: total_days,
              total_days: total_days,
              status: 'pending',
              first_name: firstName,
              last_name: lastName,
              submitted_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()

          if (error) {
            console.error('Error submitting leave request:', error)
            return new Response(
              JSON.stringify({ success: false, message: error.message }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          return new Response(
            JSON.stringify({ success: true, data }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } catch (error) {
          console.error('Error in create_request:', error)
          return new Response(
            JSON.stringify({ success: false, message: `Submit error: ${error.message}` }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }

      case 'approve_request': {
        try {
          const { request_id } = requestBody
          console.log('Approving request:', request_id)

          if (!request_id) {
            return new Response(
              JSON.stringify({ success: false, message: 'Request ID is required' }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          const { data, error } = await supabaseClient
            .from('leave_requests')
            .update({
              status: 'approved',
              updated_at: new Date().toISOString()
            })
            .eq('id', request_id)
            .select()

          if (error) {
            console.error('Database error approving request:', error)
            return new Response(
              JSON.stringify({ success: false, message: `Database error: ${error.message}` }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          console.log('Successfully approved request:', data)
          return new Response(
            JSON.stringify({ success: true, data }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } catch (error) {
          console.error('Error in approve_request:', error)
          return new Response(
            JSON.stringify({ success: false, message: `Approve error: ${error.message}` }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }

      case 'deny_request': {
        try {
          const { request_id } = requestBody
          console.log('Denying request:', request_id)

          if (!request_id) {
            return new Response(
              JSON.stringify({ success: false, message: 'Request ID is required' }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          const { data, error } = await supabaseClient
            .from('leave_requests')
            .update({
              status: 'denied',
              updated_at: new Date().toISOString()
            })
            .eq('id', request_id)
            .select()

          if (error) {
            console.error('Database error denying request:', error)
            return new Response(
              JSON.stringify({ success: false, message: `Database error: ${error.message}` }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          console.log('Successfully denied request:', data)
          return new Response(
            JSON.stringify({ success: true, data }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } catch (error) {
          console.error('Error in deny_request:', error)
          return new Response(
            JSON.stringify({ success: false, message: `Deny error: ${error.message}` }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }

      case 'get_requests': {
        try {
          const { employee_id } = requestBody

          const { data, error } = await supabaseClient
            .from('leave_requests')
            .select('*')
            .eq('employee_id', employee_id)
            .order('created_at', { ascending: false })

          if (error) {
            console.error('Error fetching employee requests:', error)
            return new Response(
              JSON.stringify({ success: false, message: error.message }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          return new Response(
            JSON.stringify({ success: true, requests: data }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } catch (error) {
          console.error('Error in get_requests:', error)
          return new Response(
            JSON.stringify({ success: false, message: `Fetch error: ${error.message}` }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }

      default:
        console.log('Invalid action received:', action)
        return new Response(
          JSON.stringify({ success: false, message: `Invalid action: ${action}` }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ success: false, message: `Internal server error: ${error.message}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})