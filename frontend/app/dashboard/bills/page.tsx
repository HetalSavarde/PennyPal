"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getToken } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { CreateGroupForm } from "@/components/create-group-form"
import { GroupsList } from "@/components/groups-list"
import { BillSharesList } from "@/components/bill-shares-list"

export default function BillsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push("/login")
    } else {
      setIsAuthenticated(true)
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <DashboardNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Bill Splitting</h2>
          <p className="text-muted-foreground">Manage groups and settle bill splits</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <CreateGroupForm onSuccess={() => setRefreshTrigger((prev) => prev + 1)} />
            <GroupsList refreshTrigger={refreshTrigger} />
          </div>

          <div>
            <BillSharesList
              refreshTrigger={refreshTrigger}
              onSettleSuccess={() => setRefreshTrigger((prev) => prev + 1)}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
