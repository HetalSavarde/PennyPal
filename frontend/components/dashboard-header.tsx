"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { removeToken } from "@/lib/auth"
import { PennyPalLogo } from "@/components/logo"

interface DashboardHeaderProps {
  username?: string
}

export function DashboardHeader({ username }: DashboardHeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    removeToken()
    router.push("/")
  }

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PennyPalLogo size="sm" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
            PennyPal
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {username && <span className="text-sm text-muted-foreground">Welcome, {username}</span>}
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
