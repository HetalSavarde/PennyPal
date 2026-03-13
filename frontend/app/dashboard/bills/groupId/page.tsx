"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { getToken, getCurrentUser } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { CreateBillForm } from "@/components/create-bill-form"
import { GroupBillsList } from "@/components/group-bills-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { billAPI, type GroupDetail, type Bill } from "@/lib/api"

export default function GroupDetailPage() {
  const router = useRouter()
  const params = useParams()
  const groupId = Number.parseInt(params.groupId as string)

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [group, setGroup] = useState<GroupDetail | null>(null)
  const [bills, setBills] = useState<Bill[]>([])
  const [isOwner, setIsOwner] = useState(false)
  const [currentUser, setCurrentUser] = useState<string>("")
  const [error, setError] = useState("")
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push("/login")
    } else {
      setIsAuthenticated(true)
      const user = getCurrentUser()
      setCurrentUser(user)
    }
  }, [router])

  useEffect(() => {
    if (!isAuthenticated) return

    const fetchGroupDetails = async () => {
      try {
        setIsLoading(true)
        const groupData = await billAPI.getGroupDetail(groupId)
        setGroup(groupData)
        setIsOwner(groupData.owner === currentUser)

        const billsData = await billAPI.getGroupBills(groupId)
        setBills(billsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load group details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchGroupDetails()
  }, [groupId, isAuthenticated, currentUser, refreshTrigger])

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

  if (!isAuthenticated || !group) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <DashboardNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/dashboard/bills">
              <Button variant="ghost" className="mb-4">
                ← Back to Groups
              </Button>
            </Link>
            <h2 className="text-3xl font-bold text-foreground mb-2">{group.name}</h2>
            <p className="text-muted-foreground">Owner: {group.owner}</p>
          </div>
        </div>

        {error && <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 mb-6">{error}</div>}

        {/* Group Members Card */}
        <Card className="border-border mb-8">
          <CardHeader>
            <CardTitle>Group Members</CardTitle>
            <CardDescription>Members in this group</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {group.members?.map((member) => (
                <span
                  key={member}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    member === group.owner ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {member} {member === group.owner && "(Owner)"}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <CreateBillForm
              groupId={groupId}
              isOwner={isOwner}
              onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
            />
          </div>

          <div>
            <GroupBillsList bills={bills} isLoading={false} />
          </div>
        </div>
      </main>
    </div>
  )
}
