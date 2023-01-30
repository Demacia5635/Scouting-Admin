import { useEffect } from "react";
import { resetSeason } from "../utils/season-handler";

export const TimetableManager = () => {

    useEffect(() => {
        resetSeason();
    }, []);

    return (
        <div>
            <h1>Timetable Manager</h1>
        </div>
    );
};