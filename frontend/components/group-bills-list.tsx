"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Bill } from "@/lib/api"

interface GroupBillsListProps {
  bills: Bill[]
  isLoading?: boolean
}

export function GroupBillsList({ bills, isLoading }: GroupBillsListProps) {
  if (isLoading) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Bills in this Group</CardTitle>
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
        <CardTitle>Bills in this Group</CardTitle>
        <CardDescription>All bills created for this group</CardDescription>
      </CardHeader>
      <CardContent>
        {bills.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No bills yet. Create one to get started!</p>
        ) : (
          <div className="space-y-3">
            {bills.map((bill) => (
              <div key={bill.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-foreground">{bill.description}</p>
                    <p className="text-xs text-muted-foreground">Created by: {bill.createdBy}</p>
                  </div>
                  <span className="text-lg font-bold text-emerald-600">₹{bill.amount.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground">{new Date(bill.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
