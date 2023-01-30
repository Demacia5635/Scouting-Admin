import { useNavigate } from 'react-router-dom';
import '../styles/navbar.css'
import { Button } from './html/Button';

export const NavBar = () => {

    const navigate = useNavigate();

    return (
        <div className="navbar">
            <Button handleClick={() => navigate('/')}>Home</Button>
            <Button handleClick={() => navigate('/editor')}>Season Editor</Button>
            <Button handleClick={() => navigate('/scouters')}>Scouters Manager</Button>
            <Button handleClick={() => navigate('/timetable')}>Timetable Manager</Button>
        </div>
    );
};