import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { SeasonEditor } from './pages/SeasonEditor';
import { ScoutersManager } from './pages/ScoutersManager';
import { TimetableManager } from './pages/TimetableManager';
import { NavBar } from './components/NavBar';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<SeasonEditor />} />
        <Route path="/scouters" element={<ScoutersManager />} />
        <Route path="/timetable" element={<TimetableManager />} />

        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
    </div>
  );
}

export default App;
