"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { transactionAPI } from "@/lib/api"

interface AddTransactionFormProps {
  onSuccess?: () => void
}

export function AddTransactionForm({ onSuccess }: AddTransactionFormProps) {
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [type, setType] = useState<"income" | "expense">("expense")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError("")
  setSuccess(false)

  if (!amount || !category) {
    setError("Please fill in all fields")
    return
  }

  setIsLoading(true)

  try {
    const token = localStorage.getItem("token")

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ send JWT token to backend
      },
      body: JSON.stringify({
        amount: Number.parseFloat(amount),
        category,
        type,
        transactionDate: date,
      }),
    })

    if (!res.ok) {
      const msg = await res.text()
      throw new Error(msg || "Failed to add transaction")
    }

    setSuccess(true)
    setAmount("")
    setCategory("")
    setType("expense")
    setDate(new Date().toISOString().split("T")[0])
    onSuccess?.()
  } catch (err: any) {
    setError(err.message || "Failed to add transaction")
  } finally {
    setIsLoading(false)
  }
}


  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Add Transaction</CardTitle>
        <CardDescription>Record a new income or expense</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium text-foreground">
                Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as "income" | "expense")}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium text-foreground">
                Amount
              </label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isLoading}
                className="bg-input border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium text-foreground">
              Category
            </label>
            <Input
              id="category"
              type="text"
              placeholder="e.g., Groceries, Salary, Utilities"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isLoading}
              className="bg-input border-border"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium text-foreground">
              Date
            </label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isLoading}
              className="bg-input border-border"
            />
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-100 border border-green-300 rounded text-green-700 text-sm">
              Transaction added successfully!
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Transaction"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

