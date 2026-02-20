import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('employees')
      .select('id, employee_id, first_name, last_name, email, department')
      .order('id', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    const employees = (data || []).map((row) => ({
      id: row.id,
      employee_id: row.employee_id,
      full_name: [row.first_name, row.last_name].filter(Boolean).join(' ').trim() || row.first_name,
      email: row.email,
      department: row.department,
    }))

    return NextResponse.json(employees)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { employee_id, full_name, email, department } = body

    if (!employee_id?.trim()) {
      return NextResponse.json(
        { error: 'Employee ID is required' },
        { status: 400 }
      )
    }
    if (!full_name?.trim()) {
      return NextResponse.json(
        { error: 'Full Name is required' },
        { status: 400 }
      )
    }
    if (!email?.trim()) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }
    if (!department?.trim()) {
      return NextResponse.json(
        { error: 'Department is required' },
        { status: 400 }
      )
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    const { data: existingById } = await supabase
      .from('employees')
      .select('id')
      .eq('employee_id', employee_id.trim())
      .maybeSingle()

    if (existingById) {
      return NextResponse.json(
        { error: 'An employee with this Employee ID already exists' },
        { status: 409 }
      )
    }

    const { data: existingByEmail } = await supabase
      .from('employees')
      .select('id')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle()

    if (existingByEmail) {
      return NextResponse.json(
        { error: 'An employee with this email already exists' },
        { status: 409 }
      )
    }

    const parts = full_name.trim().split(/\s+/)
    const first_name = parts[0] ?? ''
    const last_name = parts.slice(1).join(' ') ?? ''

    const { data: inserted, error } = await supabase
      .from('employees')
      .insert({
        employee_id: employee_id.trim(),
        first_name,
        last_name,
        email: email.trim().toLowerCase(),
        department: department.trim(),
      })
      .select('id, employee_id, first_name, last_name, email, department')
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Employee ID or email already exists' },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      id: inserted.id,
      employee_id: inserted.employee_id,
      full_name: [inserted.first_name, inserted.last_name].filter(Boolean).join(' ').trim() || inserted.first_name,
      email: inserted.email,
      department: inserted.department,
    }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
