import '../../styles/home/seasonbutton.css'

type SeasonButtonProps = {
  seasonNumber: string
  seasonName: string
}

function movedToSeasonEditor() {
  console.log("moved to season editor")
}


const SeasonButton = ({ seasonNumber, seasonName }: SeasonButtonProps) => {
  return (
    <div className="seasonButton" key={seasonNumber} onClick={movedToSeasonEditor}>
      <p className="number">{seasonNumber}</p>
      <p className="line">——</p>
      <p className="name">{seasonName}</p>
    </div>
  )
}

export default SeasonButton