export const GENRES = ['All', 'Jazz', 'Rock', 'Electronic', 'Classical', 'Hip Hop', 'R&B'] as const
export type Genre = (typeof GENRES)[number]
