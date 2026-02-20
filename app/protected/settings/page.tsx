'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { LogOut, Save } from 'lucide-react'

interface UserSettings {
  email: string
  lastLogin: string
}

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [settings, setSettings] = useState<UserSettings>({
    email: '',
    lastLogin: '',
  })
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setSettings({
        email: user?.email || '',
        lastLogin: user?.last_sign_in_at
          ? new Date(user.last_sign_in_at).toLocaleString()
          : 'Never',
      })
    }

    getUser()
  }, [])

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        email: settings.email,
      })

      if (error) throw error
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const handleChangePassword = async () => {
    const newPassword = prompt('Enter new password:')
    if (!newPassword) return

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error
      alert('Password changed successfully!')
    } catch (error) {
      console.error('Error changing password:', error)
      alert('Failed to change password')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input
              type="email"
              value={settings.email}
              onChange={(e) =>
                setSettings({ ...settings, email: e.target.value })
              }
              placeholder="your@email.com"
            />
            <p className="text-xs text-gray-600">
              Your email address for account login
            </p>
          </div>

          <div className="space-y-2">
            <Label>Last Login</Label>
            <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              {settings.lastLogin}
            </div>
          </div>

          <Button onClick={handleSaveSettings} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Password</h3>
            <Button
              variant="outline"
              onClick={handleChangePassword}
              className="w-full md:w-auto"
            >
              Change Password
            </Button>
            <p className="text-xs text-gray-600 mt-2">
              We recommend using a strong, unique password
            </p>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
            <Button variant="outline" disabled className="w-full md:w-auto">
              Enable 2FA
            </Button>
            <p className="text-xs text-gray-600 mt-2">
              Coming soon: Add an extra layer of security
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">
                Receive email updates about leave approvals and attendance
              </p>
            </div>
            <input type="checkbox" defaultChecked className="h-5 w-5" />
          </div>

          <div className="border-t pt-6 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Dark Mode</p>
              <p className="text-sm text-gray-600">
                Use dark theme for the application
              </p>
            </div>
            <input type="checkbox" className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-900">Session</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-gray-700 mb-4">
              Sign out from this device and return to the login page.
            </p>
            <Button
              onClick={handleLogout}
              className="gap-2 bg-red-600 hover:bg-red-700"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
