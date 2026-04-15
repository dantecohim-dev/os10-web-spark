export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      checklist_items: {
        Row: {
          checklist_id: string
          created_at: string
          description: string
          id: string
          sort_order: number
        }
        Insert: {
          checklist_id: string
          created_at?: string
          description: string
          id?: string
          sort_order?: number
        }
        Update: {
          checklist_id?: string
          created_at?: string
          description?: string
          id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "checklists"
            referencedColumns: ["id"]
          },
        ]
      }
      checklists: {
        Row: {
          company_id: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklists_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      client_addresses: {
        Row: {
          city: string | null
          client_id: string
          complement: string | null
          created_at: string
          id: string
          label: string | null
          neighborhood: string | null
          number: string | null
          state: string | null
          street: string | null
          zip: string | null
        }
        Insert: {
          city?: string | null
          client_id: string
          complement?: string | null
          created_at?: string
          id?: string
          label?: string | null
          neighborhood?: string | null
          number?: string | null
          state?: string | null
          street?: string | null
          zip?: string | null
        }
        Update: {
          city?: string | null
          client_id?: string
          complement?: string | null
          created_at?: string
          id?: string
          label?: string | null
          neighborhood?: string | null
          number?: string | null
          state?: string | null
          street?: string | null
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_addresses_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_contracts: {
        Row: {
          client_id: string
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          title: string
        }
        Insert: {
          client_id: string
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          title: string
        }
        Update: {
          client_id?: string
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_contracts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          active: boolean
          company_id: string
          created_at: string
          email: string | null
          id: string
          identifier: string | null
          name: string
          notes: string | null
          phone: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          company_id: string
          created_at?: string
          email?: string | null
          id?: string
          identifier?: string | null
          name: string
          notes?: string | null
          phone: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          company_id?: string
          created_at?: string
          email?: string | null
          id?: string
          identifier?: string | null
          name?: string
          notes?: string | null
          phone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address_city: string | null
          address_neighborhood: string | null
          address_number: string | null
          address_state: string | null
          address_street: string | null
          address_zip: string | null
          cnpj: string | null
          cpf: string | null
          created_at: string
          email: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          responsibility_term: string | null
          updated_at: string
        }
        Insert: {
          address_city?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip?: string | null
          cnpj?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          responsibility_term?: string | null
          updated_at?: string
        }
        Update: {
          address_city?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip?: string | null
          cnpj?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          responsibility_term?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      order_checklist_items: {
        Row: {
          checked: boolean
          created_at: string
          description: string
          id: string
          order_checklist_id: string
          sort_order: number
        }
        Insert: {
          checked?: boolean
          created_at?: string
          description: string
          id?: string
          order_checklist_id: string
          sort_order?: number
        }
        Update: {
          checked?: boolean
          created_at?: string
          description?: string
          id?: string
          order_checklist_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_checklist_items_order_checklist_id_fkey"
            columns: ["order_checklist_id"]
            isOneToOne: false
            referencedRelation: "order_checklists"
            referencedColumns: ["id"]
          },
        ]
      }
      order_checklists: {
        Row: {
          checklist_id: string | null
          created_at: string
          id: string
          name: string
          order_id: string
          order_service_id: string | null
        }
        Insert: {
          checklist_id?: string | null
          created_at?: string
          id?: string
          name: string
          order_id: string
          order_service_id?: string | null
        }
        Update: {
          checklist_id?: string | null
          created_at?: string
          id?: string
          name?: string
          order_id?: string
          order_service_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_checklists_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "checklists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_checklists_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_checklists_order_service_id_fkey"
            columns: ["order_service_id"]
            isOneToOne: false
            referencedRelation: "order_services"
            referencedColumns: ["id"]
          },
        ]
      }
      order_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          is_internal: boolean
          order_id: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_internal?: boolean
          order_id: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_internal?: boolean
          order_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_comments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_locations: {
        Row: {
          id: string
          latitude: number
          longitude: number
          order_id: string
          recorded_at: string
          recorded_by: string | null
        }
        Insert: {
          id?: string
          latitude: number
          longitude: number
          order_id: string
          recorded_at?: string
          recorded_by?: string | null
        }
        Update: {
          id?: string
          latitude?: number
          longitude?: number
          order_id?: string
          recorded_at?: string
          recorded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_locations_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          method: string
          notes: string | null
          order_id: string
          paid_at: string
          receipt_url: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          method: string
          notes?: string | null
          order_id: string
          paid_at?: string
          receipt_url?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          method?: string
          notes?: string | null
          order_id?: string
          paid_at?: string
          receipt_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_photos: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          order_id: string
          photo_url: string
          stage: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          order_id: string
          photo_url: string
          stage?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          order_id?: string
          photo_url?: string
          stage?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_photos_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_products: {
        Row: {
          created_at: string
          discount_pct: number | null
          id: string
          name: string
          order_id: string
          price: number
          product_id: string | null
          quantity: number
          subtotal: number | null
        }
        Insert: {
          created_at?: string
          discount_pct?: number | null
          id?: string
          name: string
          order_id: string
          price: number
          product_id?: string | null
          quantity?: number
          subtotal?: number | null
        }
        Update: {
          created_at?: string
          discount_pct?: number | null
          id?: string
          name?: string
          order_id?: string
          price?: number
          product_id?: string | null
          quantity?: number
          subtotal?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_products_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_services: {
        Row: {
          checklist_id: string | null
          created_at: string
          id: string
          name: string
          order_id: string
          price: number
          quantity: number
          service_id: string | null
          subtotal: number | null
        }
        Insert: {
          checklist_id?: string | null
          created_at?: string
          id?: string
          name: string
          order_id: string
          price: number
          quantity?: number
          service_id?: string | null
          subtotal?: number | null
        }
        Update: {
          checklist_id?: string | null
          created_at?: string
          id?: string
          name?: string
          order_id?: string
          price?: number
          quantity?: number
          service_id?: string | null
          subtotal?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_services_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "checklists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_services_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      order_signatures: {
        Row: {
          id: string
          order_id: string
          signature_data: string
          signed_at: string
          signer_name: string | null
        }
        Insert: {
          id?: string
          order_id: string
          signature_data: string
          signed_at?: string
          signer_name?: string | null
        }
        Update: {
          id?: string
          order_id?: string
          signature_data?: string
          signed_at?: string
          signer_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_signatures_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          assigned_to: string | null
          client_address_id: string | null
          client_id: string | null
          company_id: string
          created_at: string
          created_by: string | null
          delivery_date: string | null
          discount: number | null
          id: string
          internal_notes: string | null
          object_description: string | null
          order_number: number
          public_notes: string | null
          repeat_days: number | null
          service_date: string | null
          status: Database["public"]["Enums"]["order_status"]
          title: string | null
          total: number | null
          type: Database["public"]["Enums"]["order_type"]
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          client_address_id?: string | null
          client_id?: string | null
          company_id: string
          created_at?: string
          created_by?: string | null
          delivery_date?: string | null
          discount?: number | null
          id?: string
          internal_notes?: string | null
          object_description?: string | null
          order_number?: number
          public_notes?: string | null
          repeat_days?: number | null
          service_date?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          title?: string | null
          total?: number | null
          type?: Database["public"]["Enums"]["order_type"]
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          client_address_id?: string | null
          client_id?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          delivery_date?: string | null
          discount?: number | null
          id?: string
          internal_notes?: string | null
          object_description?: string | null
          order_number?: number
          public_notes?: string | null
          repeat_days?: number | null
          service_date?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          title?: string | null
          total?: number | null
          type?: Database["public"]["Enums"]["order_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_client_address_id_fkey"
            columns: ["client_address_id"]
            isOneToOne: false
            referencedRelation: "client_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean
          charge_on_os: boolean
          company_id: string
          created_at: string
          description: string | null
          id: string
          max_discount: number | null
          name: string
          price: number
          stock: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          charge_on_os?: boolean
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          max_discount?: number | null
          name: string
          price?: number
          stock?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          charge_on_os?: boolean
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          max_discount?: number | null
          name?: string
          price?: number
          stock?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          business_area: string | null
          company_id: string | null
          created_at: string
          full_name: string | null
          id: string
          origin: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          business_area?: string | null
          company_id?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          origin?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          business_area?: string | null
          company_id?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          origin?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      quick_sale_items: {
        Row: {
          created_at: string
          id: string
          name: string
          price: number
          product_id: string | null
          quantity: number
          quick_sale_id: string
          subtotal: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          price: number
          product_id?: string | null
          quantity?: number
          quick_sale_id: string
          subtotal?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          price?: number
          product_id?: string | null
          quantity?: number
          quick_sale_id?: string
          subtotal?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quick_sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quick_sale_items_quick_sale_id_fkey"
            columns: ["quick_sale_id"]
            isOneToOne: false
            referencedRelation: "quick_sales"
            referencedColumns: ["id"]
          },
        ]
      }
      quick_sales: {
        Row: {
          company_id: string
          created_at: string
          id: string
          notes: string | null
          payment_method: string
          sold_at: string
          sold_by: string | null
          total: number
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          notes?: string | null
          payment_method: string
          sold_at?: string
          sold_by?: string | null
          total: number
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          payment_method?: string
          sold_at?: string
          sold_by?: string | null
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "quick_sales_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      service_price_table: {
        Row: {
          created_at: string
          id: string
          label: string
          price: number
          service_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          price: number
          service_id: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          price?: number
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_price_table_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_repeats: {
        Row: {
          client_id: string | null
          company_id: string
          completed: boolean
          created_at: string
          description: string | null
          id: string
          next_contact_date: string
          order_id: string | null
        }
        Insert: {
          client_id?: string | null
          company_id: string
          completed?: boolean
          created_at?: string
          description?: string | null
          id?: string
          next_contact_date: string
          order_id?: string | null
        }
        Update: {
          client_id?: string | null
          company_id?: string
          completed?: boolean
          created_at?: string
          description?: string | null
          id?: string
          next_contact_date?: string
          order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_repeats_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_repeats_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_repeats_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          active: boolean
          company_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          price: number
          unit: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          price?: number
          unit?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          price?: number
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          checklist_limit: number
          company_id: string
          created_at: string
          expires_at: string | null
          id: string
          os_limit_monthly: number
          plan: string
          sales_limit_monthly: number
          started_at: string
          updated_at: string
        }
        Insert: {
          checklist_limit?: number
          company_id: string
          created_at?: string
          expires_at?: string | null
          id?: string
          os_limit_monthly?: number
          plan?: string
          sales_limit_monthly?: number
          started_at?: string
          updated_at?: string
        }
        Update: {
          checklist_limit?: number
          company_id?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          os_limit_monthly?: number
          plan?: string
          sales_limit_monthly?: number
          started_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          company_id: string
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_company_for_current_user: {
        Args: {
          _cnpj?: string
          _cpf?: string
          _email?: string
          _name: string
          _phone?: string
        }
        Returns: string
      }
      get_user_company_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _company_id: string
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "technician" | "attendant" | "viewer"
      order_status:
        | "quote"
        | "authorized"
        | "in_progress"
        | "completed"
        | "lost"
      order_type: "os" | "quote"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "technician", "attendant", "viewer"],
      order_status: ["quote", "authorized", "in_progress", "completed", "lost"],
      order_type: ["os", "quote"],
    },
  },
} as const
