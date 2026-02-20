import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">HRMS Lite</h1>
            <p className="text-gray-600 mt-2">Human Resource Management System</p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Account Created</CardTitle>
              <CardDescription>
                Please check your email to confirm your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <p className="text-sm text-blue-900">
                    We&apos;ve sent a confirmation email to your inbox. Click the link in the email to verify your account and get started.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-gray-600 text-center">
                    Didn&apos;t receive the email? Check your spam folder or{' '}
                    <button className="text-indigo-600 underline hover:text-indigo-700">
                      resend confirmation
                    </button>
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/auth/login">Return to Login</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
