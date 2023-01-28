import '../../styles/home/seasonbutton.css'
import { movedToSeasonEditor } from '../../utils/movetopages'
import { SeasonButtonProps } from '../types/Season'




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