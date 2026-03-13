"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { billAPI, type UserGroup } from "@/lib/api"

interface GroupsListProps {
  refreshTrigger?: number
}

export function GroupsList({ refreshTrigger }: GroupsListProps) {
  const [groups, setGroups] = useState<UserGroup[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await billAPI.getGroups()
        setGroups(data)
      } catch (err) {
        console.error("Failed to load groups:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGroups()
  }, [refreshTrigger])

  if (isLoading) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Your Groups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Your Groups</CardTitle>
        <CardDescription>Groups you've created or joined</CardDescription>
      </CardHeader>
      <CardContent>
        {groups.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No groups yet. Create one to get started!</p>
        ) : (
          <div className="space-y-4">
            {groups.map((group) => (
              <div key={group.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{group.name}</h3>
                    <p className="text-xs text-muted-foreground">Owner: {group.owner}</p>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {group.members?.length || 0} members
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {group.members?.map((member) => (
                    <span key={member} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                      {member}
                    </span>
                  ))}
                </div>
                <Link href={`/dashboard/bills/${group.id}`}>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    View Group & Bills
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
