import { PlusOutlined } from '@ant-design/icons';
import { Button, ConfigProvider } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NewSeason } from '../components/popups/NewSeason';
import SeasonButton from '../components/SeasonButton';
import { SeasonButtonProps } from '../components/types/Season';
import '../styles/home/seasonbuttonlist.css';
import { getSeasons } from '../utils/firebase';
import { moveToSeasonEditor, resetSeason } from '../utils/season-handler';

export const Home = () => {
    const [seasons, setSeasons] = useState<SeasonButtonProps[]>([]);
    const navigator = useNavigate();

    useEffect(() => {
        resetSeason();
        async function updateSeasons() {
            const seasons = await getSeasons();
            setSeasons(seasons);
        }
        updateSeasons();
    }, []);


    const seasonsComponents = seasons.map((season) => {
        return <SeasonButton key={season.year} name={season.name} year={season.year} />
    });


    return (
        <div className='seasonbuttonlist'>
            <ConfigProvider
                theme={
                    {
                        token: {
                            colorPrimary: '#9002b3'
                        }
                    }
                }
            >
                <h1 className='title'>Select Season</h1>
                <NewSeason seasons={seasons} navigator={navigator}/>
                {seasonsComponents}
            </ConfigProvider>
        </div>
    );
};