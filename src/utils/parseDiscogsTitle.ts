interface ParsedDiscogsTitle {
  artist_name: string
  album_name: string
}

export const parseDiscogsTitle = (title: string): ParsedDiscogsTitle => {
  const separatorIndex = title.indexOf(' - ')

  if (separatorIndex === -1) {
    return { artist_name: '', album_name: title }
  }

  return {
    artist_name: title.slice(0, separatorIndex),
    album_name: title.slice(separatorIndex + 3),
  }
}
