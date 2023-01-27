type SeasonButtonProps = {
  seasonNumber: string
  seasonName: string
}

function movedToSeasonEditor() {
  console.log("moved to season editor")
}


const SeasonButton = ({ seasonNumber, seasonName }: SeasonButtonProps) => {
  return (
    <div style={{ display: 'flex' }} key={seasonNumber} onClick={movedToSeasonEditor}>
      <p style={{ flex: 1, position: 'absolute', left: '0' }}>{seasonNumber}</p>
      <p style={{ flex: 1, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>——</p>
      <p style={{ flex: 1, position: 'absolute', right: '0' }}>{seasonNumber}</p>
    </div>
  )
}

export default SeasonButton