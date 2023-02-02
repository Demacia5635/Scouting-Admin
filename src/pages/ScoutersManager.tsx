import { useEffect } from "react";
import { resetSeason } from "../utils/season-handler";
import { DropDownMenu } from "../components/DropDownMenu";

export const ScoutersManager = () => {

    useEffect(() => {
        resetSeason();
    }, []);

    return (
        <div>
            <h1>Scouters Manager</h1>
            <DropDownMenu/>
        </div>
    );
}