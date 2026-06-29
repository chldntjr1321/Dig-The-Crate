import supabase from '../lib/supabase'
import type { Collection } from '../types'

export const getCollections = async (userId: string): Promise<Collection[]> => {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('user_id', userId)

  if (error) throw error

  return data as Collection[]
}
