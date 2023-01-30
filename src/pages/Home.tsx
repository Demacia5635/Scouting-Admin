import { useEffect, useState } from 'react';
import SeasonButton from '../components/SeasonButton';
import { SeasonButtonProps } from '../components/types/Season';
import { getSeasons } from '../utils/firebase';
import { moveToSeasonEditor, resetSeason } from '../utils/season-handler';
import '../styles/home/seasonbuttonlist.css'

export const Home = () => {
    const [seasons, setSeasons] = useState<SeasonButtonProps[]>([]);

    useEffect(() => {
        resetSeason();
        async function updateSeasons() {
            const seasons = await getSeasons();
            setSeasons(seasons);
        }
        updateSeasons();
    }, []);


    const seasonsComponents = seasons.map((season) => {
        return <SeasonButton name={season.name} year={season.year} />
    });


    return (
        <div className='seasonbuttonlist'>
            <h1 className='title'>Select Season</h1>
            <p onClick={() => moveToSeasonEditor} className='plusbutton'>+</p>
            {seasonsComponents}
        </div>
    );
};