// create a home page component
import { useEffect, useState } from 'react';
import SeasonButton from '../components/html/SeasonButton';
import { SeasonButtonProps } from '../components/types/Season';
import { getSeasons } from '../utils/firebase';

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
        <div>
            {seasonsComponents}
        </div>
    );
};