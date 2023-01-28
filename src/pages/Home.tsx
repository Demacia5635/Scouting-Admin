import { useEffect, useState } from 'react';
import SeasonButton from '../components/html/SeasonButton';
import '../styles/home/seasonbuttonlist.css'
import { SeasonButtonProps } from '../components/types/Season';
import { getSeasons } from '../utils/firebase';
import { movedToSeasonEditor } from '../utils/movetopages';

export const Home = () => {
    const [seasons, setSeasons] = useState<SeasonButtonProps[]>([]);

    useEffect(() => {
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
            <h1 className='title'>Seasons</h1>
            <p onClick={() => movedToSeasonEditor} className='plusbutton'>+</p>
            {seasonsComponents}
        </div>
    );
};