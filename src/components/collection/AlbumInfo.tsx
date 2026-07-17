interface AlbumInfoProps {
  artistName: string
  albumName: string
}

const AlbumInfo = ({ artistName, albumName }: AlbumInfoProps) => {
  return (
    <div className="min-w-0 text-left">
      <p className="text-secondary text-[12px] font-medium uppercase tracking-wider mb-1 truncate">
        {artistName}
      </p>
      <p className="text-primary text-[14px] font-semibold truncate">
        {albumName}
      </p>
    </div>
  )
}

export default AlbumInfo
