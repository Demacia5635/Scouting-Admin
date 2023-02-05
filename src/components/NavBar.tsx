import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

export const NavBar = () => {

    const navigate = useNavigate();

    return (
        <div className="navbar">
            <Button size='large' type='primary' onClick={() => navigate('/')}>
                Home
            </Button>
            <Button size='large' type='primary' onClick={() => navigate('/editor')}>
                Season Editor
            </Button>
            <Button size='large' type='primary' onClick={() => navigate('/scouters')}>
                Scouters Manager
            </Button>
            <Button size='large' type='primary' onClick={() => navigate('/timetable')}>

                Timetable Manager
            </Button>
        </div>
    );
};