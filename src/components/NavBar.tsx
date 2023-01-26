import '../styles/navbar.css'

export const NavBar = () => {
    return (
        <div className="navbar">
            <a href="/">Home</a>
            <a href="/editor">Season Editor</a>
            <a href="/scouters">Scouters Manager</a>
            <a href="/timetable">Timetable Manager</a>
        </div>
    );
};