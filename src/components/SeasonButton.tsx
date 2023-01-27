import '../../styles/home/seasonbutton.css'
import { SeasonButtonProps } from './types/Season'

function movedToSeasonEditor(props: SeasonButtonProps) {
  sessionStorage.setItem('seasonYear', props.year)
  sessionStorage.setItem('seasonName', props.name)
}


const SeasonButton = ({ year, name }: SeasonButtonProps) => {
  return (
    <div className="seasonButton" key={year} onClick={() => movedToSeasonEditor({ year, name })}>
      <p className="number">{year}</p>
      <p className="line">——</p>
      <p className="name">{name}</p>
    </div>
  )
}

export default SeasonButton