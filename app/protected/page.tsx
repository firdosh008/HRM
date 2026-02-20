'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Calendar } from 'lucide-react'

export default function DashboardPage() {
  const [totalEmployees, setTotalEmployees] = useState<number>(0)
  const [presentToday, setPresentToday] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [empRes, attRes] = await Promise.all([
          fetch('/api/employees'),
          fetch('/api/attendance'),
        ])
        const employees = empRes.ok ? await empRes.json() : []
        const attendance = attRes.ok ? await attRes.json() : []
        const today = new Date().toISOString().split('T')[0]
        const todayCount = attendance.filter((a: { date: string }) => a.date === today && a.status === 'present').length

        setTotalEmployees(Array.isArray(employees) ? employees.length : 0)
        setPresentToday(todayCount)
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
    </div>
  )
}
