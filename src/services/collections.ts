import supabase from '../lib/supabase'
import { getReleaseDetail } from './discogs'
import { GUEST_INITIAL_COLLECTION } from './guestInitialCollection'
import type { Collection, SearchResult } from '../types'

export class DuplicateCollectionError extends Error {}

export const getCollections = async (userId: string): Promise<Collection[]> => {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('user_id', userId)

  if (error) throw error

  return data as Collection[]
}

export const deleteCollection = async (id: string): Promise<void> => {
  const { error } = await supabase.from('collections').delete().eq('id', id)

  if (error) throw error
}

export const addCollection = async (
  userId: string,
  album: SearchResult,
): Promise<Collection> => {
  const tracklist = await getReleaseDetail(album.discogs_id)

  const { data, error } = await supabase
    .from('collections')
    .insert({
      user_id: userId,
      discogs_id: album.discogs_id,
      album_name: album.album_name,
      artist_name: album.artist_name,
      cover_url: album.cover_url,
      year: album.year,
      genres: album.genres,
      tracklist,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') throw new DuplicateCollectionError('이미 컬렉션에 있는 앨범이에요')
    throw error
  }

  return data as Collection
}

export const resetGuestCollection = async (userId: string): Promise<void> => {
  const { error: deleteError } = await supabase.from('collections').delete().eq('user_id', userId)
  if (deleteError) throw deleteError

  const rows = GUEST_INITIAL_COLLECTION.map((album) => ({
    user_id: userId,
    discogs_id: album.discogs_id,
    album_name: album.album_name,
    artist_name: album.artist_name,
    cover_url: album.cover_url,
    year: album.year,
    genres: album.genres,
    tracklist: album.tracklist,
  }))

  const { error: insertError } = await supabase.from('collections').insert(rows)
  if (insertError) throw insertError
}
