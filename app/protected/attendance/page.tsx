'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

interface Employee {
  id: string
  employee_id: string
  full_name: string
  email: string
  department: string
}

interface AttendanceRecord {
  id: string
  employee_id: string
  date: string
  status: string
}

export default function AttendancePage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filterEmployeeId, setFilterEmployeeId] = useState<string>('')
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')
  const [markLoading, setMarkLoading] = useState(false)
  const [presentDaysSummary, setPresentDaysSummary] = useState<{ employee_id: string; present_days: number }[]>([])
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [markForm, setMarkForm] = useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
  })

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/employees')
      if (!res.ok) return
      const data = await res.json()
      setEmployees(data)
    } catch {
      toast.error('Failed to load employees')
    }
  }

  const fetchAttendance = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterEmployeeId) params.set('employee_id', filterEmployeeId)
      if (dateFrom) params.set('date_from', dateFrom)
      if (dateTo) params.set('date_to', dateTo)
      const url = `/api/attendance${params.toString() ? `?${params}` : ''}`
      const res = await fetch(url)
      if (!res.ok) {
        toast.error('Failed to load attendance')
        return
      }
      const data = await res.json()
      setAttendance(data)
    } catch {
      toast.error('Failed to load attendance')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchSummary = async () => {
    try {
      const res = await fetch('/api/attendance/summary')
      if (res.ok) {
        const data = await res.json()
        setPresentDaysSummary(data)
      }
    } catch {
      // ignore
    } finally {
      setSummaryLoading(false)
    }
  }

  useEffect(() => {
    fetchAttendance()
  }, [filterEmployeeId, dateFrom, dateTo])

  useEffect(() => {
    fetchSummary()
  }, [])

  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!markForm.employee_id) {
      toast.error('Select an employee')
      return
    }
    setMarkLoading(true)
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id: markForm.employee_id,
          date: markForm.date,
          status: markForm.status,
        }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        toast.error(data.error || 'Failed to mark attendance')
        return
      }
      toast.success('Attendance marked')
      setMarkForm((prev) => ({ ...prev, date: new Date().toISOString().split('T')[0], status: 'present' }))
      fetchAttendance()
      fetchSummary()
    } catch {
      toast.error('Failed to mark attendance')
    } finally {
      setMarkLoading(false)
    }
  }

  const employeeMap = new Map(employees.map((e) => [e.id, e]))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
        <p className="text-gray-600 mt-2">Track daily attendance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mark Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleMarkAttendance} className="flex flex-wrap items-end gap-4">
            <div className="space-y-2 min-w-[200px]">
              <Label>Employee</Label>
              <Select
                value={markForm.employee_id}
                onValueChange={(v) => setMarkForm({ ...markForm, employee_id: v })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.employee_id} – {emp.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={markForm.date}
                onChange={(e) => setMarkForm({ ...markForm, date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2 min-w-[140px]">
              <Label>Status</Label>
              <Select
                value={markForm.status}
                onValueChange={(v) => setMarkForm({ ...markForm, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={markLoading}>
              {markLoading ? 'Saving...' : 'Mark Attendance'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CardTitle>Attendance Records</CardTitle>
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex items-center gap-2">
                <Label className="text-sm text-muted-foreground whitespace-nowrap">Employee</Label>
                <Select
                  value={filterEmployeeId || 'all'}
                  onValueChange={(v) => setFilterEmployeeId(v === 'all' ? '' : v)}
                >
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="All employees" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All employees</SelectItem>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.employee_id} – {emp.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm text-muted-foreground whitespace-nowrap">From date</Label>
                <Input
                  type="date"
                  className="w-[140px]"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm text-muted-foreground whitespace-nowrap">To date</Label>
                <Input
                  type="date"
                  className="w-[140px]"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : attendance.length === 0 ? (
            <p className="text-center text-gray-600 py-8">
              No attendance records found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.map((record) => {
                  const emp = employeeMap.get(record.employee_id)
                  return (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {emp ? `${emp.employee_id} – ${emp.full_name}` : record.employee_id}
                      </TableCell>
                      <TableCell>
                        {new Date(record.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            record.status === 'present'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {record.status === 'present' ? 'Present' : 'Absent'}
                        </span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Present Days per Employee</CardTitle>
        </CardHeader>
        <CardContent>
          {summaryLoading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : presentDaysSummary.length === 0 ? (
            <p className="text-center text-gray-600 py-6">No attendance data yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Present days</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {presentDaysSummary.map(({ employee_id, present_days }) => {
                  const emp = employeeMap.get(employee_id)
                  return (
                    <TableRow key={employee_id}>
                      <TableCell className="font-medium">
                        {emp ? `${emp.employee_id} – ${emp.full_name}` : employee_id}
                      </TableCell>
                      <TableCell>{present_days}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
