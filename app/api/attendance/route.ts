import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get('employee_id')
    const dateFrom = searchParams.get('date_from')
    const dateTo = searchParams.get('date_to')

    const supabase = createAdminClient()
    let query = supabase
      .from('attendance')
      .select('id, employee_id, date, status')
      .order('date', { ascending: false })

    if (employeeId) {
      query = query.eq('employee_id', employeeId)
    }
    if (dateFrom) {
      query = query.gte('date', dateFrom)
    }
    if (dateTo) {
      query = query.lte('date', dateTo)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data || [])
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch attendance' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { employee_id, date, status } = body

    if (!employee_id) {
      return NextResponse.json(
        { error: 'Employee ID is required' },
        { status: 400 }
      )
    }
    if (!date) {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      )
    }
    const normalizedStatus = String(status).toLowerCase()
    if (normalizedStatus !== 'present' && normalizedStatus !== 'absent') {
      return NextResponse.json(
        { error: 'Status must be Present or Absent' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    const { data: emp } = await supabase
      .from('employees')
      .select('id')
      .eq('id', employee_id)
      .maybeSingle()

    if (!emp) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    const dateStr = new Date(date).toISOString().split('T')[0]

    const { data: existing } = await supabase
      .from('attendance')
      .select('id')
      .eq('employee_id', employee_id)
      .eq('date', dateStr)
      .maybeSingle()

    if (existing) {
      const { error: updateError } = await supabase
        .from('attendance')
        .update({ status: normalizedStatus })
        .eq('id', existing.id)

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        )
      }
      return NextResponse.json({ success: true, updated: true }, { status: 200 })
    }

    const { error: insertError } = await supabase
      .from('attendance')
      .insert({
        employee_id,
        date: dateStr,
        status: normalizedStatus,
      })

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
