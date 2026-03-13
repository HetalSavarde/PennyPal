"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getToken } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { ExpenseOverview } from "@/components/expense-overview"
import { RecentTransactions } from "@/components/recent-transactions"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    const token = getToken()

    if (!token) {
      // ⛔ Redirect if token is missing
      router.replace("/login")
    } else {
      // ✅ Stay on dashboard if token exists
      setIsAuthenticated(true)
    }

    // ✅ Always stop loading after check completes
    setIsCheckingAuth(false)
  }, [router])

  // 🌀 While checking token, show loader (prevents flicker)
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // 🚫 If not authenticated, render nothing (redirect will already happen)
  if (!isAuthenticated) return null

  // ✅ Main dashboard content
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <DashboardNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back! Here's your financial overview.</p>
        </div>

        <div className="space-y-8">
          <ExpenseOverview />

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <RecentTransactions />
            </div>

            <div className="space-y-4">
              <Link href="/dashboard/transactions" className="block">
                <Button className="w-full">Add Transaction</Button>
              </Link>
              <Link href="/dashboard/bills" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  View Bill Splits
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
