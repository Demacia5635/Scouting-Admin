import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { SeasonEditor } from './pages/SeasonEditor';
import { ScoutersManager } from './pages/ScoutersManager';
import { TimetableManager } from './pages/TimetableManager';
import { NavBar } from './components/NavBar';
import { SeasonRoutes } from './routes/SeasonRoutes';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scouters" element={<ScoutersManager />} />
        <Route path="/timetable" element={<TimetableManager />} />
        <Route element={<SeasonRoutes />}>
          <Route path="/editor" element={<SeasonEditor />} />
        </Route>

        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
    </div>
  );
}

export default App;
