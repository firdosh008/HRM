import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('attendance')
      .select('employee_id')
      .eq('status', 'present')

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    const countByEmployee: Record<string, number> = {}
    for (const row of data || []) {
      countByEmployee[row.employee_id] = (countByEmployee[row.employee_id] ?? 0) + 1
    }

    const summary = Object.entries(countByEmployee).map(([employee_id, present_days]) => ({
      employee_id,
      present_days,
    }))

    return NextResponse.json(summary)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch summary' },
      { status: 500 }
    )
  }
}
