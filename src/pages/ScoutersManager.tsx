import { useEffect } from "react";
import { resetSeason } from "../utils/season-handler";

export const ScoutersManager = () => {

    useEffect(() => {
        resetSeason();
    }, []);

    return (
        <div>
            <h1>Scouters Manager</h1>
        </div>
    );
}