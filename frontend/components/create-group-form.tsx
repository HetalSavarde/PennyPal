"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { billAPI } from "@/lib/api"

interface CreateGroupFormProps {
  onSuccess?: () => void
}

export function CreateGroupForm({ onSuccess }: CreateGroupFormProps) {
  const [groupName, setGroupName] = useState("")
  const [members, setMembers] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!groupName || !members) {
      setError("Please fill in all fields")
      return
    }

    const memberList = members.split(",").map((m) => m.trim())

    setIsLoading(true)

    try {
      await billAPI.createGroup(groupName, memberList)
      setSuccess(true)
      setGroupName("")
      setMembers("")
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create group")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Create Group</CardTitle>
        <CardDescription>Create a new group for bill splitting</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="groupName" className="text-sm font-medium text-foreground">
              Group Name
            </label>
            <Input
              id="groupName"
              type="text"
              placeholder="e.g., Apartment, Trip, Project"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              disabled={isLoading}
              className="bg-input border-border"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="members" className="text-sm font-medium text-foreground">
              Members (comma-separated usernames)
            </label>
            <Input
              id="members"
              type="text"
              placeholder="john, jane, bob"
              value={members}
              onChange={(e) => setMembers(e.target.value)}
              disabled={isLoading}
              className="bg-input border-border"
            />
            <p className="text-xs text-muted-foreground">Enter usernames separated by commas</p>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-100 border border-green-300 rounded text-green-700 text-sm">
              Group created successfully!
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Group"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
