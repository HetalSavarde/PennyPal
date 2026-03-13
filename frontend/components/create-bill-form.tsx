"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { billAPI } from "@/lib/api"

interface CreateBillFormProps {
  groupId: number
  isOwner: boolean
  onSuccess?: () => void
}

export function CreateBillForm({ groupId, isOwner, onSuccess }: CreateBillFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await billAPI.createBill(groupId, formData.description, Number.parseFloat(formData.amount))
      setFormData({ description: "", amount: "" })
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create bill")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOwner) {
    return (
      <Card className="border-border bg-muted/30">
        <CardHeader>
          <CardTitle>Create Bill</CardTitle>
          <CardDescription>Only group owners can create bills</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You are not the owner of this group, so you cannot create bills.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Create Bill</CardTitle>
        <CardDescription>Add a new bill to this group</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>}

          <div>
            <Label htmlFor="description">Bill Description</Label>
            <Input
              id="description"
              name="description"
              placeholder="e.g., Dinner at restaurant"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Creating..." : "Create Bill"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
