import { supabase } from '@/lib/supabase';

export type EdgeHello = { message: string; time: string };
export type DatabaseHealth = { message: string; checkedAt: string };

function isEdgeHello(value: unknown): value is EdgeHello {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof value.message === 'string' &&
    'time' in value &&
    typeof value.time === 'string'
  );
}

/** Calls the `hello` Edge Function. */
export async function fetchEdgeHello(): Promise<EdgeHello> {
  const { data, error } = await supabase.functions.invoke<unknown>('hello', { method: 'POST' });
  if (error) throw error;
  if (!isEdgeHello(data)) throw new Error('Unexpected response from the hello function');
  return data;
}

/** Reads the single `health_check` row through PostgREST (RLS applies). */
export async function fetchDatabaseHealth(): Promise<DatabaseHealth> {
  const { data, error } = await supabase
    .from('health_check')
    .select('message, checked_at')
    .eq('id', 1)
    .single();
  if (error) throw error;
  return { message: data.message, checkedAt: data.checked_at };
}
