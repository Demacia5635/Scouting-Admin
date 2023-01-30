import { useNavigate } from 'react-router-dom'
import '../styles/home/seasonbutton.css'
import { moveToSeasonEditor } from '../utils/season-handler'
import { SeasonButtonProps } from './types/Season'

const SeasonButton = ({ year, name }: SeasonButtonProps) => {

  const navigate = useNavigate();

  return (
    <div className="seasonButton" key={year} onClick={() => moveToSeasonEditor({ year, name }, navigate)}>
      <table className="table">
        <tbody>
          <tr>
            <td className="space"></td>
            <td className="number">{year}</td>
            <td className="line">——</td>
            <td className="name">{name}</td>
            <td className="space"></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default SeasonButton