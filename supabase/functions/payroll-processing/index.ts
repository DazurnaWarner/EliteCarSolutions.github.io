import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, ...params } = await req.json()
    console.log('Payroll Processing - Action:', action, 'Params:', params)

    switch (action) {
      case 'get_payroll_overview':
        try {
          const { period, department } = params;
          
          console.log('Fetching payroll overview for period:', period, 'department:', department);

          // Get all employees
          let employeeQuery = supabase
            .from('employees')
            .select(`
              id,
              first_name,
              last_name,
              email,
              department,
              position,
              role,
              salary
            `);

          if (department) {
            employeeQuery = employeeQuery.eq('department', department);
          }

          const { data: employees, error: empError } = await employeeQuery;
          
          if (empError) {
            console.error('Error fetching employees:', empError);
            throw empError;
          }

          console.log('Found employees for payroll:', employees?.length);

          // Get existing payroll records
          const { data: existingPayroll, error: payrollError } = await supabase
            .from('payroll')
            .select('*')
            .order('pay_period_start', { ascending: false });

          if (payrollError) {
            console.error('Error fetching payroll:', payrollError);
          }

          console.log('Found existing payroll records:', existingPayroll?.length);

          // If no payroll records exist, create sample data
          let payrollRecords = existingPayroll || [];
          
          if (!payrollRecords || payrollRecords.length === 0) {
            console.log('No payroll records found, creating sample data...');
            
            // Create sample payroll records for each employee
            const samplePayrollData = employees?.map(employee => {
              const baseSalary = employee.salary || 50000;
              const monthlyBaseSalary = baseSalary / 12;
              const overtimeHours = Math.floor(Math.random() * 10);
              const overtimeRate = (baseSalary / 12 / 160) * 1.5; // 1.5x hourly rate
              const overtimePay = overtimeHours * overtimeRate;
              const grossPay = monthlyBaseSalary + overtimePay;
              const taxRate = 0.22; // 22% tax rate
              const benefitsDeduction = 150;
              const totalDeductions = (grossPay * taxRate) + benefitsDeduction;
              const netPay = grossPay - totalDeductions;

              const payPeriodStart = new Date();
              payPeriodStart.setDate(1); // First day of current month
              const payPeriodEnd = new Date(payPeriodStart);
              payPeriodEnd.setMonth(payPeriodEnd.getMonth() + 1);
              payPeriodEnd.setDate(0); // Last day of current month

              return {
                employee_id: employee.id,
                pay_period_start: payPeriodStart.toISOString().split('T')[0],
                pay_period_end: payPeriodEnd.toISOString().split('T')[0],
                base_salary: Math.round(monthlyBaseSalary),
                overtime_hours: overtimeHours,
                overtime_pay: Math.round(overtimePay),
                deductions: Math.round(totalDeductions),
                gross_pay: Math.round(grossPay),
                net_pay: Math.round(netPay),
                status: Math.random() > 0.3 ? 'processed' : 'pending',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              };
            }) || [];

            // Insert sample payroll data
            if (samplePayrollData.length > 0) {
              const { data: insertedPayroll, error: insertError } = await supabase
                .from('payroll')
                .insert(samplePayrollData)
                .select('*');

              if (insertError) {
                console.error('Error inserting sample payroll:', insertError);
              } else {
                console.log('Created sample payroll records:', insertedPayroll?.length);
                payrollRecords = insertedPayroll || [];
              }
            }
          }

          // Combine payroll records with employee information
          const records = payrollRecords?.map(payroll => {
            const employee = employees?.find(emp => emp.id === payroll.employee_id);
            return {
              ...payroll,
              employee_name: employee ? `${employee.first_name} ${employee.last_name}` : 'Unknown Employee',
              department: employee?.department || 'Unknown',
              position: employee?.position || 'Unknown'
            };
          }) || [];

          // Calculate summary
          const summary = {
            total_employees: records.length,
            total_gross_pay: records.reduce((sum, r) => sum + (r.gross_pay || 0), 0),
            total_net_pay: records.reduce((sum, r) => sum + (r.net_pay || 0), 0),
            total_deductions: records.reduce((sum, r) => sum + (r.deductions || 0), 0),
            pending_payments: records.filter(r => r.status === 'pending').length
          };

          console.log('Payroll summary:', summary);

          return new Response(JSON.stringify({
            success: true,
            records: records,
            summary: summary
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } catch (error) {
          console.error('Error fetching payroll overview:', error);
          return new Response(JSON.stringify({
            success: false,
            message: 'Failed to fetch payroll overview',
            error: error.message
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

      case 'generate_paystub':
        try {
          const { employee_id, pay_period } = params;
          
          console.log('Generating paystub for employee:', employee_id, 'period:', pay_period);

          // Get employee information
          const { data: employee, error: empError } = await supabase
            .from('employees')
            .select('*')
            .eq('id', employee_id)
            .single();

          if (empError) throw empError;

          // Get or create payroll record
          let { data: payroll, error: payrollError } = await supabase
            .from('payroll')
            .select('*')
            .eq('employee_id', employee_id)
            .eq('pay_period_start', pay_period)
            .single();

          if (payrollError && payrollError.code !== 'PGRST116') {
            throw payrollError;
          }

          // If no payroll record exists, create one
          if (!payroll) {
            const baseSalary = employee.salary || 50000;
            const monthlyBaseSalary = baseSalary / 12;
            const overtimeHours = 0;
            const overtimePay = 0;
            const grossPay = monthlyBaseSalary + overtimePay;
            const taxRate = 0.22;
            const benefitsDeduction = 150;
            const totalDeductions = (grossPay * taxRate) + benefitsDeduction;
            const netPay = grossPay - totalDeductions;

            const payPeriodEnd = new Date(pay_period);
            payPeriodEnd.setMonth(payPeriodEnd.getMonth() + 1);
            payPeriodEnd.setDate(0);

            const newPayroll = {
              employee_id: employee_id,
              pay_period_start: pay_period,
              pay_period_end: payPeriodEnd.toISOString().split('T')[0],
              base_salary: Math.round(monthlyBaseSalary),
              overtime_hours: overtimeHours,
              overtime_pay: Math.round(overtimePay),
              deductions: Math.round(totalDeductions),
              gross_pay: Math.round(grossPay),
              net_pay: Math.round(netPay),
              status: 'processed'
            };

            const { data: insertedPayroll, error: insertError } = await supabase
              .from('payroll')
              .insert(newPayroll)
              .select('*')
              .single();

            if (insertError) throw insertError;
            payroll = insertedPayroll;
          }

          const paystub = {
            employee: {
              name: `${employee.first_name} ${employee.last_name}`,
              email: employee.email,
              department: employee.department,
              position: employee.position,
              employee_id: employee.id
            },
            pay_period: {
              start: payroll.pay_period_start,
              end: payroll.pay_period_end
            },
            earnings: {
              base_salary: payroll.base_salary,
              overtime_hours: payroll.overtime_hours,
              overtime_pay: payroll.overtime_pay,
              gross_pay: payroll.gross_pay
            },
            deductions: {
              federal_tax: Math.round(payroll.gross_pay * 0.12),
              state_tax: Math.round(payroll.gross_pay * 0.05),
              social_security: Math.round(payroll.gross_pay * 0.062),
              medicare: Math.round(payroll.gross_pay * 0.0145),
              health_insurance: 150,
              total_deductions: payroll.deductions
            },
            net_pay: payroll.net_pay,
            status: payroll.status
          };

          return new Response(JSON.stringify({
            success: true,
            paystub: paystub
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } catch (error) {
          console.error('Error generating paystub:', error);
          return new Response(JSON.stringify({
            success: false,
            message: 'Failed to generate paystub',
            error: error.message
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

      default:
        return new Response(JSON.stringify({
          success: false,
          message: 'Invalid action'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Payroll Processing Error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Internal server error',
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
})