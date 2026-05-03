'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Table } from '@/types/table'

export function useRealtimeTables() {
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mounted = useRef(false)

  useEffect(() => {
    if (mounted.current) return
    mounted.current = true

    const fetchTables = async () => {
      const { data, error } = await supabase
        .from('tables')
        .select('*')
        .order('name')

      if (error) {
        setError(error.message)
      } else {
        setTables(data ?? [])
      }
      setLoading(false)
    }

    // Defer fetch slightly to not block initial paint
    const timer = setTimeout(fetchTables, 100)

    const channel = supabase
      .channel('tables-realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'tables' },
        (payload) => {
          setTables((prev) =>
            prev.map((t) =>
              t.id === payload.new.id ? { ...t, ...(payload.new as Table) } : t
            )
          )
        }
      )
      .subscribe()

    return () => {
      clearTimeout(timer)
      supabase.removeChannel(channel)
    }
  }, [])

  return { tables, loading, error }
}