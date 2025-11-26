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

    const { action, ...params } = await req.json()

    switch (action) {
      case 'get_users':
        const { data: users, error: usersError } = await supabaseClient
          .from('user_accounts')
          .select('*')
          .order('created_at', { ascending: false })

        if (usersError) throw usersError

        return new Response(
          JSON.stringify({ success: true, users }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'create_user':
        const { username, email, password, first_name, last_name, role, department, position } = params

        // Create user account
        const { data: newUser, error: createError } = await supabaseClient
          .from('user_accounts')
          .insert({
            username,
            email,
            password_hash: password, // In production, this should be properly hashed
            first_name,
            last_name,
            role,
            department,
            position,
            is_active: true
          })
          .select()
          .single()

        if (createError) throw createError

        // Log audit entry
        await supabaseClient
          .from('audit_logs')
          .insert({
            user_id: newUser.id,
            action: 'create_user',
            module: 'user_management',
            details: `Created user: ${username}`,
            ip_address: req.headers.get('x-forwarded-for') || 'unknown'
          })

        return new Response(
          JSON.stringify({ success: true, user: newUser }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'update_user':
        const { user_id, updates } = params

        const { data: updatedUser, error: updateError } = await supabaseClient
          .from('user_accounts')
          .update(updates)
          .eq('id', user_id)
          .select()
          .single()

        if (updateError) throw updateError

        // Log audit entry
        await supabaseClient
          .from('audit_logs')
          .insert({
            user_id: user_id,
            action: 'update_user',
            module: 'user_management',
            details: `Updated user: ${updatedUser.username}`,
            ip_address: req.headers.get('x-forwarded-for') || 'unknown'
          })

        return new Response(
          JSON.stringify({ success: true, user: updatedUser }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'reset_password':
        const { user_id: resetUserId, new_password } = params

        const { data: resetUser, error: resetError } = await supabaseClient
          .from('user_accounts')
          .update({ password_hash: new_password })
          .eq('id', resetUserId)
          .select('username')
          .single()

        if (resetError) throw resetError

        // Log audit entry
        await supabaseClient
          .from('audit_logs')
          .insert({
            user_id: resetUserId,
            action: 'reset_password',
            module: 'user_management',
            details: `Password reset for user: ${resetUser.username}`,
            ip_address: req.headers.get('x-forwarded-for') || 'unknown'
          })

        return new Response(
          JSON.stringify({ success: true, message: 'Password reset successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'getAuditLogs':
        const { data: logs, error: logsError } = await supabaseClient
          .from('audit_logs')
          .select(`
            *,
            user_accounts (
              username,
              first_name,
              last_name
            )
          `)
          .order('created_at', { ascending: false })
          .limit(100)

        if (logsError) throw logsError

        return new Response(
          JSON.stringify({ success: true, logs }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'get_system_alerts':
        const { data: alerts, error: alertsError } = await supabaseClient
          .from('system_alerts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20)

        if (alertsError) throw alertsError

        return new Response(
          JSON.stringify({ success: true, alerts }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'mark_alert_read':
        const { alert_id } = params

        const { error: markReadError } = await supabaseClient
          .from('system_alerts')
          .update({ is_read: true })
          .eq('id', alert_id)

        if (markReadError) throw markReadError

        return new Response(
          JSON.stringify({ success: true, message: 'Alert marked as read' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      default:
        return new Response(
          JSON.stringify({ success: false, message: 'Invalid action' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})