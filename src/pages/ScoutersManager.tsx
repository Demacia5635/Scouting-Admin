import { useEffect } from "react";
import { Select } from "../components/html/Select";
import { getfieldvalue, getSeasons } from "../utils/firebase";
import { resetSeason } from "../utils/season-handler";





export const ScoutersManager = () => {

    useEffect(() => {
        resetSeason();
    }, []);
    return (
        <div>
            <h1>Scouters Manager</h1>
            {/* <Select id="teamselectmenu" options={[{"paso"}]}></Select> */}

        </div>
    );
}