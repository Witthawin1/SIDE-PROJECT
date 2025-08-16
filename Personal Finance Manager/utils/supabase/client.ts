"use client"

import { createClient } from "@supabase/supabase-js"
import { getSupabaseEnv } from "./env"

let browserClient:
  | ReturnType<typeof createClient<Database>>
  | null = null

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      accounts: {
        Row: {
          id: string
          user_id: string
          name: string
          type: "bank" | "credit_card" | "cash" | "other"
          balance: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          name: string
          type: "bank" | "credit_card" | "cash" | "other"
          balance?: number
          created_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["accounts"]["Insert"]>
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          type: "income" | "expense"
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          name: string
          type: "income" | "expense"
          created_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          account_id: string
          category_id: string | null
          amount: number
          currency: string
          note: string | null
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          account_id: string
          category_id?: string | null
          amount: number
          currency?: string
          note?: string | null
          date: string
          created_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["transactions"]["Insert"]>
      }
      budgets: {
        Row: {
          id: string
          user_id: string
          category_id: string
          month: string // YYYY-MM
          amount: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          category_id: string
          month: string
          amount: number
          created_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["budgets"]["Insert"]>
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          created_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          created_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>
      }
    }
    Functions: {}
  }
}

export function getBrowserSupabase() {
  if (browserClient) return browserClient
  const { url, anon } = getSupabaseEnv()
  browserClient = createClient<Database>(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "pfm-auth",
    },
  })
  return browserClient
}
