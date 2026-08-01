interface ParsedDiscogsTitle {
  artist_name: string
  album_name: string
}

export const parseDiscogsTitle = (title: string): ParsedDiscogsTitle => {
  const separatorIndex = title.indexOf(' - ')

  if (separatorIndex === -1) {
    return { artist_name: '', album_name: title }
  }

  // Discogs 동명이인 아티스트에 붙는 "(2)", "(8)" 같은 접미사 제거 — 화면 표시와 iTunes 검색어 양쪽에 영향을 주므로 이 시점에서 한 번에 정리
  const artistName = title.slice(0, separatorIndex).replace(/\s\(\d+\)$/, '')

  return {
    artist_name: artistName,
    album_name: title.slice(separatorIndex + 3),
  }
}
