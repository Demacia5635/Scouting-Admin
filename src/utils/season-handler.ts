import { NavigateFunction } from "react-router-dom";
import { SeasonButtonProps } from "../components/types/Season";

export function moveToSeasonEditor(props: SeasonButtonProps, navigate: NavigateFunction) {
    saveSeason(props);
    navigate('/editor');
}

export function saveSeason(props: SeasonButtonProps) {
    sessionStorage.setItem('seasonYear', props.year)
    sessionStorage.setItem('seasonName', props.name)
}

export function isSeasonSaved() {
    return sessionStorage.getItem('seasonYear') && sessionStorage.getItem('seasonName');
}

export function getSelectedSeason(): SeasonButtonProps {
    return {
        year: sessionStorage.getItem("seasonYear")!,
        name: sessionStorage.getItem("seasonName")!,
    }
}

export function resetSeason() {
    sessionStorage.removeItem('seasonYear');
    sessionStorage.removeItem('seasonName');
}