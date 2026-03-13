const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

import { getAuthHeaders } from "./auth"

// ----------------------
// Interfaces
// ----------------------
export interface Transaction {
  id: number
  amount: number
  category: string
  type: "income" | "expense"
  transactionDate: string
}

export interface UserGroup {
  id: number
  name: string
  owner: string
  members: string[]
  createdAt: string
}

export interface BillShare {
  id: number
  billId: number
  description: string
  creator: string
  groupName?: string
  amount: number
  settled: boolean
  createdAt: string
}

// ✅ New interfaces (safe additions)
export interface Bill {
  id: number
  groupId: number
  description: string
  amount: number
  createdBy: string
  createdAt: string
}

export interface GroupDetail extends UserGroup {
  bills: Bill[]
}

// ----------------------
// Transaction APIs
// ----------------------
export const transactionAPI = {
  // ✅ Add Transaction (includes JWT)
  add: async (transaction: any) => {
    const token = localStorage.getItem("token")
    const res = await fetch(`${API_BASE_URL}/api/transactions/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(transaction),
    })
    if (!res.ok) throw new Error("Failed to add transaction")
    return res.json()
  },

  // ✅ Get all transactions for logged-in user
  getAll: async () => {
    const token = localStorage.getItem("token")
    const res = await fetch(`${API_BASE_URL}/api/transactions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    if (!res.ok) throw new Error("Failed to fetch transactions")
    return res.json()
  },
}

// ----------------------
// Bill APIs
// ----------------------
export const billAPI = {
  // ✅ Get all groups of the user
  getGroups: async (): Promise<UserGroup[]> => {
    const response = await fetch(`${API_BASE_URL}/api/bills/groups`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch groups")
    return response.json()
  },

  // ✅ Create a new group
  createGroup: async (name: string, members: string[]): Promise<UserGroup> => {
    const response = await fetch(`${API_BASE_URL}/api/bills/groups`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, members }),
    })
    if (!response.ok) throw new Error("Failed to create group")
    return response.json()
  },

  // ✅ Get user's bill shares
  getMyShares: async (): Promise<BillShare[]> => {
    const response = await fetch(`${API_BASE_URL}/api/bills/my-shares`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch shares")
    return response.json()
  },

  // ✅ Create bill split
  createBillSplit: async (data: any): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/bills/split`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to create bill split")
    return response.json()
  },

  // ✅ Settle a share
  settleShare: async (shareId: number): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}api//bills/shares/${shareId}/settle`, {
      method: "POST",
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to settle share")
    return response.json()
  },

  // ✅ (New, safe addition) Get detailed info of a group
  getGroupDetail: async (groupId: number): Promise<GroupDetail> => {
    const response = await fetch(`${API_BASE_URL}/api/bills/groups/${groupId}`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch group details")
    return response.json()
  },

  // ✅ (New, safe addition) Get bills under a specific group
  getGroupBills: async (groupId: number): Promise<Bill[]> => {
    const response = await fetch(`${API_BASE_URL}/bills/groups/${groupId}/bills`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch group bills")
    return response.json()
  },

  // ✅ (New, safe addition) Create a new bill in a group
  createBill: async (groupId: number, description: string, amount: number): Promise<Bill> => {
    const response = await fetch(`${API_BASE_URL}/bills/groups/${groupId}/bills`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ description, amount }),
    })
    if (!response.ok) throw new Error("Failed to create bill")
    return response.json()
  },
}
