"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { billAPI, type BillShare } from "@/lib/api"

interface BillSharesListProps {
  refreshTrigger?: number
  onSettleSuccess?: () => void
}

export function BillSharesList({ refreshTrigger, onSettleSuccess }: BillSharesListProps) {
  const [shares, setShares] = useState<BillShare[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [settlingId, setSettlingId] = useState<number | null>(null)

  useEffect(() => {
    const fetchShares = async () => {
      try {
        const data = await billAPI.getMyShares()
        setShares(data)
      } catch (err) {
        console.error("Failed to load shares:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchShares()
  }, [refreshTrigger])

  const handleSettle = async (shareId: number) => {
    setSettlingId(shareId)
    try {
      await billAPI.settleShare(shareId)
      setShares((prev) => prev.map((s) => (s.id === shareId ? { ...s, settled: true } : s)))
      onSettleSuccess?.()
    } catch (err) {
      console.error("Failed to settle share:", err)
    } finally {
      setSettlingId(null)
    }
  }

  if (isLoading) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Your Bill Shares</CardTitle>
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

  const unsettledShares = shares.filter((s) => !s.settled)
  const settledShares = shares.filter((s) => s.settled)

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Your Bill Shares</CardTitle>
        <CardDescription>Bills you owe or are owed</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {unsettledShares.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-3">Pending</h3>
              <div className="space-y-3">
                {unsettledShares.map((share) => (
                  <div key={share.id} className="p-4 border border-border rounded-lg bg-muted/30">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-foreground">{share.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {share.groupName ? `Group: ${share.groupName}` : `Created by: ${share.creator}`}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-red-600">₹{share.amount.toFixed(2)}</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleSettle(share.id)}
                      disabled={settlingId === share.id}
                      className="w-full"
                    >
                      {settlingId === share.id ? "Settling..." : "Mark as Settled"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {settledShares.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-3">Settled</h3>
              <div className="space-y-3">
                {settledShares.map((share) => (
                  <div key={share.id} className="p-4 border border-border rounded-lg opacity-60">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground line-through">{share.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {share.groupName ? `Group: ${share.groupName}` : `Created by: ${share.creator}`}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-green-600">₹{share.amount.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {shares.length === 0 && <p className="text-muted-foreground text-center py-8">No bill shares yet</p>}
        </div>
      </CardContent>
    </Card>
  )
}
