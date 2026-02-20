'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Users, Calendar } from 'lucide-react'

interface Employee {
  id: string
  employee_id: string
  full_name: string
  email: string
  department: string
}

export default function DashboardPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [totalEmployees, setTotalEmployees] = useState<number>(0)
  const [presentToday, setPresentToday] = useState<number>(0)
  const [presentDaysSummary, setPresentDaysSummary] = useState<{ employee_id: string; present_days: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [empRes, attRes, summaryRes] = await Promise.all([
          fetch('/api/employees'),
          fetch('/api/attendance'),
          fetch('/api/attendance/summary'),
        ])
        const employeesData = empRes.ok ? await empRes.json() : []
        const attendance = attRes.ok ? await attRes.json() : []
        const today = new Date().toISOString().split('T')[0]
        const todayCount = attendance.filter((a: { date: string }) => a.date === today && a.status === 'present').length

        setEmployees(Array.isArray(employeesData) ? employeesData : [])
        setTotalEmployees(Array.isArray(employeesData) ? employeesData.length : 0)
        setPresentToday(todayCount)
        if (summaryRes.ok) {
          const summary = await summaryRes.json()
          setPresentDaysSummary(summary)
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    { title: 'Total Employees', value: totalEmployees, icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { title: 'Present Today', value: presentToday, icon: Calendar, color: 'text-green-600', bgColor: 'bg-green-50' },
  ]

  const employeeMap = new Map(employees.map((e) => [e.id, e]))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of employees and attendance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {loading ? '-' : stat.value}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Present Days per Employee</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-gray-600 py-4">Loading...</p>
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
