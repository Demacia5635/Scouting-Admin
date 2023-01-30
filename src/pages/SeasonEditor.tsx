import { getSelectedSeason } from "../utils/season-handler";


export const SeasonEditor = () => {
    const { year, name } = getSelectedSeason();

    return (
        <div>
            <h1>Season: {year} {name}</h1>
        </div>
    );
};