// Auto-generated database types
// This file will be regenerated properly using Supabase CLI

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      [_ in string]: any
    }
    Views: {
      [_ in string]: any
    }
    Functions: {
      [_ in string]: any
    }
    Enums: {
      [_ in string]: any
    }
  }
}
