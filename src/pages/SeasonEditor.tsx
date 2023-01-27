import { SeasonButtonProps } from "../components/types/Season";

function getSeason(): SeasonButtonProps {
    return {
        year: sessionStorage.getItem("seasonYear")!,
        name: sessionStorage.getItem("seasonName")!,
    }
}


export const SeasonEditor = () => {
    const { year, name } = getSeason();

    return (
        <div>
            <h1>Season: {year} {name}</h1>
        </div>
    );
};